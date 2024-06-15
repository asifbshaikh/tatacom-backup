module Api::V3::Accounts::Concerns::NotificationChannel
    extend ActiveSupport::Concern

  def get_notification_channel_file_attributes(params)
    return if web_and_fcm_server_key? 
    configuration = @notification_channel.configuration 
    if params["apns_provider_certificate_ipad_file"].present?
      ipad_attribute = get_attibute_hash(configuration, 'ipad')
      ipad_attribute["file_name"] = configuration['ipad_cert_file_name']
      ipad_attribute["secret_file_password"] = configuration['ipad_cert_password']
      @notification_channel.notification_channel_secrete_files.create_with_params(params['apns_provider_certificate_ipad_file'], ipad_attribute)
    end
    device = configuration['config_type']== 'private_key_file' ? 'mobile' : 'iphone'
    get_attibute_hash(configuration, device)
  end

  def get_attibute_hash(config, device)
   {
      file_name: config["file_name"],
      device: device,
      notification_channel_id: @notification_channel.id,
      secret_file_password: config['iphone_cert_password'],
      file_type: config["config_type"]
    } 
  end

  def web_and_fcm_server_key?
    @notification_channel.platform == 'web' || @notification_channel.configuration['config_type'] == 'fcm_server_key'
  end

  def get_default_icon_file_url
    @notification_channel.default_icon_file.attached? ? url_for(@notification_channel.default_icon_file) : ''
  end
end

