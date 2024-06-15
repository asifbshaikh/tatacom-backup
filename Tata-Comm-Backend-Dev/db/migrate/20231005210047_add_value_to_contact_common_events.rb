class AddValueToContactCommonEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :contact_common_events, :value, :string
  end
end
