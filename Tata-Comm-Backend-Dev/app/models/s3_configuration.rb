# == Schema Information
#
# Table name: s3_configurations
#
#  id          :uuid             not null, primary key
#  access_key  :text
#  bucket_name :string
#  folder_path :string
#  region      :string
#  secret_key  :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  account_id  :bigint           not null
#
# Indexes
#
#  index_s3_configurations_on_account_id  (account_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#
class S3Configuration < ApplicationRecord
  include BasicTokenEncryptor
  validates :access_key, :presence => true
  validates :secret_key, :presence => true
  belongs_to :account

  before_save :encrypt_credentials

  def encrypt_credentials
    self.access_key = encrypt_token(access_key) if access_key_changed?
    self.secret_key = encrypt_token(secret_key) if secret_key_changed?
  end

  def decrypted_access_key
    decrypt_token(access_key)
  rescue StandardError
    access_key
  end

  def decrypted_secret_key
    decrypt_token(secret_key)
  rescue StandardError
    secret_key
  end
end
