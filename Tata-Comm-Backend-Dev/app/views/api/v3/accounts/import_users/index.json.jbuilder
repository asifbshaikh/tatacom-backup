if @import_users.present?
  json.total_records @total_record
  json.data do
    json.array! @import_users do |import_user|
      json.uploaded_date import_user.updated_at.to_i
      json.files_uploaded import_user.file_url
      json.file_name import_user.file_name
      json.import_type import_user.user_type
      json.total_rows_in_file import_user.total_rows
      json.new_users_added import_user.new_users_count
      json.users_updated import_user.updated_users_count
      json.failed_users import_user.failed_count
      json.skipped_records import_user.skipped_count
      json.custom_segment import_user.custom_segment
      json.status import_user.status
    end
  end
end
