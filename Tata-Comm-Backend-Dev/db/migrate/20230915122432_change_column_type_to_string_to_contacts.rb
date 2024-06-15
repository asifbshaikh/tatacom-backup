class ChangeColumnTypeToStringToContacts < ActiveRecord::Migration[6.1]
  def up
    change_column :contacts, :ltv, 'VARCHAR USING CAST(ltv AS VARCHAR)'
  end

  def down
    change_column :contacts, :ltv, 'decimal USING CAST(ltv AS decimal)'
  end
end
