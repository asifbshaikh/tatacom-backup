# == Schema Information
#
# Table name: devices
#
#  id                     :bigint           not null, primary key
#  advertising_identifier :string
#  api_level              :integer
#  carrier                :string
#  device_density         :string
#  device_height          :string
#  device_model           :string
#  device_model_name      :string
#  device_timezone        :string
#  device_token           :string
#  device_width           :string
#  gaid                   :string
#  gaid_tracking_status   :string
#  manufacturer           :string
#  model                  :string
#  model_version          :string
#  name                   :string
#  network_type           :string
#  os_version             :string
#  platform               :string
#  product_name           :string
#  vender_identifier      :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  account_id             :bigint           not null
#  android_id             :string
#  contact_id             :bigint
#  unique_user_id         :string
#
# Indexes
#
#  index_devices_on_account_id  (account_id)
#  index_devices_on_contact_id  (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (contact_id => contacts.id)
#
class Device < ApplicationRecord
  belongs_to :contact, optional: true
  belongs_to :account
  has_many :campaign_devices, dependent: :destroy_async
  has_many :campaigns, through: :campaign_devices
  has_many :contact_device_details
end
