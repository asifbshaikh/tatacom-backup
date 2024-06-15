FactoryBot.define do
  factory :segment do
    segmentable { nil }
    account { nil }
    name { "MyString" }
    description { "MyString" }
    user_count { 1 }
    user_ids { 1 }
    reachable_users_count { 1 }
    reachability_percentage_by_channel { 1.5 }
    source_type { "MyString" }
    archived { false }
    sms_camp_reachable_count { 1 }
    email_camp_reachable_count { 1 }
    push_camp_reachable_count { 1 }
    sms_camp_reachable_percentage { 1.5 }
    email_camp_reachable_percentage { 1.5 }
    push_camp_reachable_percentage { 1.5 }
  end
end
