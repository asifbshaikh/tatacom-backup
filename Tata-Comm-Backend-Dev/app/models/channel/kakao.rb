# == Schema Information
#
# Table name: channel_kakao_sms
#
#  id           :bigint           not null, primary key
#  channel_type :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  account_id   :integer          not null
#  service_id   :string
#

class Channel::Kakao < ApplicationRecord
  include Channelable

  self.table_name = 'channel_kakao_sms'
  EDITABLE_ATTRS = [:channel_type, :service_id].freeze

  # before_validation :ensure_valid_bot_token, on: :create
  # validates :bot_token, presence: true, uniqueness: true
  # before_save :setup_kakao_webhook

  def name
    'Kakao'
  end

  def kakao_api_url
    "https://api.kakao.org/bot#{bot_token}"
  end

  def send_message_on_kakao(message)
    return send_message(message) if message.attachments.empty?

    send_attachments(message)
  end

  def get_kakao_profile_image(user_id)
    # get profile image from kakao
    response = HTTParty.get("#{kakao_api_url}/getUserProfilePhotos", query: { user_id: user_id })
    return nil unless response.success?

    photos = response.parsed_response.dig('result', 'photos')
    return if photos.blank?

    get_kakao_file_path(photos.first.last['file_id'])
  end

  def get_kakao_file_path(file_id)
    response = HTTParty.get("#{kakao_api_url}/getFile", query: { file_id: file_id })
    return nil unless response.success?

    "https://api.kakao.org/file/bot#{bot_token}/#{response.parsed_response['result']['file_path']}"
  end

  private

  def ensure_valid_bot_token
    response = HTTParty.get("#{kakao_api_url}/getMe")
    unless response.success?
      errors.add(:bot_token, 'invalid token')
      return
    end

    self.bot_name = response.parsed_response['result']['username']
  end

  def setup_kakao_webhook
    HTTParty.post("#{kakao_api_url}/deleteWebhook")
    response = HTTParty.post("#{kakao_api_url}/setWebhook",
                             body: {
                               url: "#{ENV['FRONTEND_URL']}/webhooks/kakao/#{bot_token}"
                             })
    errors.add(:bot_token, 'error setting up the webook') unless response.success?
  end

  def send_message(message)
    response = message_request(message.conversation[:additional_attributes]['chat_id'], message.content)
    response.parsed_response['result']['message_id'] if response.success?
  end

  def send_attachments(message)
    send_message(message) unless message.content.nil?

    kakao_attachments = []
    message.attachments.each do |attachment|
      kakao_attachment = {}

      case attachment[:file_type]
      when 'image'
        kakao_attachment[:type] = 'photo'
      when 'file'
        kakao_attachment[:type] = 'document'
      end
      kakao_attachment[:media] = attachment.file_url
      kakao_attachments << kakao_attachment
    end

    response = attachments_request(message.conversation[:additional_attributes]['chat_id'], kakao_attachments)
    response.parsed_response['result'].first['message_id'] if response.success?
  end

  def attachments_request(chat_id, attachments)
    HTTParty.post("#{kakao_api_url}/sendMediaGroup",
                  body: {
                    chat_id: chat_id,
                    media: attachments.to_json
                  })
  end

  def message_request(chat_id, text)
    HTTParty.post("#{kakao_api_url}/sendMessage",
                  body: {
                    chat_id: chat_id,
                    text: text
                  })
  end
end
