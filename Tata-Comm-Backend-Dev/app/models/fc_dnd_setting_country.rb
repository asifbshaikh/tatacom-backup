# == Schema Information
#
# Table name: fc_dnd_setting_countries
#
#  id                :bigint           not null, primary key
#  country_code      :string
#  dnd_timezone      :string
#  end_time          :datetime
#  phone_code        :string
#  start_time        :datetime
#  week_days         :string           is an Array
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  fc_dnd_setting_id :bigint           not null
#
# Indexes
#
#  index_fc_dnd_setting_countries_on_fc_dnd_setting_id  (fc_dnd_setting_id)
#
# Foreign Keys
#
#  fk_rails_...  (fc_dnd_setting_id => fc_dnd_settings.id)
#
class FcDndSettingCountry < ApplicationRecord
  belongs_to :fc_dnd_setting
end
