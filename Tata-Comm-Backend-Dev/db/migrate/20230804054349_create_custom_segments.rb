class CreateCustomSegments < ActiveRecord::Migration[6.1]
  def change
    create_table :custom_segments do |t|
      t.belongs_to :account, null: false, index: false
      t.string :name
      t.text :description
      t.string :segment_source
      t.string :source_type
      t.text :file_url
      t.timestamps
    end
  end
end
