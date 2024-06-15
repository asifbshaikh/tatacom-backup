class CreateCommonEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :common_events do |t|
      t.string :name
      t.string :displayed_name
      t.text :description
      t.string :category
      t.string :source, array: true

      t.timestamps
    end
  end
end
