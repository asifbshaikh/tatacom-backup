module Api::V3::Accounts::Concerns::CallEmailService
  extend ActiveSupport::Concern
  include BasicTokenEncryptor
  BASE_URL = ENV.fetch('TATA_EMAIL_BASE_URL', nil)
  API_KEY = ENV.fetch('TATA_EMAIL_API_KEY')
  def authenticate_email_connector
    uri = URI.parse(BASE_URL)

    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true

    req = Net::HTTP::Post.new(uri.path, {
                                'Content-Type' => 'application/json',
                                'api-key' => API_KEY
                              })
    req.body = test_email_params.to_json
    response = https.request(req)

    JSON.parse(response.body)
  rescue StandardError => e
    Rails.logger.info "CallEmailService:  #{e.message}"
  end
end
