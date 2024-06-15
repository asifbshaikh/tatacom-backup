class Api::V3::Accounts::EmailConfigsController < Api::V1::Accounts::BaseController
  before_action :find_email_configuration
  def index
      @emails = Current.account.email_channels.page(page).per(per_page)
      @total_count = Current.account.email_channels.count
  end

  def show
    if @email_config.present?
        render 'api/v3/accounts/email_configs/show.json', locals: { resource: @email_config}
    else 
        render json: { message: 'Email connector not found' }, status: :not_found
    end
  end
  

  def create
    if params[:email_config].present?
      @email_config = Current.account.email_channels.new(smtp_address: email_config_params[:host_name], smtp_port: email_config_params[:port], smtp_protocol: email_config_params[:protocol], smtp_auth_enable: email_config_params[:smtp_auth_enable], smtp_email: email_config_params[:smtp_user_name], smtp_password: email_config_params[:smtp_password], maximum_send_rate: email_config_params[:maximum_send_rate], unsubscribe_setting: email_config_params[:unsubscribe_setting], bounces_and_complaint_tracking: email_config_params[:bounces_and_complaint_tracking])
      if @email_config.save!
        render 'api/v3/accounts/email_configs/create.json', locals: { resource: @email_config}
      else
        render json: {status: unprocessable_entity, data: {}, error_message: I18n.t('email_config.error_message', action: "saved.")}
      end
    else
      render json: {status: false, error_message: I18n.t('email_config.blank_params', action: "save") }
    end
  end

  def update
    if @email_config.present?
      @email_config.assign_attributes(connector_update_params)
      if @email_config.save!
        render 'api/v3/accounts/email_configs/update.json', locals: { resource: @email_config}
      else
        render json: {status: false, error_message: @email_config.errors.full_messages }
      end
    else
      render json: {status: false, error_message: I18n.t('email_config.error_message', action: "not found.") }
    end
  end

  def destroy
    if @email_config.present?
      if @email_config.destroy
        render json: {status: true, success_message: I18n.t('email_config.success_message', partial_message: "deleted successfully.") }
      else
        render json: {status: false, error_message: @email_config.errors.full_messages }
      end
    else
      render json: {status: false, error_message: I18n.t('email_config.error_message', action: "not found.") }
    end
  end

  private 

  def find_email_configuration
    @email_config = Current.account.email_channels.find_by(id: params[:id])
    if !Current.user.administrator?
      render json: { error: "Unauthorize to view email connector configuration.", status: false }
      return
    end
  end

  def connector_update_params
    email_config_params.except(:host_name, :port, :protocol, :smtp_user_name).merge({ smtp_address: email_config_params[:host_name], smtp_port: email_config_params[:port], smtp_protocol: email_config_params[:protocol], smtp_email: email_config_params[:smtp_user_name] })
  end

  def email_config_params
    params.permit(:host_name, :port, :protocol, :smtp_auth_enable, :smtp_user_name, :smtp_password, :maximum_send_rate, :unsubscribe_setting, :bounces_and_complaint_tracking)
  end
end