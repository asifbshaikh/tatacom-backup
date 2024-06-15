class CreateGlobalControlGroups < ActiveRecord::Migration[6.1]
  def change
    create_table :global_control_groups do |t|
      t.integer :control_group
      t.integer :random_allocation_percentage
      t.boolean :apply_global
      t.boolean :allow_marketers
      t.boolean :active
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
