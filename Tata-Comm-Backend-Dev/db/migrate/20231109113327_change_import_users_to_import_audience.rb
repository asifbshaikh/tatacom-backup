class ChangeImportUsersToImportAudience < ActiveRecord::Migration[6.1]
  def up
    segments = Segment.where(source_type: 'Import Users')
    segments.update_all(source_type: 'import_audience')
  end

  def down
    segments = Segment.where(source_type: 'import_audience')
    segments.update_all(source_type: 'Import Users')
  end
end
