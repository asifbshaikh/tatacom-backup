class RevertStatusFieldToString < ActiveRecord::Migration[6.1]
  def up
    change_column :campaign_deliveries, :status, :string

    execute "UPDATE campaign_deliveries SET status = 'sent' where id IN (select id from campaign_deliveries where status is NULL LIMIT 100)"
    execute "UPDATE campaign_deliveries SET status = 'expired' where id IN (select id from campaign_deliveries where status is NULL LIMIT 100)"
    execute "UPDATE campaign_deliveries SET status = 'bounced' where id IN (select id from campaign_deliveries where status is NULL LIMIT 100)"
    execute "UPDATE campaign_deliveries SET status = 'clicked' where id IN (select id from campaign_deliveries where status is NULL LIMIT 100)"
    execute "UPDATE campaign_deliveries SET status = 'opened' where id IN (select id from campaign_deliveries where status is NULL LIMIT 100)"
    execute "UPDATE campaign_deliveries SET status = 'delivered' where id IN (select id from campaign_deliveries where status is NULL)"
  end

  def down

    execute "UPDATE campaign_deliveries SET status = 0 where status = 'sent'"
    execute "UPDATE campaign_deliveries SET status = 5 where status = 'expired'"
    execute "UPDATE campaign_deliveries SET status = 4 where status = 'bounced'"
    execute "UPDATE campaign_deliveries SET status = 3 where status = 'clicked'"
    execute "UPDATE campaign_deliveries SET status = 2 where status = 'opened'"
    execute "UPDATE campaign_deliveries SET status = 1 where status = 'delivered'"

    change_column :campaign_deliveries, :status, :integer
  end
end
