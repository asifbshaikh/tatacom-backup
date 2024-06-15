class AddUserIdsAndUsersCountToSegmentFilters < ActiveRecord::Migration[6.1]
  TEXT_BYTES = 1_073_741_823

  def change
    add_column :segment_filters, :user_ids, :text, array: true, limit: TEXT_BYTES, default: []
    add_column :segment_filters, :users_count, :bigint
  end
end
