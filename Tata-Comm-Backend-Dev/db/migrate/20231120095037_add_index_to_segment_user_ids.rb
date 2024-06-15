class AddIndexToSegmentUserIds < ActiveRecord::Migration[6.1]
  def change
    add_index :segment_user_ids, :segment_filter_id
  end
end
