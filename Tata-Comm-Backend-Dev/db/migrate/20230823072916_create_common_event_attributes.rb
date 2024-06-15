class CreateCommonEventAttributes < ActiveRecord::Migration[6.1]
  def change
    create_table :common_event_attributes do |t|
      t.string :name
      t.string :display_name
      t.string :category
      t.integer :common_event_id
      t.text :values, array: true, default: []
      t.string :data_types, array: true, default: []

      t.timestamps
    end
  end
end
