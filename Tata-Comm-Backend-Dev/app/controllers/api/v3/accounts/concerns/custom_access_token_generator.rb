module Api::V3::Accounts::Concerns::CustomAccessTokenGenerator
    extend ActiveSupport::Concern
    include BasicTokenEncryptor

    def generate_custom_access_token(params)
    token_expires_time = 30.minutes.from_now.utc
    payload = {
      app_id: params[:app_id],
      exp: token_expires_time.to_i
    }
    payload['api_key'] = params['api_key'] || nil
    token = JWT.encode(payload, ENV['SECRET_KEY_BASE'], 'HS256')
    @account_setting.update(access_token: token, token_expires_at: token_expires_time) if token.present?
  end

  def validate_access_token
    bearer_token = request.headers['Authorization']&.split(' ')&.last
    decoded_token = JWT.decode(bearer_token, ENV['SECRET_KEY_BASE'], true, algorithm: 'HS256')&.first
    account_setting = AccountSetting.find_by(app_id: decoded_token['app_id'] , account_id: params[:id])
    render_unauthorized('Invalid Access Token') && return if decoded_token.nil? || account_setting.nil?
  rescue JWT::DecodeError => e
    render json: { error: "Unauthorized request" }, status: :unauthorized
  end
end