class FcDndSettingCountries < ActiveRecord::Migration[6.1]
  def change
    create_table  :fc_dnd_setting_countries do |t|
      t.references  :fc_dnd_setting,       null: false, foreign_key: true
      t.string      :country_code
      t.string      :week_days, array: true
      t.datetime    :start_time
      t.datetime    :end_time
      t.string      :dnd_timezone
      t.string      :phone_code
      t.timestamps
    end
  end
end
