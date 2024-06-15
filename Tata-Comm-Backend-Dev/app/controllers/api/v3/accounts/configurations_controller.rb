class Api::V3::Accounts::ConfigurationsController < Api::V1::Accounts::BaseController
  include Api::V3::Accounts::Concerns::Configurations::SftpConfiguration
  include Api::V3::Accounts::Concerns::Configurations::S3Configuration
  include Api::V3::Accounts::Concerns::Configurations::DbConfiguration

  before_action :set_source_type, except: %i[create]

  def index; end

  def show; end

  def create
    instance_eval("#{params[:source_type]}_#{action_name}", __FILE__, __LINE__)
  rescue StandardError
    render_could_not_create_error(I18n.t('errors.configurations.invalid_source_type', partial_message: params[:source_type]))
  end

  def update; end

  def destroy; end

  def test_connection; end

  def configuration_list; end

  private

  def set_source_type
    instance_eval("#{params[:source_type]}_#{action_name}", __FILE__, __LINE__)
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error(e.message)
    Sentry.capture_exception(e)
    render_not_found_error(I18n.t('errors.resource_not_found'))
  rescue StandardError
    render_could_not_create_error(I18n.t('errors.configurations.invalid_source_type', partial_message: params[:source_type])) and return
  end
end
