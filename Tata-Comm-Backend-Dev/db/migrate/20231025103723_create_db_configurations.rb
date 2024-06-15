class CreateDbConfigurations < ActiveRecord::Migration[6.1]
  def change
    create_table :db_configurations, id: :uuid do |t|
      t.string :adapter
      t.string :encoding
      t.text :host
      t.string :username
      t.string :password
      t.string :database
      t.string :port
      t.string :table_name
      t.string :timestamp_column
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
