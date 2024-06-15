class ChangeColumnTypeSenderIdCampaignType < ActiveRecord::Migration[6.1]
  def change
    change_column :templates, :sender_id, :string
    change_column :campaign_schedulers, :campaign_type, :string
  end
end
