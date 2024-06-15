class AddChannelIdAndChannelTypeInCampaignDelivery < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :channel_type, :string, index: true
    add_column :campaigns, :channel_id, :integer, index: true
    add_column :campaigns, :template_customized, :boolean
    add_column :campaign_deliveries, :channel_type, :string, index: true
    add_column :campaign_deliveries, :channel_id, :integer, index: true

    remove_column :campaign_schedulers, :is_template_customized
  end
end
