class CreateContactsReports < ActiveRecord::Migration[6.1]
  def change
    create_table :contacts_reports do |t|
      t.string :file_name
      t.text :description
      t.integer :status
      t.integer :segment_filter_id
      t.integer :user_id
      t.text :s3_file_url

      t.timestamps
    end
  end
end
