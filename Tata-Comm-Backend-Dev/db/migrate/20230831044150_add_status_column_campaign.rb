class AddStatusColumnCampaign < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :status, :integer, after: :created_at
  end
end
