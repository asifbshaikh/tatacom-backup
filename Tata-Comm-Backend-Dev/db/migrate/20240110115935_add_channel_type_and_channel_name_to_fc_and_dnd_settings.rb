class AddChannelTypeAndChannelNameToFcAndDndSettings < ActiveRecord::Migration[6.1]
  def up
    add_column :fc_dnd_settings, :channel_id, :integer
    add_column :fc_dnd_settings, :channel_type, :string
  end

  def down
    remove_column :fc_dnd_settings, :channel_id
    remove_column :fc_dnd_settings, :channel_type
  end
end
