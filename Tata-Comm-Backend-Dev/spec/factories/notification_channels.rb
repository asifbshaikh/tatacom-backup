FactoryBot.define do
  factory :notification_channel do
    association :account
    channel_name { 'mobile_push' }
    platform { 'android' }
    configuration {
      {
        'config_type' => 'private_key_file'
      }
    }

    transient do
      file_type { 'private_key_file' }
    end

    after(:create) do |notification_channel, evaluator|
      build(:notification_channel_secrete_file, notification_channel: notification_channel)
    end

    trait :with_apns_authentication_key do
      platform { 'ios' }
      channel_name { 'mobile_push' }
      configuration {
        {
          'config_type' => 'apns_authentication_key',
          'team_id' => '1',
          'key_id' => '2',
          'bundle_id' => '3',
        }
      }
    end

    trait :with_apns_provider_certificate do
      platform { 'ios' }
      channel_name { 'mobile_push' }
      configuration {
        {
          'config_type' => 'apns_provider_certificate',
          'ipad_cert_password' => 'ipad_cert_password',
          'ipad_cert_file_name' => 'ipad_cert_file',
          'iphone_cert_password' => 'iphone_cert_password'
        }
      }
    end

    trait :for_android do
      platform { 'android' }
      channel_name { 'mobile_push' }
      configuration {
        {
          'config_type' => 'fcm_server_key'
        }
      }
    end

    trait :for_web do
      platform { 'web' }
      channel_name { 'web_push' }
      configuration {
        {
          'config_type' => 'client_id',
          'client_secret' => 'your_client_secret'
        }
      }
    end
  end
end