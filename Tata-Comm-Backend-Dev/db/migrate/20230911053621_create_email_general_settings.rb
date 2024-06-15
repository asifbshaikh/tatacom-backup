class CreateEmailGeneralSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :email_general_settings do |t|
      t.references :channel_email, null: false
      t.string :user_attribute
      t.string :email_address, array: true, default: []

      t.timestamps
    end
  end
end
