class CreateNotificationChannels < ActiveRecord::Migration[6.1]
  def change
    create_table :notification_channels do |t|
      t.belongs_to :account, null: false, index: false
      t.string :channel_name
      t.jsonb  :configuration, default: {}
      t.string :platform
      t.timestamps
    end
  end
end
