class AddColumnToInboxArchived < ActiveRecord::Migration[6.1]
  def change
    add_column :inboxes, :archived, :boolean, default: false
  end
end
