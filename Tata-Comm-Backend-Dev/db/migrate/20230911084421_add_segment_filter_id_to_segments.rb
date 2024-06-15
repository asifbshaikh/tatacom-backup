class AddSegmentFilterIdToSegments < ActiveRecord::Migration[6.1]
  def change
    add_column :segments, :segment_filter_id, :bigint
    add_index :segments, :segment_filter_id
  end
end
