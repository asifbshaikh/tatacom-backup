class Api::V3::Accounts::EmailGeneralSettingsController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :email_general_setting, only: %i[update show]

  def create
    channel_email = Channel::Email.find_by(id: params[:email_general_setting][:channel_email_id])
    if channel_email.present?
      general_setting = Current.account.email_general_settings.new(general_setting_params)
      if general_setting.save
        render json: {data: general_setting, message: I18n.t('email_general_setting.success.created')}, status: :ok
      else
        render json: general_setting.errors.full_messages, status: :unprocessable_entity
      end
    else
      render json: {message: I18n.t('email_general_setting.errors.channel_must_exist')}, status: :not_found
    end
  end

  def update
    if @email_general_setting.present?
      @email_general_setting.update(general_setting_params)
      render json: {data: @email_general_setting, message: I18n.t('email_general_setting.success.updated')}, status: :ok
    else
      render json: {message: I18n.t('email_general_setting.errors.general_setting_not_found')}, status: :not_found
    end
  end

  def show
    if @email_general_setting.present?
      render json: {data: @email_general_setting}, status: :ok
    else
      render json: {message: I18n.t('email_general_setting.errors.general_setting_not_found')}, status: :not_found
    end
  end

  private

  def email_general_setting
    @email_general_setting = Current.account.email_general_settings.find_by(channel_email_id: params[:channel_email_id] || params[:id])
  end

  def general_setting_params
    params.require(:email_general_setting).permit(:user_attribute, :channel_email_id, email_address:[])
  end
end
