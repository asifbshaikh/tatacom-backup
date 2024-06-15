FactoryBot.define do
  factory :s3_configuration do
    bucket_name { "MyString" }
    access_key { "MyText" }
    secret_key { "MyText" }
    region { "MyString" }
    folder_path { "MyString" }
    account { nil }
  end
end
