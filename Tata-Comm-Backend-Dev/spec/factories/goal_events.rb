FactoryBot.define do
  factory :goal_event do
    association :campaign_goal
    event_name { 'MyString' }
  end
end
