class Api::V3::Accounts::CampaignsController < Api::V1::Accounts::BaseController
  include Api::V3::Accounts::Concerns::ChannelEmailSchedulerService
  include Api::V3::Accounts::Concerns::ChannelWhatsappSchedulerService
  include Api::V3::Accounts::Concerns::Campaignable
  include Api::V3::Accounts::Concerns::PersonaliseMessage

  include ExportCsv
  include ExportPdf
  include ExportExcel
  include Pagination

  before_action :check_authorization
  before_action :find_campaign, except: [:show, :get_campaign_analytics, :personalize_message]
  before_action :fetch_common_attributes, only: [:perform_test, :test_sms_message_via_tatasms]
  before_action :find_channel, only: [:perform_test, :test_sms_message_via_tatasms]

  def index
    campaigns = Current.account.campaigns.search(params)
    @metrics = Current.account.campaigns.metrics
    current_page = params[:page] || CURRENT_PAGE
    limit = params[:limit] || LIMIT_PER_PAGE
    @campaigns = campaigns.page(current_page.to_i).per(limit.to_i)
    @pagination_values = pagination_values(@campaigns)
    respond_to do |format|
      format.json
      format.csv { send_csv_data(campaigns) }
      format.pdf { send_pdf_data(campaigns) }
      format.xlsx { send_excel_data(campaigns) }
      format.all { render json: { message: I18n.t('campaigns.errors.invalid_format') }, status: :unprocessable_entity }
    end
  end

  def create
    if params[:action_type] == STATUS_DRAFT
      draft_campaign
      return render json: @campaign, status: :created if @campaign.save && @campaignable.save
    else
      load_channel
      create_campaign
    end
  end

  def show
    @campaign = Current.account.campaigns.find(params[:id])
    @channel = @campaign.channel_type&.constantize&.find(@campaign.channel_id) if @campaign.present? && @campaign.channel_id.present?
    @contact_event_filter = Current.account.contact_event_filters.find_by(campaign_id: @campaign.id) if @campaign.present?
    return  render json: { message: "campaign not found" }, status: :unprocessable_entity unless @campaign.present?
  end

  def calculate_metrics
    account = Account.find(params[:account_id])
    if account
      campaigns = account.campaigns

      total_campaign_revenue = campaigns.sum(:total_order_value)
      total_conversion_events = campaigns.sum(:number_of_conversion_events)
      total_unique_conversions = campaigns.sum(:number_of_unique_conversions)

      average_order_value = total_campaign_revenue / total_conversion_events.to_f if total_conversion_events.positive?
      average_revenue_per_user = total_campaign_revenue / total_unique_conversions.to_f if total_unique_conversions.positive?

      metrics = {
        total_campaign_revenue: total_campaign_revenue,
        average_order_value: average_order_value,
        average_revenue_per_user: average_revenue_per_user
      }

      render json: metrics
    else
      render json: { error: 'Account not found' }, status: :not_found
    end
  end

  def calculate_revenue
    account = Account.find(params[:account_id])
    campaign = account.campaigns.find(params[:id])
    if campaign
      total_campaign_revenue = campaign.total_order_value
      total_conversion_events = campaign.number_of_conversion_events
      total_unique_conversions = campaign.number_of_unique_conversions

      average_order_value = total_campaign_revenue / total_conversion_events.to_f if total_conversion_events.positive?
      average_revenue_per_user = total_campaign_revenue / total_unique_conversions.to_f if total_unique_conversions.positive?

      metrics = {
        total_campaign_revenue: total_campaign_revenue,
        average_order_value: average_order_value,
        average_revenue_per_user: average_revenue_per_user
      }

      render json: metrics
    else
      render json: { error: 'Account not found' }, status: :not_found
    end
  end

  def campaign_info
    @campaign = Current.account.campaigns.find_by(id: params[:campaign_id])
    if params[:campaign_id].present? && @campaign.present?
      @campaign_goals = @campaign.campaign_goals
      @goal_event = @campaign.campaign_goals.joins(:goal_events)
      @sms_info = { message: "Hi, This is first message for sms campaign" }
    else
      render json: { message: "campaign not found" }, status: :ok
    end
  end

  def personalize_message
    message = ''
    contact = Current.account.contacts.order("RANDOM()").take
    if params[:mapping].blank? || params[:message].blank?
      render json: { status: false, error_message: "Params of message or mapping can't be blank." }
      return
    else
      test_array = []
      if params[:mapping][:custom_params].present?
        params[:mapping][:custom_params].each do |element|
          test_array.push(element)
        end
      else
        test_array.push(params[:mapping])
      end
      new_params = {}
      test_array.each do |element|
        parameters =  element[:parameters] ? element[:parameters] : element
        parameters.each do |mapk, mapv|
          if contact.attributes.keys.include?("#{mapv}")
            custom_attribute = contact.read_attribute("#{mapv}")
            value = custom_attribute.blank? ? '' : custom_attribute
            new_params[:"{#{mapk}}"] = convert_tinyurl(value)
          else
            if Current.account.custom_attribute_definitions.column_names.include?("#{mapv}")
              custom_attribute = Current.account.custom_attribute_definitions.where(attribute_model: "contact_attribute").pluck("#{mapv}").sample
              value = custom_attribute.blank? ? '' : custom_attribute
              new_params[:"{#{mapk}}"] = convert_tinyurl(value)
            else
              new_params[:"#{mapk}"] = ''
            end
          end
          if params[:campaign_channel_type] == WHATSAPP_DOWNCASE
            new_params.each do |k, v|
              if element[:text].include? "{#{k}}"
                element[:text].gsub!("{#{k}}", v)
              end
            end
          end
        end
      end
      if params[:campaign_channel_type] == WHATSAPP_DOWNCASE
        params[:mapping][:custom_params].each do |element|
          message += element[:text] + "\n"
        end
      end
      if params[:campaign_channel_type] != WHATSAPP_DOWNCASE
        new_params.each do |k, v|
          if params[:message].include? "{#{k}}"
            message = params[:message].gsub!("{#{k}}", v)
          end
        end
      end
    end
    render json: { status: :ok, data: { personalize_message: message, personalise_mapping_attribute: params[:mapping] },
                   message: "Message personalize successfully." }
  end

  def test_sms_message_via_tatasms
    responses = []
    @contacts.each do |contact|
      if params[:personalise_mapping_attribute].present?
        message = personlise_custom_messages(@message, contact, params[:personalise_mapping_attribute])
      else
        message = @message
      end
      responses << ChannelSmsService.send_sms_message(@channel, contact, @template, message)
    end
    render json: { message: "SMS Test has been performed successfully." }
  end

  # To test email campaigns on step-2
  def test_campaign_via_tataemail
    channel = Current.account.email_channels.find(params[:channel_email_id])
    template = EmailTemplate.get_email_template(params[:template_id])
    if template.present? && channel.present?
      contacts = Contact.fetch_contacts_to_send_campaigns(params[:segment_id], params[:emails])
      if contacts.present?
        contact_ids = contacts.pluck(:id)
        options = { contact_ids: contact_ids, channel: channel.id, subject: params[:subject], sender_name: params[:sender_name],
                    from_email_address: params[:from_email_address], reply_to_email_address: [:reply_to_email_address], selected_contact_attribute: params[:selected_contact_attribute], htmlContent: template.body, account_id: params[:account_id] }.with_indifferent_access.to_json
        email_response = send_emails(options)
        render json: { message: I18n.t('campaigns.success.email_message') }
      else
        render json: { message: I18n.t('campaigns.errors.contact_not_found') }, status: :unprocessable_entity
      end
    else
      render json: { message: I18n.t('campaigns.errors.parameter_missing') }, status: :unprocessable_entity
    end
  rescue StandardError => e
    render_could_not_create_error(e.message)
  end

  def test_whatsapp
    responses = send_whatsapp_message(@channel, @contacts)
    render json: { message: "Whatsapp Test has been performed successfully.", data: responses }
  end

  def perform_test
    campaign_type = params[:campaign_type]
    case campaign_type.to_sym
    when :sms
      test_sms_message_via_tatasms
    when :whatsapp
      test_whatsapp
    when :email
      test_campaign_via_tataemail
    else
      render_error("Channel Type not supported!!")
    end
  end

  def update
    case params[:action_type]&.to_sym
    when :cancel
      @campaign.cancel!
      @campaign.campaign_scheduler.cancel!
    when :pause
      @campaign.pause!
    when :resume
      @campaign.resume!
    when :draft
      draft_campaign
      return render json: @campaign, status: :created
    when :publish
      load_channel
      draft_campaign
      personalise_mapping_attribute = params[:campaign][:personalise_mapping_attribute]
      CampaignSchedulerService.schedule_campaign(@campaign, @campaign_scheduler) if campaign_scheduler_params.present?
      return render json: @campaign, status: :created
    else
      render json: { message: I18n.t('campaigns.errors.action_not_supported') }, status: :unprocessable_entity
    end
    return render json: { message: I18n.t("campaigns.success.#{params[:action_type]}") }, status: :ok
  end

  def reschedule
    return render json: { message: I18n.t('campaigns.errors.invalid_transition') }, status: :unprocessable_entity unless @campaign.may_schedule?

    scheduler_params = CampaignSchedulerService.time_zone_consideration(campaign_scheduler_params)
    if @campaign.campaign_scheduler.present?
      @campaign.campaign_scheduler.update(scheduler_params)
    else
      @campaign.campaign_scheduler.create(scheduler_params)
    end
    render json: { campaign_scheduler: @campaign.campaign_scheduler, message: "Campaign rescheduled successfully." }
  end

  def generate_tiny_url_report
    if @campaign
      if @campaign.campaign_sync.present?
        @campaign.campaign_sync.update(status: 1)
      else
        CampaignSync.create!(status: 1, campaign_id: @campaign.id, account_id: Current.account.id)
      end
      @campaign.trigger_click_count_report
      render json: { message: "Report Job Triggered", campaign: @campaign.get_analytics }
    else
      render json: { message: "Resource could not be found" }, status: :not_found
    end
  end

  private

  def load_channel
    if campaign_params[:inbox_id].present?
      inbox = Current.account.inboxes.find_by(id: campaign_params[:inbox_id])
      @channel = inbox&.channel
      render json: { errors: I18n.t('errors.channel_not_found') }, status: :unprocessable_entity unless @channel.present?
    else
      render json: { errors: I18n.t('errors.channel_not_present') },
             status: :unprocessable_entity unless campaign_params[:channel_id].present? || campaign_params[:channel_type].present?
      @channel =  case campaign_params[:channel_type]
                  when CHANNEL_WHATSAPP
                    Channel::Whatsapp.find(campaign_params[:channel_id])
                  when CHANNEL_SMS
                    Channel::TataSmsc.find(campaign_params[:channel_id])
                  when CHANNEL_EMAIL
                    Channel::Email.find(campaign_params[:channel_id])
                  end
    end
  end

  def find_campaign
    @campaign = Current.account.campaigns.find_by(id: params[:id])
  end

  def campaign_params
    params.require(:campaign).permit(:id, :campaignable_type, :title, :select_audience, :exclude_users, :send_campaign_to_the_opted_out_users, :message,
                                     :scheduling_type, :selected_contact_attribute, :inbox_id, :campaign_state, :segment_attribute, :channel_id, :channel_type, personalise_mapping_attribute: {})
  end

  def sms_campaign_params
    params.require(:campaign).permit(:template_record_id, :template_id, tiny_urls: [])
    # Below code will implement once we configure campaign tags
    # params.require(:campaign).permit(:campaign_tag_id, :template_record_id, :template_id)
  end

  def whatsapp_campaign_params
    params.require(:campaign).permit()
    # Below code will implement once we configure campaign tags
    # params.require(:campaign).permit(:campaign_tag_id)
  end

  def campaign_scheduler_params
    params.require(:campaign_scheduler).permit(:schedule_type, :scheduling_frequency, :trigger_criteria_first, :trigger_criteria_second,
                                               :campaign_time_zone, :send_campaign_time, :start_date, :end_date, :repeat_every, :send_if_user_timezone_expired, :occurrences, :best_time_for_user, :on_best_time, :cron_expression, :occurrence_count, :alternate_timezone, :status, :trigger_relation, :trigger_attr, :time_value, :time_multiplier, repeat_on_day_of_month: [], repeat_on_day_of_week: [])
  end

  def email_campaign_params
    params.require(:campaign).permit(:campaign_content_type, :account_id, :campaign_tag_id, :channel_id, :email_template_id)
  end

  # It will be used in case save_as_draft functionality of email-campaign to save sender-details
  def campaign_details_params
    params.require(:campaign_detail).permit(:subject, :sender_name, :preview_text, :campaign_id, :channel_email_id, :account_id, :from_email_address,
                                            :reply_to_email_address, cc_email_address: [], bcc_email_address: [])
  end

  def render_error(message, status = :unprocessable_entity)
    render json: { message: message }, status: status
  end

  def segments_params
    params.require(:segment).permit(:segment_filter_id, :segment_id)
  end

  def find_channel
    # To do -> This methods need to be refactored once the other redundant
    # apis will be removed, this action check will be removed, and it will be common
    # for all test campaigns
    @channel =  case action_name.to_sym
                when :perform_test
                  case params[:campaign_type].to_sym
                  when :email
                    Current.account.email_channels.where(test_campaign_params[:email_connector]).first
                  when :sms
                    Current.account.tata_smsc.where(sender_id: params[:sender_id]).first
                  when :whatsapp
                    Current.account.whatsapp_channels.where(phone_number: params[:from_phone_number]).first
                  else
                    render_error("Channel Type not supported")
                  end
                when :test_sms_message_via_tatasms
                  Current.account.tata_smsc.where(sender_id: params[:sender_id]).first
                when :test_campaign_via_tataemail
                  Current.account.email_channels.where(test_campaign_params[:channel_email_id]).first
                end
  end

  def fetch_common_attributes
    @selected_option = params[:selected_option]
    @message = params[:message]
    if params[:template_id].present?
      @template = Current.account.templates.find_by(template_id: params[:template_id])
      return render_error("No template found with this id") if params[:template_id].present? && !@template.present?
    end
    @contacts = case @selected_option.to_sym
                when :unique_id
                  Current.account.contacts.where(customer_id: params[:unique_id_value])
                when :phone_number
                  Current.account.contacts.where(phone_number: params[:phone_number])
                when :email
                  Current.account.contacts.where(email: params[:email])
                when :custom_segment
                  segment_id = [params[:segment_id]].compact
                  Current.account.contacts.where("ARRAY[?]::INTEGER[] @> source_id", segment_id)
                end
    render_error("Couldn't find contacts with given details") unless @contacts.present?
    render_error("Contacts cannot be more than #{Campaign::MAX_CONTACT_COUNT} for test") if @contacts.count > Campaign::MAX_CONTACT_COUNT
    @contacts
  end

  def draft_campaign
    if campaign_params[:id].present?
      campaign_update(campaign_params[:id])
    else
      case params[:campaign][:type]
      when "tata_smsc"
        @campaignable = Current.account.sms_campaigns.new(sms_campaign_params)
        update_draft_campaign_info
      when "email"
        @campaignable = Current.account.email_campaigns.new(email_campaign_params)
        update_draft_campaign_info
      when "tata_whatsapp"
        phone_number = params[:campaign][:phone_number]
        @campaignable = Current.account.whatsapp_campaigns.new(whatsapp_campaign_params)
        update_draft_campaign_info
      end
    end
  end

  def convert_tinyurl(value)
    if (value =~ VALID_URL_REGEXP)
      tiny_url_api = TinyUrlApi.new.generate_tiny_url(value, nil)
      shorturl = tiny_url_api["shorturl"]
      return shorturl if tiny_url_api["statusCode"] == 200
    else
      value
    end
  end

  def create_campaign
    method_name = "#{params[:campaign][:type]}_campaign"
    if respond_to?(method_name, true)
      send(method_name)
    else
      render_invalid_campaignable_type_error
    end
  end

  def tata_smsc_campaign
    build_and_save_campaign(SMS, sms_campaign_params)
  end

  def tata_whatsapp_campaign
    build_and_save_campaign(WHATSAPP, whatsapp_campaign_params)
  end

  def email_campaign
    build_and_save_campaign(EMAIL, email_campaign_params)
  end

  def build_and_save_campaign(campaign_type, campaign_type_params)
    campaignable = Current.account.send("#{campaign_type.downcase}_campaigns").new(campaign_type_params)
    campaign = campaignable.campaigns.build(
      campaign_params.merge(account_id: Current.account.id, segment_attribute: segments_params, channel_type: CHANNEL_MAPPING[params[:campaign][:channel_type]].to_s)
    )
    if campaignable.save && campaign.save
      if campaign_type.eql?(EMAIL)
        campaign_detail = campaign.campaign_details.create!(campaign_details_params.merge(account_id: Current.account.id)) if campaign_details_params.present?
      end
      handle_campaign_creation(campaign)
    else
      render_campaign_errors(campaign, campaignable)
    end
  end

  def handle_campaign_creation(campaign)
    set_contact_event_filters(campaign.id) if filters_present?
    CampaignSchedulerService.schedule_campaign(
      campaign,
      campaign_scheduler_params
    ) if campaign_scheduler_params.present?
    render json: campaign, status: :created
  end

  def render_campaign_errors(campaign, campaignable)
    render json: { errors: campaign.errors.full_messages + campaignable.errors.full_messages }, status: :unprocessable_entity
  end

  def render_invalid_campaignable_type_error
    render json: { error: "Invalid Campaign type" }, status: :unprocessable_entity
  end

  def filters_present?
    params[:included_filters].present? || params[:excluded_filters].present?
  end
end
