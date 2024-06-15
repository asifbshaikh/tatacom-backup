class AddAccoutUserIdAndTemplateIdToTemplates < ActiveRecord::Migration[6.1]
  def change
    add_column :templates, :template_id, :integer, default: nil, null: true
    add_column :templates, :account_user_id, :integer, index: true
  end
end
