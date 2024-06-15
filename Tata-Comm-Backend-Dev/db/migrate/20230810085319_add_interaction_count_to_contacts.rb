class AddInteractionCountToContacts < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts, :interaction_count, :integer
  end
end
