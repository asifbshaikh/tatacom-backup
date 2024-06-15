# == Schema Information
#
# Table name: channel_whatsapp
#
#  id                             :bigint           not null, primary key
#  channel_name                   :string
#  deleted_at                     :datetime
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
#  index_channel_whatsapp_on_deleted_at    (deleted_at)
#  index_channel_whatsapp_on_phone_number  (phone_number) UNIQUE
#

class Channel::Whatsapp < ApplicationRecord
  include Channelable

  acts_as_paranoid
  self.table_name = 'channel_whatsapp'
  EDITABLE_ATTRS = [:provider, :phone_number, { provider_config: {} }].freeze

  validates :phone_number, presence: true, uniqueness: { scope: [:account_id]}
  validates :channel_name, uniqueness: { scope: [:account_id] }

  before_save :validate_provider_config
  before_destroy :check_running_campaigns

  def name
    'Whatsapp'
  end

  # all this should happen in provider service . but hack mode on
  def api_base_path_meta
    ENV.fetch('TATA_COMMUNICATIONS_WHATSAPP_BASE_URL', 'https://graph.facebook.com/v15.0')
  end

  # all this should happen in provider service . but hack mode on
  def api_base_path
    # provide the environment variable when testing against sandbox : 'https://waba-sandbox.360dialog.io/v1'
    ENV.fetch('360DIALOG_BASE_URL', 'https://waba.360dialog.io/v1')
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
    elsif message.content_type =='audio'
      send_audio_message(phone_number, message)
    elsif message.content_type =='location'
      send_location_message(phone_number, message)
    elsif message.content_type =='contacts'
      send_contacts_message(phone_number, message)
    elsif message.content_type =='text_document'
      send_text_and_document_message(phone_number, message)
    elsif message.content_type =='product'
      send_product_message(phone_number, message)
    elsif message.content_type =='sticker'
      send_sticker_message(phone_number, message)
    elsif message.content_type =='product_list'
      send_product_list_message(phone_number, message)
    else
      send_text_message(phone_number, message)
    end
  end

   # Extract later into provider Service
   def send_message_meta(phone_number, message)
    if message.attachments.present?
      send_attachment_message_meta(phone_number, message)
    elsif message.content_type =='button'
      send_text_and_button_message_meta(phone_number, message)
    elsif message.content_type =='text_menu'
      send_text_and_menu_message_meta(phone_number, message)
    elsif message.content_type =='image_menu'
      send_image_and_menu_message_meta(phone_number, message)
    elsif message.content_type =='image_button'
      send_image_and_button_message_meta(phone_number, message)
    elsif message.content_type =='image'
      send_image_message_meta(phone_number, message)
    elsif message.content_type =='video'
      send_video_message_meta(phone_number, message)
    elsif message.content_type =='audio'
      send_audio_message_meta(phone_number, message)
    elsif message.content_type =='location'
      send_location_message_meta(phone_number, message)
    elsif message.content_type =='contacts'
      send_contacts_message_meta(phone_number, message)
    elsif message.content_type =='text_document'
      send_text_and_document_message_meta(phone_number, message)
    elsif message.content_type =='product'
      send_product_message_meta(phone_number, message)
    elsif message.content_type =='sticker'
      send_sticker_message_meta(phone_number, message)
    elsif message.content_type =='product_list'
      send_product_list_message_meta(phone_number, message)
    else
      send_text_message_meta(phone_number, message)
    end
  end

   # Send broadcast messages in Meta
   def send_message_meta_broadcast(phone_number, message)
    if message.attachments.present?
      send_attachment_message_meta(phone_number, message)
    elsif message.content_type =='button'
      send_text_and_button_message_meta(phone_number, message)
    elsif message.content_type =='text_menu'
      send_text_and_menu_message_meta(phone_number, message)
    elsif message.content_type =='image_menu'
      send_image_and_menu_message_meta(phone_number, message)
    elsif message.content_type =='image_button'
      send_image_and_button_message_meta(phone_number, message)
    elsif message.content_type =='image'
      send_image_message_meta(phone_number, message)
    elsif message.content_type =='video'
      send_video_message_meta(phone_number, message)
    elsif message.content_type =='audio'
      send_audio_message_meta(phone_number, message)
    elsif message.content_type =='location'
      send_location_message_meta(phone_number, message)
    elsif message.content_type =='contacts'
      send_contacts_message_meta(phone_number, message)
    elsif message.content_type =='text_document'
      send_text_and_document_message_meta(phone_number, message)
    else
      send_text_message_meta(phone_number, message)
    end
  end

  def send_template(phone_number, template_info)
    send_template_message(phone_number, template_info)
  end

  def media_url(media_id)
    "#{api_base_path}/media/#{media_id}"
  end

  def api_headers
    { 'D360-API-KEY' => provider_config['api_key'], 'Content-Type' => 'application/json' }
  end

  def api_headers_meta
    { 'Authorization' => 'Bearer '+provider_config['api_key'], 'Content-Type' => 'application/json' }
  end

  def api_headers_kong
    Rails.logger.info "@@@@@@@@@@@@@@@@@@@KONG_HEADER_APPLIED"
    { 'Authorization' => provider_config['auth_key'], 'Content-Type' => 'application/json' }
  end

  def get_api_headers
    if isKongApiEnabled()
      return api_headers_kong
    end
    api_headers_meta
  end

  def has_24_hour_messaging_window?
    true
  end

  def message_templates
    sync_templates
    super
  end


  def mark_message_read(message_id, provider="360")
    if(provider!="TATA")

      response = HTTParty.put(
        "#{api_base_path}/messages/#{message_id}",
        headers: api_headers
      )

    else
      payload = {
        status: "read",
        message_id: message_id
      }

      response = HTTParty.post(
        get_api_url('messages'),
        headers: get_api_headers,
        body: get_api_params(payload)
      )
      # parse_response(response)
    end

  end

  def message_content(message, phone_number)
    new_message=message.content=~/<name>/?message.content.gsub("<name>",message.conversation.contact_inbox.contact.name.split(" ")[0]):message.content;
  end

  def send_template_message_meta(phone_number, template_info)

    payload = {
      to: phone_number,
      template: template_body_parameters(template_info),
      type: 'template'
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end

  def get_template_info_by_name(template_name)

    response = HTTParty.get(
      "#{api_base_path_meta}/#{provider_config['waba_id']}/message_templates?name=#{template_name}",
      headers: api_headers_meta,
    )

    response.success? ? response['data'].first : nil

  end

  def get_template_list_meta()
    response = HTTParty.get(
      "#{api_base_path_meta}/#{provider_config['waba_id']}/message_templates",
      headers: api_headers_meta,
    )
    response.success? ? response.parsed_response.dig('data') : []
  end

  def get_attachment_info(attachmentId)
    response = HTTParty.get(
      get_api_url('media', {'media_id': attachmentId, 'from': phone_number.delete('+')}),
      headers: get_api_headers,
    )
    response
  end

  def get_url_attachment_info(url)
    get_api_url('media', {'media_url': url})
  end

  private

  def send_text_message(phone_number, message)
    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: {
        to: phone_number,
        text: { body: message_content(message,phone_number) },
        type: 'text'
      }.to_json
    )

    response.success? ? response['messages'].first['id'] : nil
  end

  def isKongApiEnabled()
    return provider_config['auth_key'] && provider_config['auth_key'] != ''
  end

  def get_api_url(type, options={})
    if isKongApiEnabled()
      api_base_path_kong = "https://api.apigw.tatacommunications.com/v1/whatsapp"
      optionsUrl = ''
      if options
        optionsUrl += "?#{options.to_query}"
      end
      return "#{api_base_path_kong}/#{type}#{optionsUrl}"
    end
    if type == 'media'
      if options[:media_id]
        return "#{api_base_path_meta}/#{options[:media_id]}"
      elsif options[:media_url]
        return options[:media_url]
      end
    end
    return "#{api_base_path_meta}/#{provider_config['phone_number_id']}/#{type}"
  end

  def get_api_params(params)
    if isKongApiEnabled()
      params['from'] = self.phone_number.delete('+')
      params['to'] = params[:to].delete('+') if params[:to]
      params['to'] = params['to'].delete('+') if params['to']
    else
      params['messaging_product'] = "whatsapp"
    end
    Rails.logger.info "@@@@@@@@@@@@@@@@@@@@wa-request@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    Rails.logger.info params
    return params.to_json
  end

  def parse_response(response)
    Rails.logger.info "@@@@@@@@@@@@@@@@@@@@wa-response@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    Rails.logger.info response
    if isKongApiEnabled()
      response.success? ? response['id'] : nil
    else
      response.success? ? response['messages'].first['id'] : nil
    end
  end

  def send_text_message_meta(phone_number, message)
      response = HTTParty.post(
        get_api_url('messages'),
        headers: get_api_headers,
        body: get_api_params({
          to: phone_number,
          text: { body: message_content(message,phone_number) },
          type: 'text'
        })
      )
      parse_response(response)
  end

  def send_image_message(phone_number, message)
    payload = {
      to: phone_number,
      image: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]['link'],
        caption: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]['caption']
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

  def send_image_message_meta(phone_number, message)
    payload = {
      to: phone_number,
      image: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]['link'],
        caption: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]['caption']
  },
      type: "image"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end

  def send_sticker_message_meta(phone_number, message)
    payload = {
      to: phone_number,
      sticker: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["sticker"]['link']
  },
      type: "sticker"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end

  def send_sticker_message(phone_number, message)
    payload = {
      messaging_product: "whatsapp",
      to: phone_number,
      sticker: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["sticker"]['link']
  },
      type: "sticker"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path_meta}/#{provider_config['phone_number_id']}/messages",
      headers: api_headers_meta,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil

  end

  def send_location_message(phone_number, message)
    payload = {
      to: phone_number,
      location: {
        longitude: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["location"]['longitude'],
        latitude: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["location"]['latitude'],
        name: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["location"]['name'],
        address: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["location"]['address']
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

  def send_location_message_meta(phone_number, message)
    payload = {
      to: phone_number,
      location: {
        longitude: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["location"]['longitude'],
        latitude: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["location"]['latitude'],
        name: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["location"]['name'],
        address: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["location"]['address']
  },
      type: "location"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end

  def send_contacts_message_meta(phone_number, message)
    payload = {
      to: phone_number,
      contacts: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["contacts"],
      type: "contacts"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end

  def send_contacts_message(phone_number, message)
    payload = {
      messaging_product: "whatsapp",
      to: phone_number,
      contacts: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["contacts"],
      type: "contacts"
    }.to_json
    response = HTTParty.post(
      "#{api_base_path_meta}/#{provider_config['phone_number_id']}/messages",
      headers: api_headers_meta,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil
  end

  def send_video_message(phone_number, message)
    payload = {
      to: phone_number,
      video: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["video"]['link'],
        caption: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["video"]['caption']
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

  def send_audio_message(phone_number, message)
    payload = {
      to: phone_number,
      audio: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["audio"]['link']
  },
      type: "audio"
    }.to_json
    response = HTTParty.post(
      "#{api_base_path}/messages",
      headers: api_headers,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil

  end

  def send_video_message_meta(phone_number, message)
    payload = {
      to: phone_number,
      video: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["video"]['link'],
        caption: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["video"]['caption']
  },
      type: "video"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end


  def send_audio_message_meta(phone_number, message)
    payload = {
      to: phone_number,
      audio: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["audio"]['link']
  },
      type: "audio"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end


  def send_text_and_button_message(phone_number, message)

    payload = {
      to: phone_number,
      interactive: {
        type: 'button',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: { buttons: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"] }
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

  def send_text_and_button_message_meta(phone_number, message)

    payload = {
      to: phone_number,
      interactive: {
        type: 'button',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: { buttons: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"] }
  },
      type: "interactive"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end


  def send_image_and_button_message(phone_number, message)

    payload = {
      to: phone_number,
      interactive: {
        type: 'button',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: { buttons: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"] },
        header:{
          type:"image",
          image:JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]
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

  def send_image_and_button_message_meta(phone_number, message)

    payload = {
      to: phone_number,
      interactive: {
        type: 'button',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: { buttons: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"] },
        header:{
          type:"image",
          image:JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]
        }
  },
      type: "interactive"
    }


    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end

  def send_text_and_menu_message(phone_number, message)

    payload = {
      to: phone_number,
      interactive: {
        type: 'list',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"]
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


  def send_text_and_menu_message_meta(phone_number, message)

    payload = {
      to: phone_number,
      interactive: {
        type: 'list',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"]
  },
      type: "interactive"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end


  def send_image_and_menu_message(phone_number, message)

    payload_menu = {
      to: phone_number,
      interactive: {
        type: 'list',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"]
  },
      type: "interactive"
    }.to_json

    payload_image = {
      to: phone_number,
      image: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]['link']
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


  def send_image_and_menu_message_meta(phone_number, message)

    payload_menu = {
      to: phone_number,
      interactive: {
        type: 'list',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"]
  },
      type: "interactive"
    }

    payload_image = {
      to: phone_number,
      image: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]['link']
  },
      type: "image"
    }

    response_image = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload_image)
    )

    response_menu = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload_menu)
    )
    parse_response(response_menu)
  end

  def send_product_message_meta(phone_number, message)

    payload = {
      to: phone_number,
      interactive: {
        type: 'product',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["details"],
        footer: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["footer"]["text"] }
  },
      type: "interactive"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end

  def send_product_message(phone_number, message)

    payload = {
      messaging_product: "whatsapp",
      to: phone_number,
      interactive: {
        type: 'product',
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["details"],
        footer: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["footer"]["text"] }
  },
      type: "interactive"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path_meta}/#{provider_config['phone_number_id']}/messages",
      headers: api_headers_meta,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil
  end

  def send_product_list_message(phone_number, message)

    payload = {
      messaging_product: "whatsapp",
      to: phone_number,
      interactive: {
        type: 'product_list',
        header: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["header"],
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["details"],
        footer: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["footer"]["text"] }
  },
      type: "interactive"
    }.to_json

    response = HTTParty.post(
      "#{api_base_path_meta}/#{provider_config['phone_number_id']}/messages",
      headers: api_headers_meta,
      body: payload
    )

    response.success? ? response['messages'].first['id'] : nil
  end

  def send_product_list_message_meta(phone_number, message)

    payload = {
      to: phone_number,
      interactive: {
        type: 'product_list',
        header: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["header"],
        body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
        action: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["details"],
        footer: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["footer"]["text"] }
  },
      type: "interactive"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
  end

  # def send_image_and_menu_message_meta(phone_number, message)

  #   payload = {
  #     messaging_product: "whatsapp",
  #     to: phone_number,
  #     interactive: {
  #       type: 'button',
  #       body: { text: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["body"]["text"] },
  #       action: { buttons: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["buttons"] },
  #       header:{
  #         type:"image",
  #         image:{
  #           link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["image"]['link']
  #         }
  #       }
  # },
  #     type: "interactive"
  #   }.to_json

  #   response = HTTParty.post(
  #     "#{api_base_path_meta}/#{provider_config['phone_number_id']}/messages",
  #     headers: api_headers_meta,
  #     body: payload
  #   )

  #   response.success? ? response['messages'].first['id'] : nil
  # end

  def send_text_and_document_message(phone_number, message)

    payload = {
      to: phone_number,
      document: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["document"]["link"],
        filename: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["document"]["filename"]
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

  def send_text_and_document_message_meta(phone_number, message)

    payload = {
      to: phone_number,
      document: {
        link: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["document"]["link"],
        filename: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["document"]["filename"],
        caption: JSON.parse(message_content(message,phone_number).gsub('=>', ':'))["document"]["caption"]
  },
      type: "document"
    }

    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )
    parse_response(response)
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
          'caption': message_content(message,phone_number)
        }
      }.to_json
    )

    response.success? ? response['messages'].first['id'] : nil
  end


  def send_attachment_message_meta(phone_number, message)
    attachment = message.attachments.first
    type = %w[image audio video].include?(attachment.file_type) ? attachment.file_type : 'document'
    attachment_url = attachment.file_url
    if attachment.file_type == 'audio' && attachment_url.end_with?(".wav")
      type = 'document'
    end
    payload = {
      'to' => phone_number,
      'type' => type,
      type.to_s => {
        'link': attachment_url
      }
    }
    if %w[image document video].include?(type)
      if type == "document"
        payload[type]['filename'] = attachment.file.filename
      end
      payload[type]['caption'] = message_content(message,phone_number)
    else
      send_text_message_meta(phone_number, message)
    end
    response = HTTParty.post(
      get_api_url('messages'),
      headers: get_api_headers,
      body: get_api_params(payload)
    )

    parse_response(response)
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

  # def template_body_parameters(template_info)
  #   {
  #     name: template_info["name"],
  #     namespace: template_info["namespace"],
  #     language: {
  #       policy: 'deterministic',
  #       code: template_info["lang_code"]
  #     },
  #     components: [{
  #       type: 'body',
  #       parameters: template_info["parameters"]
  #     }]
  #   }
  # end

  def template_body_parameters(template_info)
    template = {
      name: template_info["name"],
      namespace: template_info["namespace"],
      language: {
        policy: 'deterministic',
        code: template_info["lang_code"]
      },
      # components: [{
      #   type: 'body',
      #   parameters: template_info["parameters"]
      # }]
    }
    if template_info['components']
      template['components'] = template_info['components'];
    else
      template['components'] = [{
        type: 'body',
        parameters: template_info["parameters"]
      }];
    end
    # Rails.logger.info "template created final"
    # Rails.logger.info template
    template
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
    response = HTTParty.post(
      "#{api_base_path}/configs/webhook",
      headers: { 'D360-API-KEY': provider_config['api_key'], 'Content-Type': 'application/json' },
      body: {
        url: "#{ENV['FRONTEND_URL']}/webhooks/whatsapp/#{phone_number}"
      }.to_json
    )
    errors.add(:provider_config, 'error setting up the webook') unless response.success?
  end
end
