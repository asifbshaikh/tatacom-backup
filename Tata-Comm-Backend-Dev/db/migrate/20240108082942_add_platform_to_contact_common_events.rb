class AddPlatformToContactCommonEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :contact_common_events, :app_version, :string
    add_column :contact_common_events, :sdk_version, :string
    add_column :contact_common_events, :platform, :string
  end
end