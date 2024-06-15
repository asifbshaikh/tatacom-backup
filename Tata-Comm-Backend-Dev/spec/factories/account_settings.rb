FactoryBot.define do
  factory :account_setting do
    app_id { SecureRandom.hex(12) }
  end
end
