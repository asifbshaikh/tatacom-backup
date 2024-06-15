class AddColumnToDevice < ActiveRecord::Migration[6.1]
  def change
    add_column :devices, :moe_first_visit, :boolean, default: false
    add_column :devices, :url, :string
    add_column :devices, :moe_logged_in_status, :boolean, default: false
    add_column :contact_common_events, :product_url, :string
  end
end
