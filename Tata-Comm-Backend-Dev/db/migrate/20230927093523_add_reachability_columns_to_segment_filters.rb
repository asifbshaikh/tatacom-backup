class AddReachabilityColumnsToSegmentFilters < ActiveRecord::Migration[6.1]
  def change
    add_column :segment_filters, :sms_reachability, :jsonb, default: {}
    add_column :segment_filters, :email_reachability, :jsonb, default: {}
    add_column :segment_filters, :whatsapp_reachability, :jsonb, default: {}
  end
end
