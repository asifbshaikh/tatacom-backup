class DbPeriodicSchedulerJob
  include Sidekiq::Worker
  queue_as :default

  def perform(*_args)
    db_periodic_scheduler = DbScheduleDetail.scheduler_records
    Rails.logger.info "#{db_periodic_scheduler.count} - Available Jobs count"
    Rails.logger.info "No Jobs found to schedule at #{Time.zone.now}" if db_periodic_scheduler.count.zero?

    db_periodic_scheduler.each do |scheduler|
      if scheduler.schedule_type == AT_SPECIFIC_TIME
        DbSchedulerJob.perform_async(scheduler&.id)
      else
        periodic_time_schedule(scheduler)
      end
    end
  end

  def periodic_time_schedule(scheduler)
    # To fetch schedule for adding condition on worker's call
    if scheduler.occurrences.present? && scheduler.occurrence_count.present? && scheduler.occurrence_count >= scheduler.occurrences
      update_status(scheduler)
      nil
    elsif scheduler.end_date == Time.now.utc
      update_status(scheduler)
      nil
    else
      Db::SchedulerService.build_next_run_date(scheduler)
      DbSchedulerJob.perform_async(scheduler&.id)
    end
  end

  def update_status(scheduler)
    scheduler.update(status: TWO)
  end
end
