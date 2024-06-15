class Api::V3::Accounts::ChannelsController < Api::V1::Accounts::BaseController
  include BasicTokenEncryptor
  include ChannelGenericMethods
  include Api::V1::InboxesHelper
  include Api::V3::Accounts::ChannelConcern

  before_action :set_channel, only: %i[show destroy update]
  before_action :delete_webhook, only: %i[destroy]

  def index
    @channels = CHANNEL_MAPPING[params[:channel_type]]&.where(account_id: Current.account.id)&.order_by_created_date
    @channels = @channels&.joins(:inbox)&.distinct() if params[:inbox_available].present?
    @channels || []
  end

  def fetch_all_sender_id
    @sender_ids =  Current.account.tata_smsc.pluck(:sender_id)
    render json: { sender_id: @sender_ids }, status: :ok
  end

  def show; end

  def create
    channel_type = params[:type]
    raise 'Invalid channel type' unless respond_to?("create_#{channel_type}_channel")
    verify_inbox_association_with_channel
    @channel = send("create_#{channel_type}_channel")
    link_inbox_to_channel(@channel)
  rescue SystemCallError => error
    Sentry.capture_exception(error)
    Rails.logger.info error.message
    render_internal_server_error(error.message)
  rescue StandardError => error
    Rails.logger.info error.message
    render_could_not_create_error(error.message)
  end

  def update
    channel_type = params[:type]
    raise 'Invalid channel type' unless respond_to?("update_#{channel_type}_channel")
    verify_inbox_association_with_channel
    @channel = send("update_#{channel_type}_channel")
    link_inbox_to_channel(@channel) if @channel.inbox.blank? && params[:inbox_id].present?
  rescue SystemCallError => error
    Sentry.capture_exception(error)
    Rails.logger.info error.message
    render_internal_server_error(error.message)
  rescue StandardError => error
    Rails.logger.info error.message
    render_could_not_create_error(error.message)
  end

  def destroy
    ActiveRecord::Base.transaction do
      channel = @channel.destroy!
      update_params = { channel_name: "archived-#{@channel.id}-#{@channel.channel_name}"}
      update_params[:phone_number] = "archived-#{@channel.id}-#{@channel.phone_number}" if channel&.name == "Whatsapp"
      @channel.update!(update_params)
      @channel.inbox.update(channel_id: nil) if @channel&.inbox&.present?
      render json: { message: 'Inbox is delinked and channel deleted successfully.'}
    end
  rescue StandardError => error
    Rails.logger.info error.message
    render_could_not_create_error(error.message)
  end

  def test_sms
    sms_response = authenticate_tata
    render json: sms_response.body
  rescue StandardError => e
    Sentry.capture_exception(e)
    render_could_not_create_error(e.message)
  end

  def whatsapp_templates
    @channel = Current.account.whatsapp_channels.find_by(id: params[:id])
    raise 'Channel not found' unless @channel.present?
    render json: { success: true, data: approved_whatsapp_template }
  rescue StandardError => error
    Rails.logger.info error.message
    render_could_not_create_error(error.message)
  end

  def test_email
    email_response = authenticate_email_connector
    render json: email_response.body
  rescue StandardError => e
    Sentry.capture_exception(e)
    render_could_not_create_error(e.message)
  end

  def whatsapp_phone_numbers
    @phone_numbers = Current.account.inboxes.whatsapp_phone_numbers(:whatsapp)
    render json: { phone_numbers: @phone_numbers }
  end

  private

  def config_validation_changed
    if (@inbox.channel.provider_config['api_key'] != params[:channel][:provider_config][:api_key]) || (@inbox.channel.provider_config['waba_id'] != params[:channel][:provider_config][:waba_id]) || (@inbox.channel.provider_config['auth_key'] != params[:channel][:provider_config][:auth_key]) || (@inbox.channel.provider_config['phone_number_id'] != params[:channel][:provider_config][:phone_number_id])
      whatsapp_tata_communications
    else
      render json: { channel: { inbox: @inbox, provider_config: @inbox.channel.provider_config }, message: I18n.t('campaigns.updated_success') }
    end
  end

  def set_channel
    @channel = CHANNEL_MAPPING[params[:type]].find_by(id: params[:id])
  end

  def delete_webhook
    return unless @channel&.name == WHATSAPP

    delete_webhook = WhatsappApi.delete_inbox(@channel)
    render json: { message: 'channel webhook can not be deleted' }, status: :unprocessable_entity if delete_webhook.code != RESPONSE_CODE_204
  end

  def permitted_params(channel_attributes = [])
    params.permit(
      :name, :account_id, :medium, :api_key, :type, :avatar, :greeting_enabled, :greeting_message, :enable_email_collect, :csat_survey_enabled,
      :enable_auto_assignment, :working_hours_enabled, :out_of_office_message, :timezone, :allow_messages_after_resolved, :auth_token,
      channel: [:type, *channel_attributes]
    )
  end

  def create_permitted_params
    params.require(:channel).permit(
      :account_id, :name, :medium, :auth_token, :sender_id, :sender_type, :callback_url,
      # added new parameters for email channel
      :email, :smtp_address, :smtp_port, :smtp_protocol, :smtp_auth_enable, :smtp_email, :smtp_password, :maximum_send_rate, :unsubscribe_setting, :bounces_and_complaint_tracking, :email_api_url, :email_api_key, :channel_name
    )
  end

  def test_sms_params
    params.permit(:from, :to, :msg, dlr: [:mask, :url], tlv: [:PE_ID, :TEMPLATE_ID, :TELEMARKETER_ID])
  end

  def approved_whatsapp_template
    with_media_array = []
    without_media_array = []
    all_templates = @channel.get_template_list_meta
    approved_templates = all_templates.select { |template| template['status'] == APPROVED }

    approved_templates.each do |template|
      template['components'].each do |element|
        if element['format'].present? && %w[IMAGE VIDEO DOCUMENT].include?(element['format'])
          with_media_array << template
        elsif with_media_array.exclude?(template) && without_media_array.exclude?(template)
          without_media_array << template
        end
      end
    end
    { 'with_media': with_media_array, 'without_media': without_media_array }
  end

  def test_email_params
    params.permit(:subject, :htmlContent, sender: [:name, :email], to: [:name, :email])
  end
end
