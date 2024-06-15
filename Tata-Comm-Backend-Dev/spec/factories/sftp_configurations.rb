FactoryBot.define do
  factory :sftp_configuration do
    hostname { Faker::Internet.domain_name }
    username { Faker::Internet.username }
    password { Faker::Internet.password }
    is_encrypted { [true, false].sample }
    decryption_key { SecureRandom.hex(500) }
    folder_path { Faker::File.dir }
    account
  end
end
