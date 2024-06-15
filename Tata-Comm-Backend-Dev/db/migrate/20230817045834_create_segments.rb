class CreateSegments < ActiveRecord::Migration[6.1]
  def change
    create_table :segments do |t|
      t.string :segment_type
      t.references :account, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.bigint :user_count
      t.text :user_ids, array: true, default: []
      t.bigint :reachable_users_count 
      t.float :reachability_percentage_by_channel
      t.string :source_type
      t.boolean :archieved, default: false
      t.integer :sms_camp_reachable_count
      t.integer :email_camp_reachable_count
      t.integer :push_camp_reachable_count
      t.integer :whatsapp_camp_reachable_count
      t.float :sms_camp_reachable_percentage
      t.float :email_camp_reachable_percentage
      t.float :push_camp_reachable_percentage
      t.float :whatsapp_camp_reachable_percentage
      t.datetime :last_archieved_time

      t.timestamps
    end
  end
end
