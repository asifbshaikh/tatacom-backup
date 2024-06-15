FactoryBot.define do
  factory :import_file_segment do
    segment { nil }
    account_user { nil }
    status { 1 }
    total_users { 1 }
    added_users { 1 }
    removed_users { 1 }
    invalid_users { 1 }
    failed_file_url { "MyString" }
    s3_object_id { "MyString" }
    event_type { "MyString" }
  end
end
