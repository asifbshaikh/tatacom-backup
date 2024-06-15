class AddCampaignEventAttributes < ActiveRecord::Migration[6.1]
  def up
    add_column :contact_common_events, :campaign_id, :string
    add_column :contact_common_events, :campaign_channel, :string
    add_column :contact_common_events, :campaign_type, :string
    add_column :contact_common_events, :campaign_name, :string
    remove_column :contact_common_events, :app_version
    remove_column :contact_common_events, :sdk_version
    remove_column :contact_common_events, :platform
    remove_column :contact_common_events, :utm_source
    remove_column :contact_common_events, :utm_medium
    remove_column :contact_common_events, :utm_campaign
    remove_column :contact_common_events, :utm_id
    remove_column :contact_common_events, :utm_content
    remove_column :contact_common_events, :utm_term
    remove_column :contact_common_events, :device_density_dpi
    remove_column :contact_common_events, :device_height
    remove_column :contact_common_events, :device_manufacturer
    remove_column :contact_common_events, :device_model
    remove_column :contact_common_events, :device_screen_dimension
    remove_column :contact_common_events, :network_type
    remove_column :contact_common_events, :os_version
    remove_column :contact_common_events, :timestamp
    remove_column :contact_common_events, :first_session
    remove_column :contact_common_events, :logged_in_status
    remove_column :contact_common_events, :max_days_limit
    remove_column :contact_common_events, :value
  end

  def down
    remove_column :contact_common_events, :campaign_id
    remove_column :contact_common_events, :campaign_channel
    remove_column :contact_common_events, :campaign_type
    remove_column :contact_common_events, :campaign_name
    add_column :contact_common_events, :app_version, :string
    add_column :contact_common_events, :sdk_version, :string
    add_column :contact_common_events, :platform, :string
    add_column :contact_common_events, :utm_source, :string
    add_column :contact_common_events, :utm_medium, :string
    add_column :contact_common_events, :utm_campaign, :string
    add_column :contact_common_events, :utm_id, :string
    add_column :contact_common_events, :utm_content, :string
    add_column :contact_common_events, :utm_term, :string
    add_column :contact_common_events, :device_density_dpi, :string
    add_column :contact_common_events, :device_height, :string
    add_column :contact_common_events, :device_manufacturer, :string
    add_column :contact_common_events, :device_model, :string
    add_column :contact_common_events, :device_screen_dimension, :string
    add_column :contact_common_events, :network_type, :string
    add_column :contact_common_events, :os_version, :string
    add_column :contact_common_events, :timestamp, :string
    add_column :contact_common_events, :first_session, :string
    add_column :contact_common_events, :logged_in_status, :string
    add_column :contact_common_events, :max_days_limit, :string
    add_column :contact_common_events, :value, :string
  end
end
