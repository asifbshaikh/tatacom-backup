class AddColumnsToChannelEmails < ActiveRecord::Migration[6.1]
  def change
    add_column :channel_email, :email_api_url,     :string
    add_column :channel_email, :email_api_key, :string
  end
end
