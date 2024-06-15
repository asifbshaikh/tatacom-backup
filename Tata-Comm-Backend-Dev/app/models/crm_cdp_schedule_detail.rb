# == Schema Information
#
# Table name: crm_cdp_schedule_details
#
#  id                     :bigint           not null, primary key
#  attribute_mapping      :jsonb
#  cron_expression        :string
#  data_fetch_column      :string
#  deactivate             :boolean          default(FALSE)
#  email_ids              :jsonb            is an Array
#  end_date               :datetime
#  end_type               :string
#  events_name            :jsonb            is an Array
#  frequency              :integer
#  import_name            :string
#  import_type            :string
#  next_run_at            :datetime
#  occurrence_count       :integer          default(0)
#  occurrences            :integer
#  repeat_every           :integer
#  repeat_on_day_of_month :jsonb            is an Array
#  repeat_on_day_of_week  :jsonb            is an Array
#  run_at                 :datetime
#  schedule_type          :integer
#  segment_name           :string
#  source_type            :string
#  start_date             :datetime
#  status                 :integer          default(0)
#  table_name             :string
#  time_zone              :string
#  type                   :string
#  uuid                   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  account_id             :bigint
#  source_id              :string
#
# Indexes
#
#  index_crm_cdp_schedule_details_on_account_id  (account_id)
#
class CrmCdpScheduleDetail < ApplicationRecord
  belongs_to :account
  has_many :data_sync_imports, dependent: :destroy_async

  validates :source_type, :source_id, :import_name, :schedule_type, presence: true
end
