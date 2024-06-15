# == Schema Information
#
# Table name: import_file_segments
#
#  id              :bigint           not null, primary key
#  added_users     :integer          default(0)
#  emails          :text             default([]), is an Array
#  event_type      :string
#  failed_file_url :string
#  invalid_users   :integer          default(0)
#  removed_users   :integer          default(0)
#  status          :integer          default("created")
#  total_users     :integer          default(0)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  account_user_id :bigint           not null
#  s3_object_id    :string
#  segment_id      :bigint           not null
#
# Indexes
#
#  index_import_file_segments_on_account_user_id  (account_user_id)
#  index_import_file_segments_on_segment_id       (segment_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_user_id => account_users.id)
#  fk_rails_...  (segment_id => segments.id)
#
class ImportFileSegment < ApplicationRecord
  validates :event_type, presence: true

  belongs_to :segment
  belongs_to :account_user

  enum status: { created: 0, processing: 1, completed: 2, failed: 3 }

  scope :order_by_desc, -> { order(created_at: :desc) }

  has_one_attached :import_file

  after_create_commit :perform_edit_operation

  private

  def perform_edit_operation
    case event_type
    when ADD_USERS
      Segmentation::AddUsersWorker.perform_async(id, Current.account.id)
    when REPLACE_USERS
      Segmentation::ReplaceUsersWorker.perform_async(id, Current.account.id)
    when REMOVE_USERS
      Segmentation::RemoveUsersWorker.perform_async(id, Current.account.id)
    end
  end
end
