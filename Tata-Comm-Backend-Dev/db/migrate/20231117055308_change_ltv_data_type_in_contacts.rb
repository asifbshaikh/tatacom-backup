class ChangeLtvDataTypeInContacts < ActiveRecord::Migration[6.1]
  def up
    Contact.where.not(ltv: nil).update_all(ltv: rand(10000))
    change_column :contacts, :ltv, 'integer USING CAST(ltv AS integer)'
  end

  def down
    Contact.where.not(ltv: nil).update_all(ltv: rand(10000))
    change_column :contacts, :ltv, 'string USING CAST(ltv AS string)'
  end
end
