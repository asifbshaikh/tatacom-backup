FactoryBot.define do
    factory :frequency_capping_setting do
      frequency_capping_flag {true}
      number_of_emails {2}
      number_of_days {3}
      refresh_the_fc_daily_at {"App Timezone"}
      fc_timezone {"Asia/Kolkata"}
      channel_type {"tata_smsc"}
      sender_id {1}
          after(:build) do |frequency_capping_setting|
        frequency_capping_setting.account ||= create(:account)
      end
    end
end