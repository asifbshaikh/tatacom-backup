class CreateS3Configurations < ActiveRecord::Migration[6.1]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')
    create_table :s3_configurations, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :bucket_name
      t.text :access_key
      t.text :secret_key
      t.string :region
      t.string :folder_path
      t.references :account, null: false, foreign_key: true, on_delete: :cascade

      t.timestamps
    end
  end
end
