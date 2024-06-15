class RemoveStatusColumnCampaign < ActiveRecord::Migration[6.1]
  def change
    remove_column :campaigns, :status
  end
end
