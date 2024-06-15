class ChangeColumnTypeForTemplateTable < ActiveRecord::Migration[6.1]
  def change
    change_column :templates, :pe_id, :string
    change_column :templates, :telemarketer_id, :string
    change_column :templates, :template_id, :string
  end
end
