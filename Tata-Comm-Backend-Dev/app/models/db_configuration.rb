# == Schema Information
#
# Table name: db_configurations
#
#  id         :uuid             not null, primary key
#  adapter    :string
#  database   :string
#  encoding   :string
#  host       :text
#  name       :string
#  password   :string
#  port       :string
#  username   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  account_id :bigint           not null
#
# Indexes
#
#  index_db_configurations_on_account_id  (account_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#
class DbConfiguration < ApplicationRecord
  include BasicTokenEncryptor

  belongs_to :account

  validates :adapter, :encoding, :host, :username, :password, :database, :port, :account_id, :name, presence: true

  validates :name, uniqueness: { scope: :account_id }

  scope :order_by_desc, -> { order(created_at: :desc) }

  before_save :encrypt_attributes

  def encrypt_attributes
    self.host = encrypt_token(host) if host_changed?
    self.username = encrypt_token(username) if username_changed?
    self.password = encrypt_token(password) if password_changed?
    self.database = encrypt_token(database) if database_changed?
  end

  def decrypted_host
    decrypt_token(host)
  rescue StandardError
    host
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

  def decrypted_database
    decrypt_token(database)
  rescue StandardError
    database
  end
end
