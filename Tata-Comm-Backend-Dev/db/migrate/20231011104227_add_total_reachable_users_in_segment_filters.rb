class AddTotalReachableUsersInSegmentFilters < ActiveRecord::Migration[6.1]
  def change
    add_column :segment_filters, :total_reachable_users, :bigint, default: 0
  end
end
