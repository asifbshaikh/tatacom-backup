class ChangeContactSourceIdToArray < ActiveRecord::Migration[6.1]
  def up
    change_column :contacts, :source_id, :integer, array: true, default: [], using: 'ARRAY[source_id]::INTEGER[]'
  end

  def down
    change_column :contacts, :source_id, :integer
  end
end
