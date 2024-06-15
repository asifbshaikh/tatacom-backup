class AddUserAttributeColumnToCampaigns < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :selected_contact_attribute, :string
  end
end
