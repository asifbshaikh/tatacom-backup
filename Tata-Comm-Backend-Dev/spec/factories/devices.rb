FactoryBot.define do
  factory :device do
    advertising_identifier {Faker::Alphanumeric.alphanumeric(number: 16)}
    api_level { Faker::Number.between(from:1, to:30)}
    carrier { Faker::PhoneNumber.cell_phone_with_country_code}
    device_density { Faker::Lorem.word }
    device_height { Faker::Number.between(from:500, to: 2000).to_s}
    device_model { Faker::Device.model_name}
    model {Faker::Device.model_name }
    model_version {Faker::Device.platform}
    name {Faker::Device.platform}
    network_type {['wifi'].sample}
    platform {Faker::Device.platform}
    vender_identifier {Faker::Alphanumeric.alphanumeric(number: 16)}
    android_id {Faker::Alphanumeric.alphanumeric(number: 16)}
  end
end