FactoryBot.define do
  factory :user_attribute do
    name { "MyString" }
    readable_name { "MyString" }
    description { "MyString" }
    category { "MyString" }
    source { "MyString" }
    encrypted { false }
    pii { false }
    data_types { "MyString" }
    string { "MyString" }
  end
end
