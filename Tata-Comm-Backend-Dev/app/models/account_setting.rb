# == Schema Information
#
# Table name: account_settings
#
#  id               :bigint           not null, primary key
#  access_token     :string
#  api_key          :integer
#  token_expires_at :datetime
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  account_id       :integer
#  app_id           :string
#
class AccountSetting < ApplicationRecord
  belongs_to :account
  validates :account_id, presence: true
  validates :app_id, presence: true

  def self.authenticate!(app_id, account_id)
    account_setting = find_by(app_id: app_id, account_id: account_id)
    account_setting if account_setting.present?
  end

  def as_json
    super(only: [:app_id, :account_id])
  end
end
