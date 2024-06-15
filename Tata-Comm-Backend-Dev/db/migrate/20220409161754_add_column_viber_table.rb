class AddColumnViberTable < ActiveRecord::Migration[6.1]
  def change
    add_column :channel_viber_sms, :channel_type, :string
  end
end
