FactoryBot.define do
  factory :data_sync_import do
    name { Faker::Lorem.words.join(' ') }
    status { %w[initiated].sample }
    import_type { 'db' }
    synced_count { (0..9).to_a.sample }
    processed_count { (0..9).to_a.sample }
    account
    crm_cdp_schedule_detail
  end
end
