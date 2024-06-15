module Api::V3::Accounts::Concerns::ChannelWhatsappSchedulerService
  extend ActiveSupport::Concern
  include BasicTokenEncryptor

  def send_whatsapp_message(channel, contacts)
    template_name = params[:template_name]
    kong = channel['provider_config']['auth_key'] if channel
    personalise_mapping_attribute = params[:personalise_mapping_attribute] rescue {}
    responses = []
    contacts.each do |contact|
      options = { whatsapp_api_contact: contact.id, campaign_id: nil, channel_phone_number: channel&.phone_number, account_id: contact.account_id }.with_indifferent_access.to_json
      response = WhatsappApi.send_personalise_message_template_text(kong, contact&.phone_number, template_name, personalise_mapping_attribute,
                                                                    options)
      responses << JSON.parse(response)
    end
    responses
  end
end
