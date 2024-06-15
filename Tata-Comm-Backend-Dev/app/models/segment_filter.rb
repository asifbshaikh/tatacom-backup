# == Schema Information
#
# Table name: segment_filters
#
#  id                    :bigint           not null, primary key
#  audience_type         :string
#  custom_attribute1     :string
#  custom_attribute2     :string
#  custom_attribute3     :string
#  custom_attribute4     :string
#  description           :text
#  email_reachability    :jsonb
#  exclude_users         :boolean          default(FALSE)
#  executed_at           :datetime
#  filter_hash           :jsonb
#  filter_type           :string
#  last_refreshed_at     :datetime
#  sms_reachability      :jsonb
#  sql_query             :text
#  status                :string           default("draft")
#  success_at            :datetime
#  total_reachable_users :bigint           default(0)
#  user_ids              :text             default([]), is an Array
#  users_count           :bigint
#  whatsapp_reachability :jsonb
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  account_id            :bigint
#
class SegmentFilter < ApplicationRecord

  belongs_to :account
  has_one :segment
  has_many :segment_user_ids

  scope :order_by_desc, -> { order(created_at: :desc) }

  def is_active?
    status == STATUS_ACTIVE
  end

  def reachable_users
    {
      total_users: users_count,
      reachable_users_count: total_reachable_users,
      reachability_percentage: avarage_users_percentage,
      by_channels: {
        sms_reachability: sms_reachability,
        email_reachability: email_reachability,
        whatsapp_reachability: {
          reachable_users: ZERO,
          reachability_percentage: PERCENT_RESCUED
        },
        push_reachability: {
          reachable_users: ZERO,
          reachability_percentage: PERCENT_RESCUED
        }
      },
      last_refreshed_at: last_refreshed_at.to_i
    }.as_json
  end

  def avarage_users_percentage
    (total_reachable_users.to_f / users_count.to_f * DIVIDED_WITH).round(ROUNDOFF)
  rescue StandardError
    PERCENT_RESCUED
  end

  def filter_contact_ids
    segment_user_ids.pluck(:user_ids).flatten
  end
end
