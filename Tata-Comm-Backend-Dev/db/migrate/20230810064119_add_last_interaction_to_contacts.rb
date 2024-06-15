class AddLastInteractionToContacts < ActiveRecord::Migration[6.1]
  def change
    add_column :contacts, :last_interaction_at, :datetime
  end
end
