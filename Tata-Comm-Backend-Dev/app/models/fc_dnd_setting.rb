# == Schema Information
#
# Table name: fc_dnd_settings
#
#  id                     :bigint           not null, primary key
#  allow_in_dnd_period    :boolean          default(FALSE)
#  channel_type           :string
#  control_queue          :boolean          default(FALSE)
#  control_queue_gap      :integer          default(0)
#  dnd_enabled            :boolean          default(FALSE)
#  fc_enabled             :boolean          default(FALSE)
#  max_message            :integer
#  message_queue          :integer          default("last_in_first_out")
#  no_of_days             :integer
#  refresh_timezone       :integer          default("app_timezone")
#  save_and_send_criteria :integer          default("send_all")
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  account_id             :bigint           not null
#  channel_id             :integer
#
# Indexes
#
#  index_fc_dnd_settings_on_account_id  (account_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#
class FcDndSetting < ApplicationRecord
  belongs_to :account
  belongs_to :channel, polymorphic: true, optional: true

  has_many :fc_dnd_setting_countries, dependent: :destroy_async

  enum refresh_timezone: {app_timezone: 0, user_timezone: 1}
  enum save_and_send_criteria: { send_all: 0, send_one_each: 1, send_across: 2}
  enum message_queue: {last_in_first_out: 0, first_in_first_out: 1}

  before_destroy :delete_fc_dnd_countries

  SIXTY_SECONDS = 60
  APP_TIMEZONE = 'app_timezone'.freeze
  USER_TIMEZONE = 'user_timezone'.freeze

  def map_countries_dnd_time
    countries_dnd_time = {}
    fc_dnd_setting_countries.each do |dnd_setting|
      countries_dnd_time[dnd_setting.country_code] = {}
      countries_dnd_time[dnd_setting.country_code][:end_time] = dnd_setting[:end_time]
      countries_dnd_time[dnd_setting.country_code][:start_time] = dnd_setting[:start_time]
      countries_dnd_time[dnd_setting.country_code][:week_days] = dnd_setting[:week_days]
      countries_dnd_time[dnd_setting.country_code][:time_zones] = ActiveSupport::TimeZone.country_zones(dnd_setting.country_code)
      countries_dnd_time[dnd_setting.country_code][:schedule_time_after_dnd] = set_schedule_time_after_dnd(dnd_setting)
    end
    countries_dnd_time.transform_keys(&:to_sym)
  end

  def delete_fc_dnd_countries
    fc_dnd_setting_countries.destroy_all
  end

  def set_schedule_time_after_dnd(country_dnd_setting)
    control_queue ? country_dnd_setting.end_time + control_queue_gap.minutes : country_dnd_setting.end_time
  end

  def user_timezone?
    refresh_timezone == USER_TIMEZONE
  end

end
