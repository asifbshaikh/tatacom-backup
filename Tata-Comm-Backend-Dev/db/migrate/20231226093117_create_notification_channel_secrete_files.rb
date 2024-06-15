class CreateNotificationChannelSecreteFiles < ActiveRecord::Migration[6.1]
  def change
    create_table :notification_channel_secrete_files do |t|
      t.belongs_to :notification_channel, null: false, index: false
      t.string  :file_name
      t.string  :file_type
      t.string  :secret_file_password
      t.string  :device
      t.string :file_extension
      t.timestamps
    end
  end
end
