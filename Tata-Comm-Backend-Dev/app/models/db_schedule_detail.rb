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
#  status                 :integer          default("initiated")
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
class DbScheduleDetail < CrmCdpScheduleDetail
  belongs_to :account

  validates :import_type, :table_name, presence: true
  validates :import_name, uniqueness: { scope: :account_id, case_sensitive: false }, on: :create

  enum schedule_type: { as_soon_as_possible: 0, at_specific_time: 1, periodic: 2 }
  enum frequency: { daily: 0, weekly: 1, monthly: 2 }
  enum status: { initiated: 0, processing: 1, complete: 2, cancelled: 3, failed: 4 }

  scope :order_by_desc, -> { order(created_at: :desc) }
  scope :event_import, -> { where(import_type: EVENT) }
  scope :audience_import, -> { where.not(import_type: EVENT) }

  scope :scheduler_records, lambda {
                              where(schedule_type: [AT_SPECIFIC_TIME, PERIODIC], status: [INITIATED, PROCESSING]).where('next_run_at BETWEEN ? AND ?', (Time.now.utc - 1.minute), Time.now.utc)
                            }

  def asap?
    schedule_type == AS_SOON_AS_POSSIBLE
  end

  def at_specific_time?
    schedule_type == AT_SPECIFIC_TIME
  end
end
