class CreateCampaignDeliveries < ActiveRecord::Migration[6.1]
	def change
		create_table :campaign_deliveries do |t|
			t.string :uuid
			t.string :statusCode
			t.string :status
			t.datetime :submitDate
			t.datetime :doneDate
			t.string :err

			t.references :account, null: false, foreign_key: true
					t.references :campaign, null: false, foreign_key: true
			t.references :contact, null: false, foreign_key: true
			
			t.index :status
			t.index :uuid
			t.index :err

			t.timestamps
		end
	end
end