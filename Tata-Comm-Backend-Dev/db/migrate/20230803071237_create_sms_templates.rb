class CreateSmsTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :sms_templates do |t|

      t.timestamps
    end
  end
end
