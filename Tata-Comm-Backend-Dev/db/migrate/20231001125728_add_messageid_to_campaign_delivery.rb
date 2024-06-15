class AddMessageidToCampaignDelivery < ActiveRecord::Migration[6.1]
  def change
    add_column :campaign_deliveries, :messageid, :string, index: true
    add_column :channel_email, :auth_token, :text
  end
end
