class CreateTemplates < ActiveRecord::Migration[6.1]
    def change
      create_table :templates do |t|
        t.string :name, null: false
        t.integer :pe_id, null: true
        t.integer :telemarketer_id
        t.text :registered_dit
        t.integer :sender_id
        t.text :description
        t.text :message, null: false
        t.integer :account_id, null: true
        t.integer :template_type, default: 1
        t.integer :locale, default: 0, null: false
        t.timestamps
      end
    end
 end