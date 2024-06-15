class CreateCrmCdpScheduleDetails < ActiveRecord::Migration[6.1]
  def change
    create_table :crm_cdp_schedule_details do |t|
      t.references :account
      t.jsonb :attribute_mapping
      t.string :end_type
      t.string  :frequency
      t.string :import_name
      t.datetime :next_run_at
      t.integer :occurrence
      t.datetime :run_at
      t.string  :schedule_type
      t.string :segment_name
      t.string :source_id
      t.string :source_type
      t.string :status
      t.string :table_name
      t.string :data_fetch_column
      t.string  :time_zone
      t.string :uuid

      t.timestamps
    end
  end
end
