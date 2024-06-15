# == Schema Information
#
# Table name: common_events
#
#  id             :bigint           not null, primary key
#  category       :string
#  data_type      :string
#  description    :text
#  displayed_name :string
#  name           :string
#  property_name  :string
#  source         :string           is an Array
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  account_id     :integer
#
# Indexes
#
#  index_common_events_on_account_id  (account_id)
#  index_common_events_on_data_type   (data_type)
#  index_common_events_on_name        (name)
#
class CommonEvent < ApplicationRecord
    self.table_name = :common_events

    CUSTOM = 'custom'.freeze

    validates :name, :displayed_name, uniqueness: { scope: :account_id, case_sensitive: false, allow_blank: true }
    validates :name, presence: true

    has_many :contact_common_events, dependent: :destroy_async
    has_many :contacts, through: :contact_common_events
    has_many :common_event_attributes, dependent: :destroy
end
