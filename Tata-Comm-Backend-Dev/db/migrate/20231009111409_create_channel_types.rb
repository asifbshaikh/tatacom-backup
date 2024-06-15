class CreateChannelTypes < ActiveRecord::Migration[6.1]
  def up
    create_table :channel_types do |t|
      t.string :name
      t.string :class_name
      t.string :provider

      t.timestamps
    end

  end

  def down
    drop_table :channel_types 
  end
end
