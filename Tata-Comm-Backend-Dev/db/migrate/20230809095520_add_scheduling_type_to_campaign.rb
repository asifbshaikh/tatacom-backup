class AddSchedulingTypeToCampaign < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :scheduling_type, :integer, default: nil
  end
end
