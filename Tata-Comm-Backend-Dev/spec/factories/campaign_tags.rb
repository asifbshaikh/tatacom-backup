FactoryBot.define do
  factory :campaign_tag do
    # name { 'Promotional' }
		# description { 'Test' }
		association :campaign
		association :group_tag
  end
end