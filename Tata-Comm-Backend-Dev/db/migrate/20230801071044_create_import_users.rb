class CreateImportUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :import_users do |t|
      t.belongs_to :account, null: false, index: false
      t.belongs_to :account_user, null: false, index: false
      t.text :file_url, null: false
      t.integer :user_type, null: false
      t.integer :total_rows
      t.integer :new_users_count
      t.integer :updated_users_count
      t.string :custom_segment
      t.integer :custom_segment_id
      t.boolean :update_existing_user, default: true, null: false
      t.boolean :has_header
      t.string :identifier
      t.jsonb :skipped_col, default: []
      t.json :col_types, default: {}
      t.jsonb :new_custom_attributes, default: []
      t.text :failed_scenarios_file_url, null: true
      t.text :error_message, null: true
      t.integer :status, default: 0, null: false, index: false
      t.timestamps null: false
    end
  end
end
