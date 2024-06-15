class Api::V1::Accounts::Channels::TataCommunicationsWhatsappChannelsController < Api::V1::Accounts::BaseController
  before_action :authorize_request

  def create
    resVerify = verify_phone_number
    if(resVerify["display_phone_number"].delete(' ').delete('-')==params[:channel][:phone_number])
     res = setup_webhooks
       if(res.code===201 || res.code===200)
          build_inbox
      else
        Rails.logger.info "#{res}";  
        render_could_not_create_error('Whatsapp configuration unsuccessful');
      end 

    else
      Rails.logger.info "#{resVerify}";  
      render_could_not_create_error('Whatsapp configuration unsuccessful');
    end  
    
  end

  private

  def authorize_request
    authorize ::Inbox
  end

  def setup_webhooks
    ::Channel::WhatsappTataCommunications.new(phone_number: params[:channel][:phone_number], provider_config: params[:channel][:provider_config]).setup_webhook
  end

  def verify_phone_number
    ::Channel::WhatsappTataCommunications.new(phone_number: params[:channel][:phone_number], provider_config: params[:channel][:provider_config]).verify_phone_number
  end

  def build_inbox
    @whatsapp_channel = Current.account.whatsapp_channels.create!(
      provider_config: params[:channel][:provider_config],
      phone_number: params[:channel][:phone_number],
      provider: params[:channel][:provider]
    )
    @inbox = Current.account.inboxes.create(
      name: params[:name],
      channel: @whatsapp_channel
    )
  end

  def permitted_params
    params.require(:tata_communications_whatsapp_channel).permit(
      :phone_number,:provider_config, :name, :medium
    )
  end
end
