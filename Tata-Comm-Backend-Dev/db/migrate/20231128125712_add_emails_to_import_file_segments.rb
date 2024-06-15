class AddEmailsToImportFileSegments < ActiveRecord::Migration[6.1]
  def change
    add_column :import_file_segments, :emails, :text, array: true, default: []
  end
end
