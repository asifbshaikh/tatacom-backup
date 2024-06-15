class AddColumnDraftStatusToCampaign < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :draft_status, :integer
  end
end
