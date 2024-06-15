class AlterCampaignSchedulerColumns < ActiveRecord::Migration[6.1]
  def change

    execute 'UPDATE campaign_schedulers set schedule_start_date = schedule_time;'
    execute 'UPDATE campaign_schedulers set schedule_end_date = NULL;'

    change_column :campaign_schedulers, :schedule_start_date, 'timestamp with time zone USING schedule_start_date::timestamp with time zone', null: false
    change_column :campaign_schedulers, :schedule_end_date, 'timestamp with time zone USING schedule_end_date::timestamp with time zone'
    rename_column :campaign_schedulers, :schedule_start_date, :start_date
    rename_column :campaign_schedulers, :schedule_end_date, :end_date
    remove_column :campaign_schedulers, :schedule_time
  end
end
