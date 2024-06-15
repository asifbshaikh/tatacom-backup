class Sftp::SftpConfigurationsSerializer < ActiveModel::Serializer
  attributes :id, :hostname, :username, :password, :folder_path, :is_encrypted, :decryption_key, :created_at, :account_id

  def hostname
    object.decrypted_hostname
  end

  def username
    object.decrypted_username
  end

  def password
    object.decrypted_password
  end

  def folder_path
    object.decrypted_folder_path
  end

  def decryption_key
    object.decrypted_decryption_key
  end

  def created_at
    object.created_at.to_i
  end
end