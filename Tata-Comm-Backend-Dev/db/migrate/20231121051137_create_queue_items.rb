class CreateQueueItems < ActiveRecord::Migration[6.1]
  def change
    create_table :queue_items do |t|
      t.text :contents
      t.string :topic
      t.boolean :pending, default: true

      t.timestamps
    end
  end
end
