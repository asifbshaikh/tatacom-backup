class DbSchedulerJob
  include Sidekiq::Worker
  queue_as :high

  def perform(db_schedule_id)
    db_schedule = DbScheduleDetail.find(db_schedule_id)
    db_schedule_occurrence_update(db_schedule) if db_schedule.occurrences.present?
    return if db_schedule.complete?
    import_name = "#{db_schedule.import_name}_#{Time.zone.today}"
    db_schedule.update(status: ONE, run_at: Time.zone.now)
    d_s_import = DataSyncImport.create(name: import_name, status: ZERO, import_type: 'db', crm_cdp_schedule_detail_id: db_schedule.id,
                                       account_id: db_schedule.account_id)
    db_config = DbConfiguration.find(db_schedule.source_id)
    model_name = Db::DbWrapper.new(db_config, db_schedule.import_name).establish_class_connection
    model_name.constantize.table_name = db_schedule.table_name

    file_headers = model_name.constantize.column_names
    file_path = get_file_path(db_schedule)
    rows_data = Db::SchedulerService.get_rows_data(db_schedule.import_type, model_name, file_headers, db_schedule.events_name)
    csv_data = [file_headers] + rows_data
    File.write(file_path, csv_data.map(&:to_csv).join) # writing the generated file to local

    aws_s3 = S3::S3Service.set_aws_client
    key = S3::S3Service.db_import_file_upload(db_schedule, aws_s3, file_path)
    d_s_import.update(file_key: key, status: ONE, synced_count: ONE)

    FileUtils.rm(file_path) # remove the generated file from local

    DbRecordInsertionJob.perform_async(db_schedule_id, d_s_import.id, d_s_import.file_key)
  rescue StandardError => e
    d_s_import.update(status: THREE, failed_error: e.message)
    db_schedule.update(status: FOUR) if db_schedule.asap? || db_schedule.at_specific_time?
    DbRecordInsertionJob.trigger_notification_mail(db_schedule, false)
    Rails.logger.error "Failed in DbSchedulerJob perform at #{Time.zone.now} with errror: #{e}"
  end

  def get_file_path(db_schedule)
    dir = Rails.root.to_s + "/tmp/crm_cdp/#{db_schedule.account_id}/db/#{db_schedule.source_id}/#{db_schedule.import_type}"
    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    "#{dir}/#{db_schedule.import_name}_#{Time.zone.today}.csv"
  end

  def db_schedule_occurrence_update(db_schedule)
    db_schedule.occurrence_count += 1
    db_schedule.save
  end
end
