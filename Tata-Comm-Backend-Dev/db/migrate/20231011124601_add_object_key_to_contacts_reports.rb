class AddObjectKeyToContactsReports < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts_reports, :object_key, :string
  end
end
