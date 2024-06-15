module Api::V3::Accounts::ChannelConcern
  extend ActiveSupport::Concern

  #whatsapp channel creation
  def create_tata_whatsapp_channel
    verify_and_validate_phone_number
    res = setup_whatsapp_webhook
    raise 'Whatsapp webhook Setup unsuccessful' unless [201, 200].include?(res.code)
    Current.account.tata_whatsapp_channels.create!(params[:channel].permit!)
  end

  #whatsapp channel update
  def update_tata_whatsapp_channel
    verify_and_validate_phone_number
    if whatsapp_webhook_setup_required?
      res = setup_whatsapp_webhook
      raise 'Whatsapp webhook Setup unsuccessful' unless [201, 200].include?(res.code)
    end
    @channel.update!(params[:channel].permit!)
    @channel
  end

  #Tata Smsc channel creation
  def create_tata_smsc_channel
    if validate_and_decode_auth_token(create_permitted_params[:auth_token])
      Current.account.tata_smsc.create!(params[:channel].permit!)
    else
      Rails.logger.info 'Api key is invalid'
      raise 'Api Key is invalid'
    end
  end

  #Tata Smsc channel updation
  def update_tata_smsc_channel
    @channel.update!(params[:channel].permit!)
    @channel
  end

  # Email channel creation
  def create_email_channel
    Current.account.email_channels.create!(params[:channel].permit!)
  end

  # Email channel updation
  def update_email_channel
    @channel.update!(params[:channel].permit!)
    @channel
  end

  private
  #used for whatsapp channel creation and updation
  def verify_and_validate_phone_number
    res_verify = verify_phone_number
    raise res_verify.dig('error', 'message') if res_verify['error'].present?
    raise 'Whatsapp configuration unsuccessful' unless phone_number_valid?(res_verify)
  end

  #used for whatsapp channel updation
  def whatsapp_webhook_setup_required?
    (@channel.provider_config['api_key'] != params[:channel][:provider_config][:api_key]) || (@channel.provider_config['waba_id'] != params[:channel][:provider_config][:waba_id]) || (@channel.provider_config['auth_key'] != params[:channel][:provider_config][:auth_key]) || (@channel.provider_config['phone_number_id'] != params[:channel][:provider_config][:phone_number_id])
  end

  #used for whatsapp channel creation and updation
  def setup_whatsapp_webhook
    provider_config = params[:channel][:provider_config]
    phone_number = params[:channel][:phone_number]
    HTTParty.post(
      ENV['TATA_COMMUNICATIONS_WHATSAPP_WEBHOOK_URL'],
      headers: { 'authorization': 'Bearer '+provider_config['api_key'], 'Content-Type': 'application/json' },
      body: {
        url: request.base_url + "/webhooks/whatsapp/#{phone_number}",
        waba_number: phone_number.delete('+'),
        phone_number_id: provider_config['phone_number_id'],
        headers: false
      }.to_json
    )
  rescue => e
    raise SystemCallError.new(e.message)
  end

  #used for whatsapp channel creation and updation in channels controller
  def verify_inbox_association_with_channel
    if params[:inbox_id].present?
      inbox = Current.account.inboxes.find_by(id: params[:inbox_id])
      return if inbox.id == @channel&.inbox&.id
      raise 'Inbox already linked with other channel' if inbox.channel_id.present?
    end
  end

  #used for whatsapp channel creation and updation in channels controller
  def link_inbox_to_channel(channel)

    inbox = Current.account.inboxes.find_by(id: params[:inbox_id])
    return unless inbox.present?

    inbox.update!(channel_id: channel.id)
  end
end