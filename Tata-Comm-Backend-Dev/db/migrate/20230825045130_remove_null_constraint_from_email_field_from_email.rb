class RemoveNullConstraintFromEmailFieldFromEmail < ActiveRecord::Migration[6.1]
  def up
    change_column_null :channel_email, :email, true
  end
  
  def down
    change_column_null :channel_email, :email, false
  end
end
