module BasicTokenEncryptor
  def encrypt_token(token)
    encrypt_salted.encrypt_and_sign(token)
  end

  def decrypt_token(token)
    encrypt_salted.decrypt_and_verify(token)
  end

  def validate_and_decode_auth_token(auth_token)
    key = begin
      auth_token&.split(' ')&.[](1)
    rescue StandardError
      auth_token
    end
    decoded_data = Base64.decode64(key)

    decoded_data.start_with?('tcl') && decoded_data.size <= 100
  rescue StandardError
    false
  end

  private

  def encrypt_salted
    ActiveSupport::MessageEncryptor.new(Rails.application.secrets.tcl_token_encrypt_secret[0..31])
  end
end
