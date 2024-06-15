# == Schema Information
#
# Table name: report_schedulers
#
#  id                     :bigint           not null, primary key
#  api_enabled            :boolean          default(FALSE)
#  campaign_ids           :text             is an Array
#  cron_expression        :string
#  end_date               :datetime
#  max_occurrence         :integer
#  occurrence_count       :integer
#  repeat_every           :integer
#  repeat_on_day_of_month :string           is an Array
#  repeat_on_day_of_week  :string           is an Array
#  report_type            :integer
#  scheduling_frequency   :integer
#  start_date             :datetime
#  status                 :integer          default("scheduled")
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  account_id             :bigint           not null
#
# Indexes
#
#  index_report_schedulers_on_account_id  (account_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#
class ReportScheduler < ApplicationRecord
  belongs_to :account
  enum status: { scheduled: 0, processing: 1, completed: 2, failed: 3 }
  enum report_type: { as_soon_as_possible: 0, at_specific_time: 1,  periodic: 2 }
  enum scheduling_frequency: { daily: 0, weekly: 1,  monthly: 2 }
end
