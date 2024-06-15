# == Schema Information
#
# Table name: data_sync_imports
#
#  id                         :bigint           not null, primary key
#  custom_segment             :string
#  failed_error               :string
#  file_key                   :string
#  folder_path                :string
#  import_type                :string
#  name                       :string
#  processed_count            :integer
#  processed_rows             :integer
#  segment_name               :string
#  status                     :integer
#  synced_count               :integer
#  total_rows                 :integer
#  uuid                       :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  account_id                 :bigint
#  crm_cdp_schedule_detail_id :bigint
#  custom_segment_id          :integer
#
# Indexes
#
#  index_data_sync_imports_on_account_id                  (account_id)
#  index_data_sync_imports_on_crm_cdp_schedule_detail_id  (crm_cdp_schedule_detail_id)
#
class DataSyncImport < ApplicationRecord
  belongs_to :account
  belongs_to :crm_cdp_schedule_detail
  has_many :contacts

  enum status: { initiated: 0, processing: 1, success: 2, failed: 3 }

  scope :filter_by_type, ->(filter_type) { where(import_type: filter_type) }
  scope :order_by_desc, -> { order(created_at: :desc) }
end
