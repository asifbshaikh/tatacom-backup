class AddColumnDesignToEmailTemplates < ActiveRecord::Migration[6.1]
  def change
    add_column :email_templates, :design, :jsonb
  end
end
