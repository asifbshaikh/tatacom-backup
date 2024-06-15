# == Schema Information
#
# Table name: campaign_deliveries
#
#  id                      :bigint           not null, primary key
#  bounced_at              :datetime
#  clicked                 :boolean          default(FALSE)
#  clicked_at              :datetime
#  delivered_at            :datetime
#  error_code              :string
#  expired_at              :datetime
#  opened_at               :datetime
#  sent_at                 :datetime
#  status                  :string
#  statusCode              :string
#  tiny_url                :text             default("")
#  uuid                    :string
#  webhook_response_params :text             default([]), is an Array
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  account_id              :bigint           not null
#  campaign_id             :bigint           not null
#  contact_id              :bigint           not null
#  message_id              :string
#
# Indexes
#
#  index_campaign_deliveries_on_account_id   (account_id)
#  index_campaign_deliveries_on_campaign_id  (campaign_id)
#  index_campaign_deliveries_on_contact_id   (contact_id)
#  index_campaign_deliveries_on_error_code   (error_code)
#  index_campaign_deliveries_on_uuid         (uuid)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (contact_id => contacts.id)
#

class CampaignDelivery < ApplicationRecord
  belongs_to :campaign
  belongs_to :contact
  belongs_to :account

  include AASM
  aasm column: 'status' do
    state :sent, initial: true
    state :delivered
    state :opened
    state :clicked
    state :bounced
    state :accepted
    state :expired
    state :rejected
    state :system_failure
    state :undelivered
    state :soft_bounced
    state :hard_bounced
    state :blocked
    state :deferred
    state :loaded_by_proxy
    state :unknown
  end

  scope :delivered_count, -> { where("delivered_at IS NOT NULL OR opened_at IS NOT NULL").count }
  scope :opened_count, -> { where.not(opened_at: nil).count }
  scope :bounced_count, -> { where.not(bounced_at: nil).count }

  STATUS_TIMESTAMPS = { SENT => :sent_at, OPENED => :opened_at, EXPIRED => :expired_at, DELIVERED => :delivered_at,
                        CLICKED => :clicked_at, BOUNCED => :bounced_at }.freeze

  # all the error code mapping should be modified, once actual mapping is provided. remainig error_code  514 and 525 are not yet covered
  UNDELIVERED_ERRORS = { 1 => FAILED_TO_SEND, 3 => GENERIC_API_CALL_ERROR, 21 => TCL, 333 => INVALID_MOBILE_NUMBER, 334 => INVALID_EMAIL_ADDRESS,
                         501 => OTHER, 502 => BLOCKED, 505 => FAILED_TO_DELIVER, 506 => SOFT_BOUNCED, 507 => DEFERRED, 508 => SYSTEM_FAILURE, 509 => LOADED_BY_PROXY, 526 => BLOCKED_FOR_USER,
                         601 => FC_REJECTED, 602 => DND_REJECTED, 1007 => PENDING_DELIVERY_CONFIRMATION, 131_008 => SYSTEM_FAILURE,
                         132_001 => SYSTEM_FAILURE, 132_000 => SYSTEM_FAILURE, 132_012 => SYSTEM_FAILURE, 131_026 => FAILED_TO_DELIVER, 132_005 => SYSTEM_FAILURE }.freeze

end
