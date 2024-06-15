class CreateCustomAttributeConfigurations < ActiveRecord::Migration[6.1]
  def change
    create_table :custom_attribute_configurations do |t|
      t.string :name
      t.string :display_name
      t.text :description
      t.string :data_type
      t.integer :account_id

      t.timestamps
    end
  end
end
