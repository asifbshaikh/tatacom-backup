class Db::AudiencePreviewSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :phone_number, :first_name, :last_name, :gender, :birth_date, :location, :locale_country, :locale_language, :sms_subscription_status, :last_activity_at,
             :first_seen, :ltv, :last_seen, :no_of_conversions, :no_of_sessions, :campaign_name, :publisher_name, :install_status, :uninstall_time, :device_reinstall,
             :user_reinstall, :push_opt_in_status, :web_push_subscription_page_url, :web_push_subscription_status, :last_known_city, :last_known_country, :last_known_pincode, :last_known_state, :user_timezone_offset, :hard_bounce, :spam, :unsubscribe, :advertising_identifier, :browser_details,
             :google_advertising_id, :mobile_user, :last_interaction_at, :interaction_count, :custom_attributes, :updated_at, :customer_id
end
