class CreateContactEventFilters < ActiveRecord::Migration[6.1]
  def change
    create_table :contact_event_filters do |t|
      t.references :account, foreign_key: true, type: "bigint"
      t.references :campaign, foreign_key: true, type: "bigint"
      t.datetime :executed_at
      t.string   :filter_type
      t.jsonb    :filter_hash
      t.text     :description
      t.text     :sql_query

      t.timestamps

      t.index [:account_id, :campaign_id], name: 'index_contact_event_filters_uniqueness', unique: true

      add_column :campaign_schedulers, :trigger_relation, :string
      add_column :campaign_schedulers, :trigger_attr, :string
    end
  end
end