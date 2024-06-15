class CreateCustomAttributes < ActiveRecord::Migration[6.1]
  def change
    create_table :custom_attributes do |t|
      t.string :name
      t.string :display_name
      t.string :value
      t.string :source, array: true
      t.integer :contact_id
      t.integer :account_id

      t.timestamps
    end
  end
end
