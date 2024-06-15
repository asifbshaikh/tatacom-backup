class AddFieldsToChannelEmail < ActiveRecord::Migration[6.1]
  def change
    add_column :channel_email, :smtp_protocol, :string, default: :none
    add_column :channel_email, :smtp_auth_enable, :boolean, default: false
    add_column :channel_email, :maximum_send_rate, :integer
    add_column :channel_email, :unsubscribe_setting, :string, default: "none"
    add_column :channel_email, :bounces_and_complaint_tracking, :string
  end
end
