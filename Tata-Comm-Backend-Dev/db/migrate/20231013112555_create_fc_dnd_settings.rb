class CreateFcDndSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :fc_dnd_settings do |t|

      t.references  :account,       null: false, foreign_key: true, index: true
      t.references  :inbox,         null: false, foreign_key: true, index: true
      t.boolean     :fc_enabled,    default: false
      t.boolean     :dnd_enabled,   default: false
      t.integer     :max_message
      t.integer     :no_of_days
      t.integer     :refresh_timezone, default: 0

      t.boolean     :allow_in_dnd_period, default: false
      t.integer     :save_and_send_criteria, default: 0
      t.integer     :message_queue, default: 0
      t.boolean     :control_queue, default: false
      t.integer     :control_queue_gap, default: 0
      t.timestamps
    end
  end
end
