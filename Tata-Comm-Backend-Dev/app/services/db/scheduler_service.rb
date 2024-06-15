class Db::SchedulerService
  def self.schedule_db_import(db_schedule)
    case db_schedule.schedule_type
    when AS_SOON_AS_POSSIBLE
      DbSchedulerJob.perform_async(db_schedule.id)
    end
  end

  def self.time_zone_consideration(scheduler_params)
    start_date = scheduler_params[:start_date].present? ? Time.zone.at(scheduler_params[:start_date]) : Time.zone.now
    end_date = Time.zone.at(scheduler_params[:end_date]) if scheduler_params[:end_date].present?
    scheduler_params.merge!(start_date: start_date, end_date: end_date, next_run_at: start_date)
  end

  def self.get_rows_data(import_type, model_name, file_headers, events_name)
    if import_type == REGISTERED_AUDIENCE
      model_name.constantize.where.not(customer_id: nil).pluck(file_headers.join(','))
    elsif import_type == ANONYMOUS_AUDIENCE
      model_name.constantize.where(customer_id: nil).pluck(file_headers.join(','))
    else
      model_name.constantize.where(displayed_name: events_name).pluck(file_headers.join(','))
    end
  end

  def self.build_next_run_date(scheduler)
    if scheduler.frequency == DAILY
      update_schedler_next_run(scheduler, scheduler.repeat_every)
    elsif scheduler.repeat_on_day_of_week.present?
      sorted_repeat_on_day_of_week = sort_weekdays(scheduler.repeat_on_day_of_week)
      today_wday = scheduler.next_run_at.strftime('%A')
      today_wdays_value = WEEKDAYS_HASH[today_wday]
      today_wday_index = sorted_repeat_on_day_of_week.find_index(today_wday)
      scheduler_first_wday_value = WEEKDAYS_HASH[sorted_repeat_on_day_of_week.first]
      weekly_next_run(today_wday_index, sorted_repeat_on_day_of_week, today_wdays_value, scheduler, scheduler_first_wday_value)
    else
      monthly_next_run(scheduler)
    end
  end

  def self.weekly_next_run(today_wday_index, sorted_repeat_on_day_of_week, today_wdays_value, scheduler, scheduler_first_wday_value)
    if today_wday_index.present?
      if today_wday_index < sorted_repeat_on_day_of_week.length - 1
        next_day = sorted_repeat_on_day_of_week[today_wday_index + 1]
        next_day_weekday_value = WEEKDAYS_HASH[next_day]
        no_of_days_to_add = next_day_weekday_value - today_wdays_value
        check_and_update_next_run(scheduler, no_of_days_to_add, sorted_repeat_on_day_of_week)
      else
        if scheduler.frequency == WEEKLY
          calculate_and_update_date(scheduler, today_wdays_value, scheduler_first_wday_value)
        else
          no_of_days_to_add = SEVEN - (today_wdays_value - scheduler_first_wday_value)
          update_monthly_next_run(scheduler, no_of_days_to_add, sorted_repeat_on_day_of_week)
        end
      end
    else
      next_day_value = nil
      sorted_repeat_on_day_of_week.each do |day_name|
        if WEEKDAYS_HASH[day_name] > today_wdays_value
          next_day_value = WEEKDAYS_HASH[day_name]
          break
        end
      end
      if next_day_value.present?
        no_of_days_to_add = next_day_value - today_wdays_value
        check_and_update_next_run(scheduler, no_of_days_to_add, sorted_repeat_on_day_of_week)
      else
        if scheduler.frequency == WEEKLY
          calculate_and_update_date(scheduler, today_wdays_value, scheduler_first_wday_value)
        else
          no_of_days_to_add = SEVEN - (today_wdays_value - scheduler_first_wday_value)
          update_monthly_next_run(scheduler, no_of_days_to_add, sorted_repeat_on_day_of_week)
        end
      end
    end
  end

  def self.check_and_update_next_run(scheduler, no_of_days_to_add, sorted_repeat_on_day_of_week)
    if scheduler.frequency == WEEKLY
      update_schedler_next_run(scheduler, no_of_days_to_add)
    else
      update_monthly_next_run(scheduler, no_of_days_to_add, sorted_repeat_on_day_of_week)
    end
  end

  def self.update_monthly_next_run(scheduler, no_of_days_to_add, sorted_repeat_on_day_of_week)
    next_date = scheduler.next_run_at + no_of_days_to_add.day
    if next_date.month != scheduler.next_run_at.month
      new_next_run = scheduler.next_run_at + scheduler.repeat_every.month
      new_next_run = new_next_run - (new_next_run.mday - ONE).day
      SEVEN.times do
        break if sorted_repeat_on_day_of_week.include?(Date::DAYNAMES[new_next_run.wday])
        new_next_run = new_next_run + ONE.day
      end
      scheduler.next_run_at = new_next_run
    else
      scheduler.next_run_at = next_date
    end
    scheduler.save
  end

  def self.monthly_next_run(scheduler)
    today_day_no = scheduler.next_run_at.day
    sorted_repeat_day_of_month = scheduler.repeat_on_day_of_month.sort
    today_day_no_index = sorted_repeat_day_of_month.find_index(today_day_no)
    scheduler_first_day = sorted_repeat_day_of_month.first
    if today_day_no_index.present?
      if today_day_no_index < sorted_repeat_day_of_month.length - 1
        next_day = sorted_repeat_day_of_month[today_day_no_index + 1]
        no_of_days_to_add = next_day - today_day_no
        update_schedler_next_run(scheduler, no_of_days_to_add)
      else
        calculate_and_update_date(scheduler, today_day_no, scheduler_first_day)
      end
    else
      next_day_value = nil
      sorted_repeat_day_of_month.each do |day_no|
        if day_no > today_day_no
          next_day_value = day_no
          break
        end
      end
      if next_day_value.present?
        no_of_days_to_add = next_day_value - today_day_no
        update_schedler_next_run(scheduler, no_of_days_to_add)
      else
        calculate_and_update_date(scheduler, today_day_no, scheduler_first_day)
      end
    end
  end

  def self.sort_weekdays(days_array)
    days_value_array = days_array.map { |item| WEEKDAYS_HASH[item] }
    days_value_array.sort.map { |item| WEEKDAYS_HASH.key(item) }
  end

  def self.update_schedler_next_run(scheduler, no_of_days_to_add)
    scheduler.next_run_at = scheduler.next_run_at + no_of_days_to_add.day
    scheduler.save
  end

  def self.calculate_and_update_date(scheduler, today_day_no, scheduler_first_day)
    next_date = if scheduler.frequency == WEEKLY
                  (scheduler.next_run_at + scheduler.repeat_every.week) - (today_day_no - scheduler_first_day).day
                elsif scheduler.frequency == MONTHLY && scheduler.repeat_on_day_of_month.present?
                  (scheduler.next_run_at + scheduler.repeat_every.month) - (today_day_no - scheduler_first_day).day
                end
    scheduler.update(next_run_at: next_date)
  end
end
