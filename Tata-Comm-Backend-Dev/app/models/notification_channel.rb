# == Schema Information
#
# Table name: notification_channels
#
#  id            :bigint           not null, primary key
#  channel_name  :string
#  configuration :jsonb
#  platform      :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  account_id    :bigint           not null
#
class NotificationChannel < ApplicationRecord
    belongs_to :account
    has_many :notification_channel_secrete_files
    validates :channel_name, inclusion: { in: NOTIFICATION_CHANNEL, message: "Must be one of #{NOTIFICATION_CHANNEL}"}
    validates :platform,  uniqueness: { scope: [:account_id] }, inclusion: { in: PLATFORMS, message: "Must be one of #{PLATFORMS}"}
    validate :validate_configuration
    has_one_attached :default_icon_file
    validate :default_icon_file_format, if: -> { default_icon_file.attached? }

  private
  
  def validate_configuration
    if platform != 'web' && CONFIG_TYPE_RULES[platform]&.key?(configuration['config_type']) 
      validate_required_keys(CONFIG_TYPE_RULES.dig(platform, configuration['config_type']))
    elsif CONFIG_TYPE_RULES[platform].present? && platform == 'web'
      validate_required_keys(CONFIG_TYPE_RULES[platform])
    else
      errors.add(:configuration, "Invalid type")
    end
  end

  def validate_required_keys(required_keys)
    return unless required_keys
    missing_keys = required_keys - configuration.keys
    errors.add(:configuration, "validation failed. Platform #{platform} must have #{missing_keys.join(', ')}") unless missing_keys.empty?
  end

  def default_icon_file_format
    unless default_icon_file.content_type == 'image/png'
      errors.add(:default_icon_file, 'must be a PNG file')
    end
  end
end
