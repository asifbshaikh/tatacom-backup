# == Schema Information
#
# Table name: contact_event_filters
#
#  id          :bigint           not null, primary key
#  description :text
#  executed_at :datetime
#  filter_hash :jsonb
#  filter_type :string
#  sql_query   :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  account_id  :bigint
#  campaign_id :bigint
#
# Indexes
#
#  index_contact_event_filters_on_account_id   (account_id)
#  index_contact_event_filters_on_campaign_id  (campaign_id)
#  index_contact_event_filters_uniqueness      (account_id,campaign_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (campaign_id => campaigns.id)
#
class ContactEventFilter < ApplicationRecord

  include Api::V3::Accounts::Concerns::SegmentFilterQuery
  include Api::V3::Accounts::Concerns::Segmentation::ConditionalOperator
  include Api::V3::Accounts::Concerns::Segmentation::GenerateDescription

  belongs_to :account
  belongs_to :campaign

  validates :filter_hash, :description, :sql_query, presence: true

  def self.get_contact_ids(raw_sql)
    ActiveRecord::Base.connection.execute(raw_sql).pluck('id')
  end

end
