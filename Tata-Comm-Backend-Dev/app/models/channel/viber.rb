# == Schema Information
#
# Table name: channel_viber_sms
#
#  id           :bigint           not null, primary key
#  channel_type :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  account_id   :integer          not null
#  service_id   :string           not null
#

class Channel::Viber < ApplicationRecord
  include Channelable

  self.table_name = 'channel_viber_sms'
  EDITABLE_ATTRS = [:channel_type, :service_id].freeze

  # before_validation :ensure_valid_bot_token, on: :create
  # validates :bot_token, presence: true, uniqueness: true
  # before_save :setup_viber_webhook

  def name
    'Viber'
  end

  def viber_api_url
    "https://api.viber.org/bot#{bot_token}"
  end

  def send_message_on_viber(message)
    return send_message(message) if message.attachments.empty?

    send_attachments(message)
  end

  def get_viber_profile_image(user_id)
    # get profile image from viber
    response = HTTParty.get("#{viber_api_url}/getUserProfilePhotos", query: { user_id: user_id })
    return nil unless response.success?

    photos = response.parsed_response.dig('result', 'photos')
    return if photos.blank?

    get_viber_file_path(photos.first.last['file_id'])
  end

  def get_viber_file_path(file_id)
    response = HTTParty.get("#{viber_api_url}/getFile", query: { file_id: file_id })
    return nil unless response.success?

    "https://api.viber.org/file/bot#{bot_token}/#{response.parsed_response['result']['file_path']}"
  end

  private

  def ensure_valid_bot_token
    response = HTTParty.get("#{viber_api_url}/getMe")
    unless response.success?
      errors.add(:bot_token, 'invalid token')
      return
    end

    self.bot_name = response.parsed_response['result']['username']
  end

  def setup_viber_webhook
    HTTParty.post("#{viber_api_url}/deleteWebhook")
    response = HTTParty.post("#{viber_api_url}/setWebhook",
                             body: {
                               url: "#{ENV['FRONTEND_URL']}/webhooks/viber/#{bot_token}"
                             })
    errors.add(:bot_token, 'error setting up the webook') unless response.success?
  end

  def send_message(message)
    response = message_request(message.conversation[:additional_attributes]['chat_id'], message.content)
    response.parsed_response['result']['message_id'] if response.success?
  end

  def send_attachments(message)
    send_message(message) unless message.content.nil?

    viber_attachments = []
    message.attachments.each do |attachment|
      viber_attachment = {}

      case attachment[:file_type]
      when 'image'
        viber_attachment[:type] = 'photo'
      when 'file'
        viber_attachment[:type] = 'document'
      end
      viber_attachment[:media] = attachment.file_url
      viber_attachments << viber_attachment
    end

    response = attachments_request(message.conversation[:additional_attributes]['chat_id'], viber_attachments)
    response.parsed_response['result'].first['message_id'] if response.success?
  end

  def attachments_request(chat_id, attachments)
    HTTParty.post("#{viber_api_url}/sendMediaGroup",
                  body: {
                    chat_id: chat_id,
                    media: attachments.to_json
                  })
  end

  def message_request(chat_id, text)
    HTTParty.post("#{viber_api_url}/sendMessage",
                  body: {
                    chat_id: chat_id,
                    text: text
                  })
  end
end
