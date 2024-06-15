module Api::V3::Accounts::Concerns::Configurations::DbConfiguration
  include Pagination

  def db_index
    db_configurations = Current.account.db_configurations.order_by_desc
    db_configurations = db_configurations.page(page.to_i).per(per_page.to_i)
    render json: {
             db_configurations: ActiveModelSerializers::SerializableResource.new(db_configurations,
                                                                                 each_serializer: Db::DbConfigurationsSerializer),
             pagination: pagination_values(db_configurations)
           },
           status: :ok
  end

  def db_show
    set_db_configuration
    render json: {
             db_configuration: ActiveModelSerializers::SerializableResource.new(@db_configuration,
                                                                                serializer: Db::DbConfigurationsSerializer)
           },
           status: :ok
  end

  def db_create
    db_configuration = Current.account.db_configurations.new(db_configuration_params)
    if db_configuration.save
      render json: {
               db_configuration: ActiveModelSerializers::SerializableResource.new(db_configuration,
                                                                                  serializer: Db::DbConfigurationsSerializer)
             },
             status: :created
    else
      render json: { errors: db_configuration.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def db_update
    set_db_configuration
    if @db_configuration.update(db_configuration_params)
      render json: {
               db_configuration: ActiveModelSerializers::SerializableResource.new(@db_configuration,
                                                                                  serializer: Db::DbConfigurationsSerializer)
             },
             status: :ok
    else
      render json: { errors: @db_configuration.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def db_destroy
    set_db_configuration
    active_db_schedules = DbScheduleDetail.where(source_id: params[:id], status: [INITIATED, PROCESSING])
    if active_db_schedules.size > ZERO
      render json: { message: I18n.t('db_configuration.destroy.active_db_connection') }, status: :unprocessable_entity
    elsif @db_configuration.destroy
      render json: { message: I18n.t('db_configuration.destroy.success') }, status: :ok
    end
  rescue StandardError => e
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  # method to test database connection
  def db_test_connection
    db_config = DbConfiguration.new(db_configuration_params)
    model_name = Db::DbWrapper.new(db_config, db_configuration_params['name']).establish_class_connection
    model_name.constantize.table_name = params['db_configuration']['table_name']
    record = model_name.constantize.first
    DynamicClassService.remove_connection_and_class(model_name)
    render json: { data: record, message: I18n.t('db_configuration.test_connection.success') }, status: :ok
  rescue LoadError => e
    render json: { errors: I18n.t('db_configuration.test_connection.errror') }, status: :unprocessable_entity
  rescue StandardError => e
    DynamicClassService.remove_connection_and_class(model_name)
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  def db_configuration_list
    db_configurations = Current.account.db_configurations.select('id, name').as_json
    render json: { db_configurations: db_configurations }, status: :ok
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_db_configuration
    @db_configuration = Current.account.db_configurations.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def db_configuration_params
    params.require(:db_configuration).permit(:name, :adapter, :encoding, :host, :username, :database, :password, :port)
  end
end
