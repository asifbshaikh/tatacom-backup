class AddSegmentIdInContactsReportsTable < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts_reports, :segment_id, :bigint
  end
end
