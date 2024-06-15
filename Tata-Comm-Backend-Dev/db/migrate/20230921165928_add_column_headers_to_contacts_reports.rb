class AddColumnHeadersToContactsReports < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts_reports, :header, :jsonb, default: {}
  end
end
