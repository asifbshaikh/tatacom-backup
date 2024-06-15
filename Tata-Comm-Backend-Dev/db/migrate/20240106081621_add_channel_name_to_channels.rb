class AddChannelNameToChannels < ActiveRecord::Migration[6.1]
  def up
    add_column :channel_email, :channel_name, :string
    add_column :channel_whatsapp, :channel_name, :string
    add_column :tata_smscs, :channel_name, :string
  end

  def down
    remove_column :channel_email, :channel_name
    remove_column :channel_whatsapp, :channel_name
    remove_column :tata_smscs, :channel_name
  end
end
