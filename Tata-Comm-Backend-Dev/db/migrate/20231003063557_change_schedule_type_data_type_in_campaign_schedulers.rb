class ChangeScheduleTypeDataTypeInCampaignSchedulers < ActiveRecord::Migration[6.1]
	def change
		# facing issues with up and down method so using this method
		change_column :campaign_schedulers, :schedule_type, :integer, using: 'schedule_type::integer'
	end
end