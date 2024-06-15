class AddDeletedAtToChannels < ActiveRecord::Migration[6.1]
  def up
    add_column :inboxes, :deleted_at, :datetime
    add_index :inboxes, :deleted_at
    add_column :channel_email, :deleted_at, :datetime
    add_index :channel_email, :deleted_at
    add_column :tata_smscs, :deleted_at, :datetime
    add_index :tata_smscs, :deleted_at
    add_column :channel_whatsapp, :deleted_at, :datetime
    add_index :channel_whatsapp, :deleted_at
    add_deleted_at_in_channels
  end

  def down
    remove_column :inboxes, :deleted_at, :datetime
    remove_column :channel_email, :deleted_at, :datetime
    remove_column :tata_smscs, :deleted_at, :datetime
    remove_column :channel_whatsapp, :deleted_at, :datetime
  end

  def add_deleted_at_in_channels
    Inbox.where(archived: true).each do |inbox|
      inbox.name = "archived-#{inbox.id}-#{inbox.name}"
      inbox.deleted_at = Time.now
      inbox.save(validate: false)
      if inbox.channel.present?
        channel = inbox.channel
        channel.channel_name = "archived-#{channel.id}-#{channel.channel_name}"
        channel.deleted_at = Time.now
        channel.save(validate: false)
      end
    end
  end
end
