class AddLastInteractionAtToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :last_interaction_at, :datetime
  end
end
