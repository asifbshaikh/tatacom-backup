class ChangeBirthDateTypeUsingCast < ActiveRecord::Migration[6.1]
  def change
    change_column :contacts, :birth_date, 'date USING CAST(birth_date AS date)'
  end
end
