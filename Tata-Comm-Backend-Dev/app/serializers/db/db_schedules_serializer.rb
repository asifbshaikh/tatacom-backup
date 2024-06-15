class Db::DbSchedulesSerializer < ActiveModel::Serializer
  attributes :id, :end_type, :frequency, :import_name, :occurrences, :schedule_type, :segment_name, :connection_name, :source_type, :source_id, :status, :table_name,
             :time_zone, :import_type, :email_ids, :start_date, :end_date, :deactivate, :events_name, :repeat_on_day_of_month, :repeat_on_day_of_week, :cron_expression,
             :occurrence_count, :repeat_every, :created_at, :updated_at, :run_at, :next_run_at

  def connection_name
    DbConfiguration.find(object.source_id).decrypted_database
  end

  def start_date
    object.start_date.to_i
  end

  def end_date
    object.end_date.to_i
  end

  def created_at
    object.created_at.to_i
  end

  def updated_at
    object.updated_at.to_i
  end

  def run_at
    object.run_at.to_i
  end

  def next_run_at
    object.next_run_at.to_i
  end
end
