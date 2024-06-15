class RemoveNullFromCampaignGlobalControlGroup < ActiveRecord::Migration[6.1]
  def change
    change_column_null :campaign_global_control_groups, :global_control_group_id, true
  end
end
