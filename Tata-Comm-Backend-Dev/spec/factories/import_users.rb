FactoryBot.define do
  factory :import_user do
    account
    account_user
    import_file { Rack::Test::UploadedFile.new(Rails.root.join('spec/assets/contacts.csv'), 'text/csv') }
    file_url { "spec/assets/contacts.csv" }
    file_name { "contacts.csv" }
    user_type { :registered }
    status { :created }
    col_types {JSON.parse({"0"=>{"customer_id"=>"string"}, "1"=>{"first_name"=>"string"}, "2"=>{"last_name"=>"string"}, "3"=>{"email"=>"string"}, "4"=>{"phone_number"=>"string"}}.to_json)}
    new_custom_attributes { ['ip_address'] }
    sequence(:identifier) { |n| "identifier_#{n}" }
    sequence(:custom_segment) { |n| "segment_#{n}" }
    has_header { true }
    skipped_col { [] }
    update_existing_user { true }
    custom_segment_id { nil }
    total_rows { 100 }
    new_users_count { 10 }
    updated_users_count { 10 }

    after(:build) do |import_user|
      import_user.import_file.attach(
        io: File.open(Rails.root.join('spec/assets/contacts.csv')),
        filename: 'import_file',
        content_type: 'text/csv'
      )
    end
  end
end

