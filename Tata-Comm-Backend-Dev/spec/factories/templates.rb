FactoryBot.define do
  factory :template do
    name {'Sample'}
    description {'Sample desc'}
    message {'Sample message'}
    after(:build) do |template|
      template.account ||= create(:account)      
    end
    telemarketer_id {1}
  end
end