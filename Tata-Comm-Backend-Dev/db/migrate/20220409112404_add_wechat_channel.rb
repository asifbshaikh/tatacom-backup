class AddWechatChannel < ActiveRecord::Migration[6.1]
  def change
    create_table :channel_wechat_sms do |t|
      t.string :open_id, null: false
      t.string :app_id, null: false
      t.string :app_secret, null: false
      t.integer :account_id, null: false
      t.timestamps
    end
  end
end
