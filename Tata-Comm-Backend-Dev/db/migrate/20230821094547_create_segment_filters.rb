class CreateSegmentFilters < ActiveRecord::Migration[6.1]
  def change
    create_table :segment_filters do |t|
      t.bigint :account_id
      t.datetime :executed_at
      t.string :filter_type
      t.jsonb :filter_hash
      t.text :description
      t.text  :sql_query
      t.string :custom_attribute1
      t.string :custom_attribute2
      t.string :custom_attribute3
      t.string :custom_attribute4

      t.timestamps
    end
  end
end
