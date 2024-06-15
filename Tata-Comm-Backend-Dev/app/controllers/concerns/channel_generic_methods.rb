module ChannelGenericMethods
  extend ActiveSupport::Concern

  include Api::V3::Accounts::Concerns::CallSmscService
  include Api::V3::Accounts::Concerns::CallEmailService
  include BasicTokenEncryptor

  def whatsapp_tata_communications
    res_verify = verify_phone_number
    return render_could_not_create_error(res_verify.dig('error', 'message')) if res_verify['error'].present?
    return return_error_message(res_verify) unless phone_number_valid?(res_verify)
    res = setup_webhooks
    if (res.code == 201) || (res.code == 200)
     build_inbox
     return res
    else
      return_webhook_error(res)
    end
  rescue StandardError => e
    Sentry.capture_exception(e)
    Rails.logger.info e.message
    render_internal_server_error(e.message)
  end

  def tata_smsc
    if validate_and_decode_auth_token(create_permitted_params[:auth_token])
      tata_smsc_build_inbox
    else
      Rails.logger.info 'Api key is invalid'
      render_could_not_create_error('Api Key is invalid')
    end
  rescue StandardError => e
    Sentry.capture_exception(e)
    render_could_not_create_error(e.message)
  end

  def setup_webhooks
    provider_config = params[:channel][:provider_config]
    phone_number = params[:channel][:phone_number]
    account_id = Current.account.id
    response = HTTParty.post(
      ENV['TATA_COMMUNICATIONS_WHATSAPP_WEBHOOK_URL'],
      headers: { 'authorization': 'Bearer '+provider_config['api_key'], 'Content-Type': 'application/json' },
      body: {
        url: request.base_url + "/api/v3/accounts/#{account_id}/webhooks/whatsapp",
        waba_number: phone_number.delete('+'),
        phone_number_id: provider_config['phone_number_id'],
        headers: false
      }.to_json
    )
    response
  end

  def verify_phone_number
    ::Channel::WhatsappTataCommunications.new(phone_number: params[:channel][:phone_number],
                                              provider_config: params[:channel][:provider_config]).verify_phone_number
  end

  def build_inbox
    @whatsapp_channel = Current.account.tata_whatsapp_channels.create!(
      provider_config: params[:channel][:provider_config],
      phone_number: params[:channel][:phone_number],
      provider: params[:channel][:provider]
    )
    if params[:inbox_id].present?
      @inbox = Current.account.inboxes.find_by(id: params[:inbox_id])
      @inbox.channel_id = @whatsapp_channel.id
      @inbox.channel_type = CHANNEL_WHATSAPP
    end
  end

  def phone_number
    create_permitted_params[:phone_number] || params[:to]
  end

  def medium
    create_permitted_params[:medium]
  end

  def tata_smsc_build_inbox
    @tata_smsc_channel = Current.account.tata_smsc.create!(
      auth_token: encrypt_token(create_permitted_params[:auth_token]),
      sender_id: create_permitted_params[:sender_id],
      sender_type: create_permitted_params[:sender_type],
      callback_url: create_permitted_params[:callback_url],
      medium:
    )

    Rails.logger.info @tata_channel
    @inbox = Current.account.inboxes.create(
      name: create_permitted_params[:name],
      channel: @tata_smsc_channel
    )

    Rails.logger.info @inbox
  end

  def return_error_message(message)
    Rails.logger.info "#{message}"
    render_could_not_create_error('Whatsapp configuration unsuccessful')
  end

  def return_webhook_error(message)
    Rails.logger.info "#{message}"
    render_could_not_create_error('Whatsapp webhook Setup unsuccessful')
  end

  def phone_number_valid?(phone)
    (phone['display_phone_number']&.delete(' ')&.delete('-') == params[:channel][:phone_number])
  end

  def get_channel_attributes(channel_type)
    if channel_type.constantize.const_defined?(:EDITABLE_ATTRS)
      channel_type.constantize::EDITABLE_ATTRS.presence
    else
      []
    end
  end

  def update_channel_feature_flags
    return unless @inbox.web_widget?
    return unless permitted_params(Channel::WebWidget::EDITABLE_ATTRS)[:channel].key? :selected_feature_flags

    @inbox.channel.selected_feature_flags = permitted_params(Channel::WebWidget::EDITABLE_ATTRS)[:channel][:selected_feature_flags]
    @inbox.channel.save!
  end

  # TODO: make email channel creation generic
  def channel_email
    channel_email_build_inbox
    #TODO: Commenting code for rescue there is some issue with rescue after succesful creation record, it is throwing validation error which is wrong
  # rescue StandardError => e
  #   Sentry.capture_exception(e)
  #   render_could_not_create_error(e.message)
  end

  def channel_email_build_inbox
    ActiveRecord::Base.transaction do
      @channel_email = Current.account.email_channels.create!(
        create_permitted_params
      )
      Rails.logger.info @channel_email
      @inbox = Current.account.inboxes.create(
        name: @channel_email.name,
        channel: @channel_email
      )
      Rails.logger.info @inbox
    end
  end
end
