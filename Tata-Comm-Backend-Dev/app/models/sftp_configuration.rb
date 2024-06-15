# == Schema Information
#
# Table name: sftp_configurations
#
#  id             :uuid             not null, primary key
#  decryption_key :text
#  folder_path    :string
#  hostname       :string
#  is_encrypted   :boolean          default(FALSE)
#  password       :string
#  username       :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  account_id     :bigint           not null
#
# Indexes
#
#  index_sftp_configurations_on_account_id  (account_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#
class SftpConfiguration < ApplicationRecord
  include BasicTokenEncryptor

  belongs_to :account

  validates_presence_of %i[hostname username password folder_path account_id]
  validates_presence_of :decryption_key, if: :is_encrypted

  scope :order_by_desc, -> { order(created_at: :desc) }

  before_save :encrypt_attributes

  def encrypt_attributes
    self.hostname = encrypt_token(hostname) if hostname_changed?
    self.username = encrypt_token(username) if username_changed?
    self.password = encrypt_token(password) if password_changed?
    self.folder_path = encrypt_token(folder_path) if folder_path_changed?
    self.decryption_key = encrypt_token(decryption_key) if decryption_key_changed?
  end

  def decrypted_hostname
    decrypt_token(hostname)
  rescue StandardError
    hostname
  end

  def decrypted_username
    decrypt_token(username)
  rescue StandardError
    username
  end

  def decrypted_password
    decrypt_token(password)
  rescue StandardError
    password
  end

  def decrypted_folder_path
    decrypt_token(folder_path)
  rescue StandardError
    folder_path
  end

  def decrypted_decryption_key
    decrypt_token(decryption_key)
  rescue StandardError
    decryption_key
  end
end
