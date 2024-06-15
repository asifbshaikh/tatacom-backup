class CreateWhatsappTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :whatsapp_templates do |t|

      t.timestamps
    end
  end
end
