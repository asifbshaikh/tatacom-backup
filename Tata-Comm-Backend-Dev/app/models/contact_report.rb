# == Schema Information
#
# Table name: contacts_reports
#
#  id                :bigint           not null, primary key
#  description       :text
#  file_name         :string
#  header            :jsonb
#  object_key        :string
#  s3_file_url       :text
#  status            :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  segment_filter_id :integer
#  segment_id        :bigint
#  user_id           :integer
#
class ContactReport < ApplicationRecord

  self.table_name = :contacts_reports

  QUERY_USERS = 'Query Users'

  belongs_to :user
  belongs_to :segment_filter, optional: true

  scope :order_by_desc, -> { order(created_at: :desc) }
  scope :search_query, ->(search_term) { where("file_name LIKE ?", "%#{search_term}%") }

  enum status: { queued: 0, in_process: 1, finished: 2, failed: 3 }
end
