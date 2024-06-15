# == Schema Information
#
# Table name: campaign_schedulers
#
#  id                            :bigint           not null, primary key
#  alternate_timezone            :integer
#  base_url                      :string
#  best_time_for_user            :string
#  campaign_time_zone            :string
#  campaign_type                 :string           not null
#  cron_expression               :string
#  end_date                      :datetime
#  occurrence_count              :integer          default(0)
#  occurrences                   :integer
#  on_best_time                  :boolean          default(FALSE)
#  periodic_type                 :string
#  repeat_every                  :integer
#  repeat_on_day_of_month        :string           default([]), is an Array
#  repeat_on_day_of_week         :string           default([]), is an Array
#  schedule_type                 :integer
#  scheduling_frequency          :integer
#  send_campaign_time            :string
#  send_if_user_timezone_expired :boolean          default(FALSE)
#  start_date                    :datetime         not null
#  status                        :integer          default("initiated")
#  time_multiplier               :integer
#  time_value                    :integer
#  trigger_attr                  :string
#  trigger_criteria_first        :jsonb
#  trigger_criteria_second       :jsonb
#  trigger_relation              :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  account_id                    :bigint           not null
#  campaign_id                   :bigint           not null
#
# Indexes
#
#  index_campaign_schedulers_on_account_id   (account_id)
#  index_campaign_schedulers_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#
class CampaignScheduler < ApplicationRecord
  extend Api::V3::Accounts::Concerns::ChannelEmailSchedulerService
  include Sidekiq::Worker
  belongs_to :account
  belongs_to :sender, class_name: 'User', optional: true
  # belongs_to :account_user
  belongs_to :campaign

  after_create :fix_timezone

  include AASM
  aasm column: "status" do
    state :initiated, initial: true
    state :processing
    state :success
    state :failed
    state :cancelled

    event :mark_process, after: :process_campaign  do
      transitions from: [:initiated, :paused], to: :processing
    end

    event :mark_success, after: :complete_campaign do
      transitions from: :processing, to: :success
    end

    event :mark_failed do
      transitions from: :processing, to: :failed
    end

    event :cancel do
      transitions from: :initiated, to: :cancelled
    end

    after_all_transitions :log_status_change
  end

  validates :schedule_type, presence: true, on: :create

  enum schedule_type: { as_soon_as_possible: 0, at_specific_time: 1,  periodic: 2, event_trigger: 3 }
  enum scheduling_frequency: { daily: 0, weekly: 1,  monthly: 2 }

  enum alternate_timezone: { at_start_time: 0, at_app_best_time: 1,  do_not_send: 2 }
  enum status: { initiated: 0, processing: 1 , success: 2, failed: 3, cancelled: 4, paused: 5, scheduled: 6  }
  scope :periodic_scheduler_records, -> {
    where(schedule_type: PERIODIC, status: [INITIATED, PROCESSING])
    .where("scheduling_frequency = #{ZERO} OR \'#{Time.now.utc.strftime('%d').to_i}\' = ANY (repeat_on_day_of_month) OR \'#{Time.now.utc.strftime('%A')}\' = ANY (repeat_on_day_of_week)")
    .where("start_date < ?", (Time.now + 1.minute))
    .where("CAST(start_date AS TIME) BETWEEN ? AND ?", (Time.now.utc - 1.minute), Time.now.utc)
  }

  scope :at_specific_time_scheduler_records, -> { where(schedule_type: [EVENT_TRIGGER, AT_SPECIFIC_TIME], status: [INITIATED, PROCESSING]).where("start_date BETWEEN ? AND ?", (Time.now.utc - 1.minute), Time.now.utc) }

  TRIGGER_CRITERIA_FIRST = ["App/Site Opened", "Viewed Web Page", "App Exit", "User Logout", "Push ID Register Android", "User Merged",
                            "App Update"].freeze
  TRIGGER_CRITERIA_SECOND = ["Has Not Executed", "Has Executed"].freeze

  FIXED_TIME = 'at_fixed_time'.freeze
  IN_USER_TIME_ZONE = 'send_in_user_time_zone'.freeze
  USER_BEST_TIME_ZONE = 'best_time_for_user'.freeze
  AT_SPECIFIC_TIME = 'at_specific_time'.freeze
  PERIODIC = 'periodic'.freeze
  AS_SOON_AS_POSSIBLE = 'as_soon_as_possible'.freeze
  INITIATED  = "initiated".freeze
  PROCESSING = "processing".freeze
  SUCCESS    = "success".freeze
  FAILED     = "failed".freeze
  CANCELLED = 'cancelled'.freeze
	PAUSE = 'paused'.freeze

  def whatsapp_campaign?
    campaign_type == WHATSAPP_CAMPAIGN
  end

  def email_campaign?
    campaign_type == EMAIL_CAMPAIGN
  end

  def sms_campaign?
    campaign_type == SMS_CAMPAIGN
  end

  def process_campaign
    campaign.process!
  end

  def complete_campaign
    campaign.complete!
  end

  def fail_campaign
    campaign.mark_fail!
  end

  def log_status_change
    Rails.logger.info("In Scheduler: Changing Scheduler status from #{aasm.from_state} to #{aasm.to_state}")
  end

  def periodic?
    schedule_type == PERIODIC
  end

  def event_triggered?
    schedule_type == EVENT_TRIGGER
  end

  # Check if not PERIODIC AND not EXPIRED
  def completed?
    periodic? ? (end_date&.present? && Time.at(end_date.to_i).utc < Time.now.utc) : true
  end

  def fix_timezone
    self.campaign_time_zone = self.campaign_time_zone.split(' ')[1] if self.campaign_time_zone.present?
    self.save!
  end

end
