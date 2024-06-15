class AddTokenToChannelTataSms < ActiveRecord::Migration[6.1]
  def change
    add_column :channel_tata_sms, :token, :string, default: nil, null: true
  end
end
