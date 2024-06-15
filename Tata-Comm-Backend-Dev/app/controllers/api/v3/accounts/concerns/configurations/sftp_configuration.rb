module Api::V3::Accounts::Concerns::Configurations::SftpConfiguration
  extend ActiveSupport::Concern
  include Sftp::SftpOperations

  def sftp_index
    @sftp_configurations = Current.account.sftp_configurations.order_by_desc
    render json: {
             sftp_configurations: ActiveModelSerializers::SerializableResource.new(@sftp_configurations,
                                                                                   each_serializer: Sftp::SftpConfigurationsSerializer)
           },
           status: :ok
  end

  def sftp_show
    set_sftp_configuration
    render json: {
             sftp_configuration: ActiveModelSerializers::SerializableResource.new(@sftp_configuration,
                                                                                  serializer: Sftp::SftpConfigurationsSerializer)
           },
           status: :ok
  end

  def sftp_create
    @sftp_configuration = Current.account.sftp_configurations.new(sftp_configuration_params)
    if @sftp_configuration.save
      render json: {
               sftp_configuration: ActiveModelSerializers::SerializableResource.new(@sftp_configuration,
                                                                                    serializer: Sftp::SftpConfigurationsSerializer)
             },
             status: :created
    else
      render json: { errors: @sftp_configuration.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def sftp_update
    set_sftp_configuration
    if @sftp_configuration.update(sftp_configuration_params)
      render json: {
               sftp_configuration: ActiveModelSerializers::SerializableResource.new(@sftp_configuration,
                                                                                    serializer: Sftp::SftpConfigurationsSerializer)
             },
             status: :ok
    else
      render json: { errors: @sftp_configuration.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def sftp_list_files
    set_sftp_configuration
    establish_sftp_connection
    files = list_files(@sftp_configuration.decrypted_folder_path, params[:import_type], params[:date_format])
    render json: files
  end

  def sftp_download_files
    set_sftp_configuration
    establish_sftp_connection
    downloaded = download_file(@sftp_configuration.decrypted_folder_path, params[:import_type], params[:date_format])
    render json: downloaded
  end

  def sftp_validate_remote_file
    set_sftp_configuration
    establish_sftp_connection
    rows = view_first_file_with_five_lines(@sftp_configuration.decrypted_folder_path, params[:import_type], params[:date_format])
    render json: rows
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_sftp_configuration
    @sftp_configuration = Current.account.sftp_configurations.find(params[:id])
  end

  def establish_sftp_connection
    @sftp_connection = Sftp::SftpClient.new(@sftp_configuration).connect
    begin
      render json: { message: @sftp_connection[:message] }, status: :unprocessable_entity and return if @sftp_connection[:message].present?
    rescue StandardError
      true
    end
  end

  # Only allow a list of trusted parameters through.
  def sftp_configuration_params
    params.require(:sftp_configuration).permit(:hostname, :username, :password, :folder_path, :decryption_key, :is_encrypted)
  end

  def connect_params
    params.permit(:hostname, :username, :password, :decryption_key, :folder_path)
  end
end
