class RemoveColumnAuthTokenFromChannelEmail < ActiveRecord::Migration[6.1]
  def change
    remove_column :channel_email, :auth_token, :text
  end
end