class RemoveInboxFromFcDndSetting < ActiveRecord::Migration[6.1]
  def up
    setup_channel_before_inbox_removal
    remove_column :fc_dnd_settings, :inbox_id
  end

  def down
    add_column :fc_dnd_settings, :inbox_id, :integer
    setup_inbox_after_inbox_added
  end

  def setup_channel_before_inbox_removal
    FcDndSetting.all.each do |setting|
      inbox = Inbox.unscoped.find_by(id: setting.inbox_id)
      next unless inbox.present?
      setting.update(channel_id: inbox.channel_id, channel_type: inbox.channel_type)
    end
  end

  def setup_inbox_after_inbox_added
    FcDndSetting.all.each do |setting|
      inbox = Inbox.unscoped.find_by(channel_id: setting.channel_id, channel_type: setting.channel_type)
      next unless inbox.present?
      setting.update(inbox_id: inbox.id)
    end
  end
end
