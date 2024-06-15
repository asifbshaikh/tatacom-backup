class AddColumnToCampaign < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :personalise_mapping_attribute, :jsonb, null: true, default: {}
    add_column :campaigns, :segment_attribute, :jsonb, null: true, default: {}
  end
end
