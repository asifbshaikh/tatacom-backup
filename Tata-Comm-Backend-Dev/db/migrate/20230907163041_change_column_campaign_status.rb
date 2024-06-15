class ChangeColumnCampaignStatus < ActiveRecord::Migration[6.1]
  def change
    change_column :campaigns, :status, :integer, after: :created_at,:default => 0
  end
end
