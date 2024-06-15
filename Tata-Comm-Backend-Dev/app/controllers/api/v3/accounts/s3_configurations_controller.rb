class Api::V3::Accounts::S3ConfigurationsController < Api::V1::Accounts::BaseController
  include BasicTokenEncryptor
  before_action :check_authorization
  before_action :find_s3_config, only: %i[show update download_csv downloadable_csv_preview]

  def index
    @s3_configs = Current.account.s3_configurations
    if @s3_configs
      render 'api/v3/accounts/s3_configurations/index.json', locals: { resource: @s3_configs }
    else
      render json: { status: :unprocessable_entity, error_message: 'S3 Configurations not found.' }
    end
  end

  def show
    if @s3_config
      render 'api/v3/accounts/s3_configurations/show.json',
             locals: { resource: @s3_config, access_key: decrypt_token(@s3_config.access_key), secret_key: decrypt_token(@s3_config.secret_key) }
    else
      render json: { status: :unprocessable_entity, error_message: 'S3 Configuration not found.' }
    end
  end

  def create
    if s3_config_params.blank?
      render json: { error: I18n.t('s3_config.invalid_params') }, status: :unprocessable_entity
      return
    end
    s3_config = Current.account.s3_configurations.new(s3_config_params)
    if s3_config.save!
      render json: { status: :ok, success_message: I18n.t('s3_config.generic_s3_message', partial_message: 'saved successfully.') }
    else
      render json: { status: :unprocessable_entity,
                     error_message: I18n.t('s3_config.generic_s3_message', partial_message: "can't saved successfully.") }
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  def update
    if s3_config_params.blank?
      render json: { error: I18n.t('s3_config.invalid_params') }, status: :unprocessable_entity
      return
    end
    if @s3_config.update!(s3_config_params)
      render json: { status: :ok, success_message: I18n.t('s3_config.generic_s3_message', partial_message: 'updated successfully.') }
    else
      render json: { status: :unprocessable_entity,
                     error_message: I18n.t('s3_config.generic_s3_message', partial_message: "can't saved successfully.") }
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_could_not_create_error(e.message)
  end

  def download_csv
    bucket_name = @s3_config.bucket_name
    object_key = params[:import_type].downcase.to_s + USER_DATA + params[:date_format].to_s

    s3 = Aws::S3::Resource.new(
      region: @s3_config.region,
      access_key_id: decrypt_token(@s3_config.access_key),
      secret_access_key: decrypt_token(@s3_config.secret_key)
    )

    downloadable_objects = s3.bucket(bucket_name).objects(prefix: object_key)
    render_could_not_create_error(I18n.t('s3_config.invalid_download')) and return unless downloadable_objects.count > ZERO

    downloadable_objects.each do |object|
      file_dir = "#{ROOT_DIR}#{Current.account.id}/S3/#{@s3_config.id}/#{object.key}"
      FileUtils.mkdir_p(File.dirname(file_dir)) unless Dir.exist?(file_dir)
      s3.bucket(bucket_name).object("#{object_key}.csv").download_file(file_dir)
    end

    render json: { message: I18n.t('s3_config.download_success') }, status: :ok
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_internal_server_error(e.message)
  end

  def downloadable_csv_preview
    download_csv_preview_rows = []
    bucket_name = @s3_config.bucket_name

    s3 = Aws::S3::Resource.new(
      region: @s3_config.region,
      access_key_id: decrypt_token(@s3_config.access_key),
      secret_access_key: decrypt_token(@s3_config.secret_key)
    )
    downloadable_objects = s3.bucket(bucket_name).objects
    render_could_not_create_error(I18n.t('s3_config.invalid_download')) and return unless downloadable_objects.count > ZERO

    downloadable_objects.each do |object|
      if object.key.include?(params[:date_format])
        file_dir = Tempfile.new('temporary_preview_file')
        s3.bucket(bucket_name).object(object.key).download_file(file_dir)
        download_csv_preview_rows = CSV.readlines(file_dir, headers: false)[1,5]
        break
      end
    end

    if download_csv_preview_rows.length > ZERO
      render json: { message: I18n.t('s3_config.download_success'), preview_data: download_csv_preview_rows }, status: :ok
    else
      render_could_not_create_error(I18n.t('s3_config.invalid_download'))
    end
  rescue StandardError => e
    Rails.logger.error(e.message)
    render_internal_server_error(e.message)
  end

  private

  def s3_config_params
    params.require(:s3_configuration).permit(:bucket_name, :access_key, :secret_key, :region, :folder_path)
  end

  def find_s3_config
    @s3_config = Current.account.s3_configurations.find(params.fetch(:id))
  end
end
