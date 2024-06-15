class Db::DataSyncImportsSerializer < ActiveModel::Serializer
  attributes :id, :account_id, :crm_cdp_schedule_detail_id, :folder_path, :name, :processed_count, :synced_count, :created_at, :updated_at, :import_type, :status, :file_key,
             :failed_error, :segment_name, :total_rows, :processed_rows

  def created_at
    object.created_at.to_i
  end

  def updated_at
    object.updated_at.to_i
  end
end
