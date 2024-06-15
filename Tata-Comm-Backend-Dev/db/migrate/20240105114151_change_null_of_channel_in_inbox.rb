class ChangeNullOfChannelInInbox < ActiveRecord::Migration[6.1]
  def change
    change_column :inboxes, :channel_id, :integer, null: true
  end
end
