FactoryBot.define do
  factory :segment_query do
    filter_type { "MyString" }
    category { "MyString" }
    name { "MyString" }
    data_type { "MyString" }
    value { "MyString" }
    operator { "MyString" }
  end
end
