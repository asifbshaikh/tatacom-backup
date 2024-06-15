class AddLastRunTimeToSegments < ActiveRecord::Migration[6.1]
  def change
    add_column :segments, :last_run_at, :datetime
    add_column :segment_filters, :last_refreshed_at, :datetime
    add_column :segment_filters, :status, :string, default: "draft"
    add_column :segment_filters, :success_at, :datetime
  end
end
