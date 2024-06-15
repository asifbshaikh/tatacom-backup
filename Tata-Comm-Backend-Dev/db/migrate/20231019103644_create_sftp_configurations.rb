class CreateSftpConfigurations < ActiveRecord::Migration[6.1]
  def change
    create_table :sftp_configurations, id: :uuid do |t|
      t.string :hostname
      t.string :username
      t.string :password
      t.boolean :is_encrypted, default: false
      t.text :decryption_key
      t.string :folder_path
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
