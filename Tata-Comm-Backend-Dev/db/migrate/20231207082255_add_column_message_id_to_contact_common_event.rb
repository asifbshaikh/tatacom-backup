class AddColumnMessageIdToContactCommonEvent < ActiveRecord::Migration[6.1]
  def change
    add_column :contact_common_events, :message_id, :string
  end
end
