FactoryBot.define do
  factory :db_schedule_detail do
    frequency { '' }
    import_name { Faker::Lorem.words.join(' ') }
    next_run_at { '2023-11-16T09:12:26.511Z' }
    occurrences { 1 }
    start_date { '2023-11-16T09:12:25.511Z' }
    schedule_type { 'as_soon_as_possible' }
    source_type { 'database' }
    table_name { 'db_contacts' }
    time_zone { 'Asia/Calcutta' }
    email_ids { ['abc@yopmail.com', 'test@yopmail.com'] }
    import_type { 'registered_audience' }
    account
  end
end
