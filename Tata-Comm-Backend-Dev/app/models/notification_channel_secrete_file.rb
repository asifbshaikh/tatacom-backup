# == Schema Information
#
# Table name: notification_channel_secrete_files
#
#  id                      :bigint           not null, primary key
#  device                  :string
#  file_extension          :string
#  file_name               :string
#  file_type               :string
#  secret_file_password    :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  notification_channel_id :bigint           not null
#
class NotificationChannelSecreteFile < ApplicationRecord
  belongs_to :notification_channel
  has_many_attached :channel_secret_file
  validates :channel_secret_file, presence: true
  validates :file_extension, presence: true
  validates :file_type, presence: true
  validates :device, inclusion: { in: DEVICE, message: "Invalide device"}
  validate :channel_secret_file_presence, :validate_file_extension

  def self.find_or_initialize_by_params(notification_channel_id, device)
    find_or_initialize_by(notification_channel_id: notification_channel_id, device: device)
  end

  def self.create_with_params(file_params, attributes)
    find_or_initialize_by_params(attributes[:notification_channel_id], attributes[:device]).tap do |secrete_file|
      if file_params.present?
        secrete_file.channel_secret_file.attach(file_params)
        secrete_file.file_extension = File.extname(file_params)
        secrete_file.file_name = File.basename(file_params, '.*')
      elsif secrete_file.id.present? && secrete_file.file_type != attributes[:file_type]
        secrete_file.channel_secret_file.purge
      end
      secrete_file.update(attributes)
      secrete_file.save!
    end
  end

  def channel_secret_file_presence
    errors.add(:channel_secret_file, "must be present") if new_record? && channel_secret_file.blank?
  end

  def validate_file_extension
    config_type = notification_channel.configuration['config_type']
    expected_extension = config_type_to_extension(config_type)
    errors.add(:channel_secret_file, "Invalid file") unless file_extension_matches?(expected_extension)
  end

  def config_type_to_extension(config_type)
    case config_type
    when 'private_key_file' then '.json'
    when 'apns_authentication_key' then '.p8'
    when 'apns_provider_certificate' then '.pem'
    else
      raise "Invalid file"
    end
  end

  def file_extension_matches?(expected_extension)
    self.file_extension == expected_extension
  end

end
