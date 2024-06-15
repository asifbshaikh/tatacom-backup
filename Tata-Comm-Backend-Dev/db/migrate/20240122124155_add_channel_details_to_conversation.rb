class AddChannelDetailsToConversation < ActiveRecord::Migration[6.1]
  def change
    add_column :conversations, :channel_id, :integer, index: true
    add_column :conversations, :channel_type, :string, index: true
  end
end
