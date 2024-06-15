class CreateCampaignSchedulers < ActiveRecord::Migration[6.1]
  def change
    create_table :campaign_schedulers do |t|
      t.integer         :campaign_type, null: false
      t.datetime        :schedule_time, null: false
      t.string          :periodic_type
      t.jsonb           :trigger_criteria_first, default: []
      t.jsonb           :trigger_criteria_second, default: []
      t.references      :campaign, index: true, null: false
      t.references      :account, null: false, foreign_key: true
      t.timestamps
    end
  end
end
