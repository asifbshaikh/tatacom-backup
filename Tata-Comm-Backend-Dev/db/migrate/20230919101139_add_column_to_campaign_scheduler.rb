class AddColumnToCampaignScheduler < ActiveRecord::Migration[6.1]
  def change
    add_column :campaign_schedulers, :campaign_time_zone, :string
    add_column :campaign_schedulers, :schedule_type, :integer
    add_column :campaign_schedulers, :scheduling_frequency, :integer
    add_column :campaign_schedulers, :send_campaign_time, :string
    add_column :campaign_schedulers, :schedule_start_date, :string
    add_column :campaign_schedulers, :schedule_end_date, :string
    add_column :campaign_schedulers, :repeat_every, :integer
    add_column :campaign_schedulers, :send_if_user_timezone_expired, :boolean, :default => false
    add_column :campaign_schedulers, :occurrences, :integer
    add_column :campaign_schedulers, :repeat_on_day_of_month, :string, array: true, default: []
    add_column :campaign_schedulers, :repeat_on_day_of_week, :string, array: true, default: []
    add_column :campaign_schedulers, :best_time_for_user, :string
    add_column :campaign_schedulers, :on_best_time, :boolean, :default => false
    add_column :campaign_schedulers, :cron_expression, :string
    add_column :campaign_schedulers, :occurrence_count, :integer, :default => 0
    add_column :campaign_schedulers, :status, :integer, :default => 0
    add_column :campaign_schedulers, :alternate_timezone,:integer
    add_column :campaign_schedulers, :is_template_customized, :boolean
    add_column :campaign_schedulers, :base_url, :string
  end
end