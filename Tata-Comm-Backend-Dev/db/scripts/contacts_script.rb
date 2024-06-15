Rails.logger.info 'Enter total count of contacts to create for this script.'
total_count = gets.chomp.to_i
Rails.logger.info 'Enter account_id of contacts to create for this script.'
account_id = gets.chomp.to_i

Rails.logger.info { "creating #{total_count} new contacts for account #{account_id}. It might take some time to create so have a cup of tea." }

# Script for generating records for Contacts
require 'benchmark'
Benchmark.bmbm do |obj|
  obj.report('ContactCommonEvent runtime') do
    total_count.times do
      Contact.create!(name: Faker::Name.name,
                      email: Faker::Internet.email,
                      account_id: account_id,
                      pubsub_token: SecureRandom.hex(14),
                      additional_attributes: {},
                      identifier: nil,
                      custom_attributes: {},
                      last_activity_at: DateTime.now,
                      first_name: Faker::Name.first_name,
                      gender: Faker::Gender.binary_type,
                      locale_country: Faker::Address.country,
                      creation_source: ['Import User', 'CDP'].sample,
                      birth_date: Faker::Date.birthday(min_age: 18, max_age: 45),
                      locale_language: Faker::Nation.language,
                      location: Faker::Address.city,
                      sms_subscription_status: [true, false].sample,
                      first_seen: DateTime.now,
                      ltv: rand(1..1_000_000),
                      last_seen: DateTime.now,
                      no_of_conversions: rand(1..20),
                      no_of_sessions: rand(1..15),
                      campaign_name: Faker::Book.title,
                      publisher_name: Faker::Book.publisher,
                      install_status: [true, false].sample,
                      uninstall_time: DateTime.now,
                      device_reinstall: DateTime.now,
                      user_reinstall: DateTime.now,
                      push_opt_in_status: [true, false].sample,
                      web_push_subscription_page_url: Faker::Internet.url,
                      web_push_subscription_status: [true, false].sample,
                      last_known_city: Faker::Address.city,
                      last_known_country: Faker::Address.country,
                      last_known_state: Faker::Address.state,
                      user_timezone_offset: Faker::Address.time_zone,
                      hard_bounce: [true, false].sample,
                      spam: [true, false].sample,
                      unsubscribe: [true, false].sample,
                      advertising_identifier: SecureRandom.uuid,
                      browser_details: Faker::Internet.user_agent,
                      google_advertising_id: SecureRandom.uuid,
                      mobile_user: %w[Chrome Firefox Safari Edge].sample,
                      last_name: Faker::Name.last_name)
    end
    Rails.logger.debug { "Created #{total_count} new contacts for account #{account_id}." }
  rescue StandardError => e
    Rails.logger.debug e.message
  end
end

Rails.logger.info 'Script ran successfully'
