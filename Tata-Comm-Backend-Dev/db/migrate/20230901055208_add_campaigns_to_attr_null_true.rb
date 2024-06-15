class AddCampaignsToAttrNullTrue < ActiveRecord::Migration[6.1]
  def change
    change_column_null :campaigns, :title, true
    change_column_null :campaigns, :message, true
    change_column_null :campaigns, :inbox_id, true
  end
end
