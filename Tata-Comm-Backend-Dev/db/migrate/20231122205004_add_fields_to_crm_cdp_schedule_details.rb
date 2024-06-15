class AddFieldsToCrmCdpScheduleDetails < ActiveRecord::Migration[6.1]
  def change
    add_column :crm_cdp_schedule_details, :deactivate, :boolean, default: false
    add_column :crm_cdp_schedule_details, :events_name, :jsonb, array: true, default: []
    add_column :crm_cdp_schedule_details, :repeat_on_day_of_month, :jsonb, array: true, default: []
    add_column :crm_cdp_schedule_details, :repeat_on_day_of_week, :jsonb, array: true, default: []
    add_column :crm_cdp_schedule_details, :cron_expression, :string
    add_column :crm_cdp_schedule_details, :occurrence_count, :integer
    rename_column :crm_cdp_schedule_details, :occurrence, :occurrences
    add_column :crm_cdp_schedule_details, :repeat_every, :integer
    add_column :crm_cdp_schedule_details, :start_date, :datetime
    remove_column :crm_cdp_schedule_details, :repetition, :string
    remove_column :crm_cdp_schedule_details, :status, :string
    remove_column :crm_cdp_schedule_details, :frequency, :string
    remove_column :crm_cdp_schedule_details, :schedule_type, :string
    add_column :crm_cdp_schedule_details, :status, :integer, default: 0
    add_column :crm_cdp_schedule_details, :frequency, :integer
    add_column :crm_cdp_schedule_details, :schedule_type, :integer
  end
end