class CreateSegmentUserIds < ActiveRecord::Migration[6.1]
  def change
    create_table :segment_user_ids do |t|
      t.bigint :segment_filter_id, null: false
      t.text :user_ids, array: true, default: []

      t.timestamps
    end
  end
end
