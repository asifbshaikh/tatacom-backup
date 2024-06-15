class CreateContactSupportMails < ActiveRecord::Migration[6.1]
  def change
    create_table :contact_support_mails do |t|
      t.string :subject
      t.text :description
      t.string :product_area
      t.string :priority
      t.string :cc_users, array: true, default: []
      t.string :bcc_users, array: true, default: []
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
