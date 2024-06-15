class AddIndexToCampaigns < ActiveRecord::Migration[6.1]
  def change
    add_index :campaigns, [:campaignable_id, :campaignable_type]
  end
end
