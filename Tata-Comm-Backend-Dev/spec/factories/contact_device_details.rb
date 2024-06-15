FactoryBot.define do
  factory :contact_device_detail do
    association :contact
    association :device
    location {{"latitude" => 12.345, "longitude" => 67.890}}
    properties {{"property_1" => "value_1", "property_2" => "value_2" }}
    push_opt_in_status_ios {"opted_in"}
    tcl_engage_push_opted_out {"opted_out"}
    user_push_preference {"preference_value"}
    unique_user_id {"unique_id_123"}
  end
end