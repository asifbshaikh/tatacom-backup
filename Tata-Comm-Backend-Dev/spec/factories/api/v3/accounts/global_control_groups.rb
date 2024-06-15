FactoryBot.define do
  factory :global_control_group do
    control_group { 0 }
    random_allocation_percentage { 1 }
    apply_global { false }
    allow_marketers { false }
    active { false }
    trait :with_user_list_file do
      user_list_file { Rack::Test::UploadedFile.new('spec/assets/global_control_file.csv', 'text/csv') }
    end
    account
  end
end
