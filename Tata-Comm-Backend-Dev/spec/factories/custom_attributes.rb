FactoryBot.define do
  factory :custom_attribute do
    name { "MyString" }
    display_name { "MyString" }
    value { "MyString" }
    source { "" }
    contact_id { 1 }
    account_id { 1 }
  end
end
