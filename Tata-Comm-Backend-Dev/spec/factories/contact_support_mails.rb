FactoryBot.define do
  factory :contact_support_mail do
    subject { "MyString" }
    description { "MyText" }
    product_area { "MyString" }
    association :user
  end
end
