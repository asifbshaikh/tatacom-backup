class ChangeUserTimezoneOffsetToBeStringInContacts < ActiveRecord::Migration[6.1]
  def up
    change_column :contacts, :user_timezone_offset, :string
  end

  def down
    change_column :contacts, :user_timezone_offset, :datetime
  end
end
