class Api::V3::Accounts::CrmCdpSchedulesController < Api::V1::Accounts::BaseController
  include Api::V3::Accounts::Concerns::CrmCdpSchedules::DbSchedule

  before_action :set_source_type, except: %i[create]

  def index; end

  def show; end

  def create
    instance_eval("#{params[:source_type]}_#{action_name}", __FILE__, __LINE__)
  rescue StandardError
    render_could_not_create_error(I18n.t('errors.configurations.invalid_source_type', partial_message: params[:source_type]))
  end

  def update; end

  def preview; end

  def deactivate; end

  def imports; end

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
