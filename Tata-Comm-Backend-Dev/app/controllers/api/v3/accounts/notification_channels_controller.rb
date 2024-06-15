class Api::V3::Accounts::NotificationChannelsController < Api::V1::Accounts::BaseController
  include Api::V3::Accounts::Concerns::NotificationChannel
  
  before_action :check_authorization
  before_action :set_notification_channel, only: [:update, :show]

  def index
    @notification_channels =  Current.account.notification_channels.includes(:notification_channel_secrete_files)
  end

  def show
    @notification_channel_secrete_files = @notification_channel.notification_channel_secrete_files
    @default_icon_file = get_default_icon_file_url
  end

  def create
    NotificationChannel.transaction do
      @notification_channel = Current.account.notification_channels.create!(notification_channel_params.merge(default_icon_file: params['default_icon_file']))
      @default_icon_file = get_default_icon_file_url
      unless web_and_fcm_server_key? 
        attributes = get_notification_channel_file_attributes(params)
        @notification_channel.notification_channel_secrete_files.create_with_params(params['channel_secret_file'], attributes)
      end
    end
    render json: { message: 'Notification Channel successfully created' }, status: :ok
  end

  def update
    NotificationChannel.transaction do
      @notification_channel.assign_attributes(notification_channel_params.merge(default_icon_file: params['default_icon_file']))
      @notification_channel.save!
      @default_icon_file = get_default_icon_file_url
      unless web_and_fcm_server_key? 
        attributes = get_notification_channel_file_attributes(params)
        @notification_channel.notification_channel_secrete_files.create_with_params(params['channel_secret_file'], attributes)
      end
    end
    render json: { message: 'Notification Channel successfully updated' }, status: :ok
  end

  private

    def set_notification_channel
      @notification_channel = Current.account.notification_channels.find(params[:id])
      unless @notification_channel
        render json: { error: 'Notification channel configuration not found' }, status: :unprocessable_entity
      end
    end

    def notification_channel_params
      params[:notification_channel] = JSON.parse(params[:notification_channel]).with_indifferent_access if params[:notification_channel].is_a?(String)
      params.require(:notification_channel).permit(:default_icon_file, :channel_name, :platform, configuration: {})
    end
end
