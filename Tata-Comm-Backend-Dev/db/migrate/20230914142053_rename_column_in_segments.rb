class RenameColumnInSegments < ActiveRecord::Migration[6.1]
  def change
    rename_column :segments, :last_archieved_time, :archived_at
    rename_column :segments, :archieved, :archived
  end
end
