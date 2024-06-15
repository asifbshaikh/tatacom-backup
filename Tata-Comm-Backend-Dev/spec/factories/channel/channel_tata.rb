FactoryBot.define do
  factory :channel_tata, class: 'Channel::Tata' do
    sequence(:phone_number) { |n| "+123456789#{n}1" }
    account
    ss_key { SecureRandom.hex(14) }
    app_id { SecureRandom.hex(8) }
    token { SecureRandom.hex(12) }
    medium { 'sms' }

    after(:create) do |channel_tata|
      create(:inbox, channel: channel_tata, account: channel_tata.account)
    end
  end
end
