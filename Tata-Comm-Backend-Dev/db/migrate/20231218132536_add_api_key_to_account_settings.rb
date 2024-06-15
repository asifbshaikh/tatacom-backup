class AddApiKeyToAccountSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :account_settings, :api_key, :integer
    add_column :account_settings, :access_token, :string
    add_column :account_settings, :token_expires_at, :datetime
  end
end