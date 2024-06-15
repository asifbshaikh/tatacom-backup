class CreateReportSchedulers < ActiveRecord::Migration[6.1]
  def change
    create_table :report_schedulers do |t|
      t.integer :report_type
      t.integer :scheduling_frequency
      t.datetime :start_date
      t.datetime :end_date
      t.integer :repeat_every
      t.integer :max_occurrence
      t.integer :occurrence_count
      t.string :repeat_on_day_of_month, array: :true, dafault:[]
      t.string :repeat_on_day_of_week, array: :true, dafault:[]
      t.integer :status, default: 0
      t.string :cron_expression
      t.text :campaign_ids, array: :true, dafault:[]
      t.boolean :api_enabled, default: false
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
