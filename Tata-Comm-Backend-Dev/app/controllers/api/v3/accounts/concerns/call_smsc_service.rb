module Api::V3::Accounts::Concerns::CallSmscService
  extend ActiveSupport::Concern
  include BasicTokenEncryptor
  BASE_URL = ENV.fetch('TATA_SMSC_BASE_URL', nil)
  def authenticate_tata
    uri = URI.parse(BASE_URL)
 
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
 
    req = Net::HTTP::Post.new(uri.path, {
                                'Content-Type' => 'application/json',
                                'Authorization' => create_permitted_params[:auth_token]
                              })
 
    req.body = test_sms_params.to_json
    https.request(req)
  end
end
