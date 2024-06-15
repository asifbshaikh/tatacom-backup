class Api::V3::Accounts::FcDndSettingsController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :find_fc_dnd_setting, only: [:show, :update]
  before_action :load_countries

  def index
    @fc_dnd_settings = Current.account.fc_dnd_settings
  end

  def show
  end

  def all_countries

  end

  def update
    if @setting.update(fc_dnd_params)
      if dnd_countries_params[:fc_dnd_setting_countries].present?
        @setting.fc_dnd_setting_countries.destroy_all
        dnd_countries_params[:fc_dnd_setting_countries].each do |country|
          record = @setting.fc_dnd_setting_countries.create(
            country_code: country[:country_code],
            week_days: country[:week_days],
            start_time: country[:start_time],
            end_time: country[:end_time],
            dnd_timezone: country[:dnd_timezone]
          )
        end
      end
    else
      render json: { errors: @dnd_setting.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def fc_dnd_params
    params.require(:fc_dnd_setting).permit(
      :fc_enabled, :allow_in_dnd_period, :max_message, :no_of_days, :refresh_timezone,
      :dnd_enabled, :save_and_send_criteria, :message_queue, :control_queue, :control_queue_gap
    )
  end

  def dnd_countries_params
    params.require(:fc_dnd_setting).permit(fc_dnd_setting_countries: [:country_code, :start_time, :end_time, :dnd_timezone, week_days: []])
  end

  def find_fc_dnd_setting
    channel_id = params[:id]
    @setting = Current.account.fc_dnd_settings.find_or_create_by(channel_id: channel_id,  channel_type: CHANNEL_MAPPING[params[:channel_type]].to_s)
    @setting.fc_dnd_setting_countries
  end

  def load_countries
    @countries = ISO3166::Country.pluck(:iso_short_name, :country_code, :alpha2)
    @countries
  end
end