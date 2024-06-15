class CreateGoalEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :goal_events do |t|
      t.belongs_to :campaign_goal, null: false, index: false
      t.string :event_name
      t.timestamps null: false
    end
  end
end
