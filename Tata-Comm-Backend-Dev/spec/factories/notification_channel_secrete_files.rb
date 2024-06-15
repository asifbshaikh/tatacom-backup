FactoryBot.define do
  factory :notification_channel_secrete_file do
    association :notification_channel
    file_type { 'private_key_file' }
    device { 'andoid' }
    file_extension { '.json' }
    file_name { 'private_key' }

    channel_secret_file do
      Rack::Test::UploadedFile.new(
        Rails.root.join('spec', 'fixtures', 'files', "#{file_name}#{file_extension}"),
        'application/p'
      )
    end

    trait :apns_authentication_key do
      file_extension { '.p8' }
      file_name { 'apns_key' }
    end

    trait :apns_provider_certificate do
      file_extension { '.pem' }
      file_name { 'apns_certificate' }
    end

    trait :for_android do
      device { 'android' }
    end

    trait :for_web do
      device { 'web' }
    end
  end
end