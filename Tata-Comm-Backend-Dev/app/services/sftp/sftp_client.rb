require 'net/sftp'
require 'uri'

class Sftp::SftpClient

  def initialize(sftp)
    @hostname = sftp.decrypted_hostname
    @username = sftp.decrypted_username
    @password = sftp.decrypted_password
    @pem_file_string = if sftp.decrypted_decryption_key.present?
                            [rephrase_pem_key(sftp.decrypted_decryption_key)]
                        else
                          []
                        end
  end

  def connect
    Net::SFTP.start(@hostname, @username, password: @password, key_data: @pem_file_string, keys: [], keys_only: true).connect!
  rescue StandardError
    { message: I18n.t('sftp_configuration.sftp_client.error', hostname: @hostname) }
  end

  def rephrase_pem_key(key_data)
    main_key = key_data.split(BEGIN_RSA)[1].split(END_RSA)
    BEGIN_RSA + "\n#{main_key.join}\n" + END_RSA
  rescue StandardError => e
    Rails.logger.error(e.message)
  end
end
