# == Schema Information
#
# Table name: channel_whatsapp
#
#  id                             :bigint           not null, primary key
#  message_templates              :jsonb
#  message_templates_last_updated :datetime
#  phone_number                   :string           not null
#  provider                       :string           default("default")
#  provider_config                :jsonb
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  account_id                     :integer          not null
#
# Indexes
#
#  index_channel_whatsapp_on_phone_number  (phone_number) UNIQUE
#

class Channel::WhatsappTataCommunications < ApplicationRecord
  include Channelable

  self.table_name = 'channel_whatsapp'
  EDITABLE_ATTRS = [:message_id, :phone_number, { provider_config: {} }].freeze

  #validates :phone_number, presence: true, uniqueness: true
  #before_save :validate_provider_config

  def name
    'WhatsappTataCommunications'
  end

  # all this should happen in provider service . but hack mode on
  def api_base_path
      ENV.fetch('TATA_COMMUNICATIONS_WHATSAPP_BASE_URL', 'https://graph.facebook.com/v15.0')
  end

  # Extract later into provider Service
  def send_message(phone_number, message)
    if message.attachments.present?
      send_attachment_message(phone_number, message)
    elsif message.content_type =='button'  
      send_text_and_button_message(phone_number, message)
    elsif message.content_type =='text_menu'  
      send_text_and_menu_message(phone_number, message)  
    elsif message.content_type =='image_menu'  
      send_image_and_menu_message(phone_number, message) 
    elsif message.content_type =='image_button'  
      send_image_and_button_message(phone_number, message)     
    elsif message.content_type =='image'  
      send_image_message(phone_number, message)    
    elsif message.content_type =='video'  
      send_video_message(phone_number, message)  
    elsif message.content_type =='location'  
      send_location_message(phone_number, message)        
    elsif message.content_type =='text_document'  
      send_text_and_document_message(phone_number, message)  
    else
      send_text_message(phone_number, message)
    end
  end

  def mark_message_read
    Rails.logger.info "@@@@@@@@@@@@@@@@@@@@@@@  message id found  :     #{message_id}"   
  end

  def send_template(phone_number, template_info)
    send_template_message(phone_number, template_info)
  end

  def media_url(media_id)
    "#{api_base_path}/media/#{media_id}"
  end

  def api_headers
    { 'Authorization' => 'Bearer '+provider_config['api_key'], 'Content-Type' => 'application/json' }
  end

  def has_24_hour_messaging_window?
    true
  end

  def message_templates
    sync_templates
    super
  end

  
  def setup_webhook
    response = HTTParty.post(
      ENV['TATA_COMMUNICATIONS_WHATSAPP_WEBHOOK_URL'],
      headers: { 'authorization': 'Bearer '+provider_config['api_key'], 'Content-Type': 'application/json' },
      body: {
        url: "#{ENV['FRONTEND_URL']}/webhooks/whatsapp/#{phone_number}",
        waba_number: phone_number.delete('+'),
        phone_number_id: provider_config['phone_number_id'],
        headers: false
  }.to_json
    )
    response
  end

  def verify_phone_number
    response = HTTParty.get(
      "#{api_base_path}/#{provider_config['phone_number_id']}",
      headers: { 'authorization': 'Bearer '+provider_config['api_key'], 'Content-Type': 'application/json' },
    )
    response
  end
  
  private

  def send_text_message(phone_number, message)
    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: {
        to: phone_number,
        text: { body: message.content },
        type: 'text'
      }.to_json
    )

    response.success? ? response['messages'].first['id'] : nil
  end

  def send_image_message(phone_number, message)
    payload = {
      to: phone_number,
      image: {
        link: JSON.parse(message.content.gsub('=>', ':'))["image"]['link'],
        caption: JSON.parse(message.content.gsub('=>', ':'))["image"]['caption']
  },
      type: "image"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload
    )
 
    response.success? ? response['messages'].first['id'] : nil

  end

  def send_location_message(phone_number, message)
    payload = {
      to: phone_number,
      location: {
        longitude: JSON.parse(message.content.gsub('=>', ':'))["location"]['longitude'],
        latitude: JSON.parse(message.content.gsub('=>', ':'))["location"]['latitude'],
        name: JSON.parse(message.content.gsub('=>', ':'))["location"]['name'],
        address: JSON.parse(message.content.gsub('=>', ':'))["location"]['address']
  },
      type: "location"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload
    )
    
    response.success? ? response['messages'].first['id'] : nil

  end

  def send_video_message(phone_number, message)
    payload = {
      to: phone_number,
      video: {
        link: JSON.parse(message.content.gsub('=>', ':'))["video"]['link'],
        caption: JSON.parse(message.content.gsub('=>', ':'))["video"]['caption']
  },
      type: "video"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload
    )    

    response.success? ? response['messages'].first['id'] : nil
    
  end


  def send_text_and_button_message(phone_number, message)
  
    payload = {
      to: phone_number,
      interactive: {
        type: 'button',
        body: { text: JSON.parse(message.content.gsub('=>', ':'))["body"]["text"] },
        action: { buttons: JSON.parse(message.content.gsub('=>', ':'))["buttons"] }
  },
      type: "interactive"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil
  end


  def send_image_and_button_message(phone_number, message)
  
    payload = {
      to: phone_number,
      interactive: {
        type: 'button',
        body: { text: JSON.parse(message.content.gsub('=>', ':'))["body"]["text"] },
        action: { buttons: JSON.parse(message.content.gsub('=>', ':'))["buttons"] },
        header:{
          type:"image",
          image:JSON.parse(message.content.gsub('=>', ':'))["image"]
        }
  },
      type: "interactive"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil
  end

  def send_text_and_menu_message(phone_number, message)
  
    payload = {
      to: phone_number,
      interactive: {
        type: 'list',
        body: { text: JSON.parse(message.content.gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message.content.gsub('=>', ':'))["buttons"] 
  },
      type: "interactive"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil
  end


  def send_image_and_menu_message(phone_number, message)
  
    payload_menu = {
      to: phone_number,
      interactive: {
        type: 'list',
        body: { text: JSON.parse(message.content.gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message.content.gsub('=>', ':'))["buttons"] 
  },
      type: "interactive"
    }.to_json

    payload_image = {
      to: phone_number,
      image: {
        link: JSON.parse(message.content.gsub('=>', ':'))["image"]['link']
  },
      type: "image"
    }.to_json

    response_image = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload_image
    )

    response_menu = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload_menu
    )
    response_menu.success? ? response_menu['messages'].first['id'] : nil
  end


  def send_text_and_document_message(phone_number, message)
  
    payload = {
      to: phone_number,
      document: {
        link: JSON.parse(message.content.gsub('=>', ':'))["document"]["link"],
        filename: JSON.parse(message.content.gsub('=>', ':'))["document"]["filename"]
  },
      type: "document"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil
  end


  def send_attachment_message(phone_number, message)
    attachment = message.attachments.first
    type = %w[image audio video].include?(attachment.file_type) ? attachment.file_type : 'document'
    attachment_url = attachment.file_url
    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: {
        'to' => phone_number,
        'type' => type,
        type.to_s => {
          'link': attachment_url,
          'caption': message.content
        }
      }.to_json
    )

    response.success? ? response['messages'].first['id'] : nil
  end

  def send_template_message(phone_number, template_info)
    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: {
        to: phone_number,
        template: template_body_parameters(template_info),
        type: 'template'
      }.to_json
    )

    response.success? ? response['messages'].first['id'] : nil
  end

  def template_body_parameters(template_info)
    {
      name: template_info[:name],
      namespace: template_info[:namespace],
      language: {
        policy: 'deterministic',
        code: template_info[:lang_code]
      },
      components: [{
        type: 'body',
        parameters: template_info[:parameters]
      }]
    }
  end

  def sync_templates
    # to prevent too many api calls
    last_updated = message_templates_last_updated || 1.day.ago
    return if Time.current < (last_updated + 12.hours)

    response = HTTParty.get("#{api_base_path}/configs/templates", headers: api_headers)
    update(message_templates: response['waba_templates'], message_templates_last_updated: Time.now.utc) if response.success?
  end

  # Extract later into provider Service
  def validate_provider_config
    Rails.logger.info "inside provider config !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    Rails.logger.info "inside mobile number #{phone_number}"
    #response = HTTParty.post(
     # "https://whatsapp-webhook.tatacommunicationsdigo.io/webhook/mapping",
     # headers: { 'Authorization': 'Bearer '+provider_config['api_key'], 'Content-Type': 'application/json' },
      #body: {
      #  url: "#{ENV['FRONTEND_URL']}/webhooks/whatsapp/#{phone_number}",
      #  waba_number: phone_number
      #}.to_json
    #)'''
    errors.add(:provider_config, 'error setting up the webook') unless response.success?
  end
end
