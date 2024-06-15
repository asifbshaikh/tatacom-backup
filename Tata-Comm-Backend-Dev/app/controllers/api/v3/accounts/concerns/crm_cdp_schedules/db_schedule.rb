module Api::V3::Accounts::Concerns::CrmCdpSchedules::DbSchedule
  include Pagination

  def db_index
    db_schedules = if params[:import_type] == EVENT
                     Current.account.db_schedule_details.event_import.order_by_desc
                   else
                     Current.account.db_schedule_details.audience_import.order_by_desc
                   end
    db_schedules = db_schedules.page(page.to_i).per(per_page.to_i)
    render json: {
             db_schedules: ActiveModelSerializers::SerializableResource.new(db_schedules,
                                                                            each_serializer: Db::DbSchedulesSerializer),
             pagination: pagination_values(db_schedules)
           },
           status: :ok
  end

  def db_show
    set_db_schedule
    render json: {
             db_schedule: ActiveModelSerializers::SerializableResource.new(@db_schedule,
                                                                           serializer: Db::DbSchedulesSerializer)
           },
           status: :ok
  end

  def db_create
    db_schedule_params = db_schedule_details_params
    db_schedule_params = Db::SchedulerService.time_zone_consideration(db_schedule_params)
    db_schedule = Current.account.db_schedule_details.new(db_schedule_params)
    if db_schedule.save
      Db::SchedulerService.schedule_db_import(db_schedule)
      render json: {
               db_schedule: ActiveModelSerializers::SerializableResource.new(db_schedule,
                                                                             serializer: Db::DbSchedulesSerializer)
             },
             status: :created
    else
      render json: { errors: db_schedule.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def db_update
    set_db_schedule
    db_schedule_params = db_schedule_details_params
    db_schedule_params = Db::SchedulerService.time_zone_consideration(db_schedule_params)
    if @db_schedule.update(db_schedule_params)
      render json: {
               db_schedule: ActiveModelSerializers::SerializableResource.new(@db_schedule,
                                                                             serializer: Db::DbSchedulesSerializer)
             },
             status: :ok
    else
      render json: { errors: @db_schedule.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def db_preview
    db_config = DbConfiguration.find(params[:db_preview][:source_id])
    model_name = Db::DbWrapper.new(db_config, db_config.name).establish_class_connection
    model_name.constantize.table_name = params[:db_preview][:table_name]
    result_headers = model_name.constantize.column_names
    result_rows = get_rows_data(params[:db_preview][:import_type], model_name, params[:db_preview][:events_name]).first(5)
    DynamicClassService.remove_connection_and_class(model_name)
    if params[:db_preview][:import_type] == EVENT
      render json: { data: { headers: result_headers, rows: result_rows } }, status: :ok
    else
      render json: { data: { headers: result_headers, rows: ActiveModelSerializers::SerializableResource.new(result_rows,
                                                                                                             each_serializer: Db::AudiencePreviewSerializer) } }, status: :ok
    end
  rescue LoadError
    render json: { error: I18n.t('db_configuration.test_connection.errror') }, status: :unprocessable_entity
  rescue StandardError => e
    DynamicClassService.remove_connection_and_class(model_name)
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def db_deactivate
    set_db_schedule
    job = Sidekiq::Cron::Job.find(name: "db_schedule-#{@db_schedule.id}")
    job.destroy if job.present?
    if @db_schedule.update(deactivate: true, status: THREE)
      render json: {
               message: I18n.t('db_schedule.deactivate')
             },
             status: :ok
    else
      render json: { errors: @db_schedule.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def db_imports
    set_db_schedule
    imports = @db_schedule.data_sync_imports.order_by_desc
    render json: {
             imports: ActiveModelSerializers::SerializableResource.new(imports,
                                                                       each_serializer: Db::DataSyncImportsSerializer)
           },
           status: :ok
  rescue StandardError => e
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_db_schedule
    @db_schedule = Current.account.db_schedule_details.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def db_schedule_details_params
    params.require(:db_schedule_detail).permit(:end_type, :end_date, :frequency, :import_name, :import_type, :start_date, :occurrences, :repeat_every,
                                               :schedule_type, :segment_name, :source_id, :source_type, :table_name, :time_zone, :status,
                                               email_ids: [], events_name: [], repeat_on_day_of_month: [], repeat_on_day_of_week: [])
  end

  def get_rows_data(import_type, model_name, events_name)
    if import_type == REGISTERED_AUDIENCE
      model_name.constantize.where.not(customer_id: nil)
    elsif import_type == ANONYMOUS_AUDIENCE
      model_name.constantize.where(customer_id: nil)
    else
      model_name.constantize.where(displayed_name: events_name)
    end
  end
end
