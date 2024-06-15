FactoryBot.define do
  factory :custom_segment do
    name { "MyString" }
    description { "MyText" }
    segment_source { "MyString" }
    source_type { "MyString" }
    file_url { "MyText" }
  end
end
