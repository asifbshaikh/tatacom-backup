# == Schema Information
#
# Table name: contact_device_details
#
#  id                        :bigint           not null, primary key
#  location                  :jsonb
#  logged_in_status          :boolean
#  properties                :jsonb
#  push_opt_in_status_ios    :string
#  tcl_engage_push_opted_out :string
#  user_push_preference      :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  account_id                :integer
#  contact_id                :bigint
#  device_id                 :bigint
#  unique_user_id            :string
#
# Indexes
#
#  index_contact_device_details_on_contact_id  (contact_id)
#  index_contact_device_details_on_device_id   (device_id)
#
class ContactDeviceDetail < ApplicationRecord
    belongs_to :contact, optional: true
    belongs_to :device
    validates :device_id, presence: true
    validate :location_structure, if: -> { location.present? }

  private

  def location_structure
    unless location.is_a?(Hash) && location.key?('latitude') && location.key?('longitude')
      errors.add(:location, 'must contain latitude and longitude keys')
    end
  end
end
