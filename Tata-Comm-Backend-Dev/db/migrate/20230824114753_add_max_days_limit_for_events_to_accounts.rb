class AddMaxDaysLimitForEventsToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :max_days_limit_for_events, :integer
  end
end
