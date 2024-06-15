class CreateTataSmscs < ActiveRecord::Migration[6.1]
  def change
    create_table :tata_smscs do |t|
      t.text :auth_token
      t.string :medium
      t.integer :account_id, :null => false
      t.timestamps
    end
  end
end
