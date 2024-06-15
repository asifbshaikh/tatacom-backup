class RenameRegisteredDitInTemplates < ActiveRecord::Migration[6.1]
  def change
    rename_column :templates, :registered_dit, :registered_dlt
  end
end
