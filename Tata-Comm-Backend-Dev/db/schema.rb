# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_01_22_122703) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "access_tokens", force: :cascade do |t|
    t.string "owner_type"
    t.bigint "owner_id"
    t.string "token"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["owner_type", "owner_id"], name: "index_access_tokens_on_owner_type_and_owner_id"
    t.index ["token"], name: "index_access_tokens_on_token", unique: true
  end

  create_table "account_settings", force: :cascade do |t|
    t.integer "account_id"
    t.string "app_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "api_key"
    t.string "access_token"
    t.datetime "token_expires_at"
  end

  create_table "account_users", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "user_id"
    t.integer "role", default: 0
    t.bigint "inviter_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "active_at"
    t.integer "availability", default: 0, null: false
    t.boolean "auto_offline", default: true, null: false
    t.index ["account_id", "user_id"], name: "uniq_user_id_per_account_id", unique: true
    t.index ["account_id"], name: "index_account_users_on_account_id"
    t.index ["user_id"], name: "index_account_users_on_user_id"
  end

  create_table "accounts", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "locale", default: 0
    t.string "domain", limit: 100
    t.string "support_email", limit: 100
    t.integer "settings_flags", default: 0, null: false
    t.integer "feature_flags", default: 0, null: false
    t.integer "auto_resolve_duration"
    t.jsonb "limits", default: {}
    t.integer "max_days_limit_for_events"
  end

  create_table "action_mailbox_inbound_emails", force: :cascade do |t|
    t.integer "status", default: 0, null: false
    t.string "message_id", null: false
    t.string "message_checksum", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["message_id", "message_checksum"], name: "index_action_mailbox_inbound_emails_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "affinities", force: :cascade do |t|
    t.string "name"
    t.string "displayed_name"
    t.text "description"
    t.string "source", array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "agent_bot_inboxes", force: :cascade do |t|
    t.integer "inbox_id"
    t.integer "agent_bot_id"
    t.integer "status", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "account_id"
  end

  create_table "agent_bots", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "outgoing_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "account_id"
    t.index ["account_id"], name: "index_agent_bots_on_account_id"
  end

  create_table "attachments", id: :serial, force: :cascade do |t|
    t.integer "file_type", default: 0
    t.string "external_url"
    t.float "coordinates_lat", default: 0.0
    t.float "coordinates_long", default: 0.0
    t.integer "message_id", null: false
    t.integer "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "fallback_title"
    t.string "extension"
  end

  create_table "automation_rules", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "name", null: false
    t.text "description"
    t.string "event_name", null: false
    t.jsonb "conditions", default: "{}", null: false
    t.jsonb "actions", default: "{}", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "active", default: true, null: false
    t.index ["account_id"], name: "index_automation_rules_on_account_id"
  end

  create_table "campaign_deliveries", force: :cascade do |t|
    t.string "uuid"
    t.string "statusCode"
    t.datetime "sent_at"
    t.datetime "delivered_at"
    t.string "error_code"
    t.bigint "account_id", null: false
    t.bigint "campaign_id", null: false
    t.bigint "contact_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "message_id"
    t.datetime "opened_at"
    t.datetime "expired_at"
    t.datetime "bounced_at"
    t.datetime "clicked_at"
    t.string "status"
    t.text "tiny_url", default: ""
    t.boolean "clicked", default: false
    t.text "webhook_response_params", default: [], array: true
    t.string "channel_type"
    t.integer "channel_id"
    t.index ["account_id"], name: "index_campaign_deliveries_on_account_id"
    t.index ["campaign_id"], name: "index_campaign_deliveries_on_campaign_id"
    t.index ["contact_id"], name: "index_campaign_deliveries_on_contact_id"
    t.index ["error_code"], name: "index_campaign_deliveries_on_error_code"
    t.index ["uuid"], name: "index_campaign_deliveries_on_uuid"
  end

  create_table "campaign_details", force: :cascade do |t|
    t.text "subject"
    t.text "preview_text"
    t.string "sender_name"
    t.string "from_email_address"
    t.string "reply_to_email_address"
    t.string "cc_email_address", default: [], array: true
    t.string "bcc_email_address", default: [], array: true
    t.bigint "account_id", null: false
    t.bigint "campaign_id", null: false
    t.integer "channel_email_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_campaign_details_on_account_id"
    t.index ["campaign_id"], name: "index_campaign_details_on_campaign_id"
    t.index ["channel_email_id"], name: "index_campaign_details_on_channel_email_id"
    t.index ["from_email_address"], name: "index_campaign_details_on_from_email_address"
    t.index ["reply_to_email_address"], name: "index_campaign_details_on_reply_to_email_address"
  end

  create_table "campaign_devices", force: :cascade do |t|
    t.bigint "campaign_id"
    t.bigint "device_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["campaign_id"], name: "index_campaign_devices_on_campaign_id"
    t.index ["device_id"], name: "index_campaign_devices_on_device_id"
  end

  create_table "campaign_global_control_groups", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.bigint "global_control_group_id"
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["campaign_id"], name: "index_campaign_global_control_groups_on_campaign_id"
    t.index ["global_control_group_id"], name: "index_campaign_global_control_groups_on_global_control_group_id"
  end

  create_table "campaign_goals", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.bigint "account_id", null: false
    t.string "name"
    t.integer "attribution_window"
    t.integer "attribution_window_type"
    t.boolean "capping_enabled"
    t.integer "frequency_capping_count"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "attribute_name"
    t.string "attribute_value"
  end

  create_table "campaign_schedulers", force: :cascade do |t|
    t.string "campaign_type", null: false
    t.string "periodic_type"
    t.jsonb "trigger_criteria_first", default: []
    t.jsonb "trigger_criteria_second", default: []
    t.bigint "campaign_id", null: false
    t.bigint "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "campaign_time_zone"
    t.integer "schedule_type"
    t.integer "scheduling_frequency"
    t.string "send_campaign_time"
    t.datetime "start_date", null: false
    t.datetime "end_date"
    t.integer "repeat_every"
    t.boolean "send_if_user_timezone_expired", default: false
    t.integer "occurrences"
    t.string "repeat_on_day_of_month", default: [], array: true
    t.string "repeat_on_day_of_week", default: [], array: true
    t.string "best_time_for_user"
    t.boolean "on_best_time", default: false
    t.string "cron_expression"
    t.integer "occurrence_count", default: 0
    t.integer "status", default: 0
    t.integer "alternate_timezone"
    t.string "base_url"
    t.string "trigger_relation"
    t.string "trigger_attr"
    t.integer "time_value"
    t.integer "time_multiplier"
    t.index ["account_id"], name: "index_campaign_schedulers_on_account_id"
    t.index ["campaign_id"], name: "index_campaign_schedulers_on_campaign_id"
  end

  create_table "campaign_syncs", force: :cascade do |t|
    t.integer "status", default: 0
    t.datetime "last_run_at"
    t.bigint "account_id", null: false
    t.bigint "campaign_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_campaign_syncs_on_account_id"
    t.index ["campaign_id"], name: "index_campaign_syncs_on_campaign_id"
  end

  create_table "campaign_tags", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.jsonb "custom_attributes", default: "{}"
    t.bigint "campaign_id", null: false
    t.bigint "group_tag_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["campaign_id"], name: "index_campaign_tags_on_campaign_id"
    t.index ["group_tag_id"], name: "index_campaign_tags_on_group_tag_id"
  end

  create_table "campaigns", force: :cascade do |t|
    t.integer "display_id", null: false
    t.string "title"
    t.text "description"
    t.text "message"
    t.integer "sender_id"
    t.boolean "enabled", default: true
    t.bigint "account_id", null: false
    t.bigint "inbox_id"
    t.jsonb "trigger_rules", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "campaign_type", default: 0, null: false
    t.integer "campaign_status", default: 0, null: false
    t.jsonb "audience", default: []
    t.datetime "scheduled_at"
    t.boolean "trigger_only_during_business_hours", default: false
    t.integer "scheduling_type"
    t.bigint "campaignable_id"
    t.string "campaignable_type"
    t.decimal "total_order_value"
    t.integer "number_of_conversion_events"
    t.integer "number_of_unique_conversions"
    t.boolean "exclude_users"
    t.string "select_audience"
    t.boolean "send_campaign_to_the_opted_out_users"
    t.integer "status", default: 0
    t.jsonb "personalise_mapping_attribute", default: {}
    t.jsonb "segment_attribute", default: {}
    t.string "selected_contact_attribute"
    t.integer "campaign_state"
    t.string "channel_type"
    t.integer "channel_id"
    t.boolean "template_customized"
    t.index ["account_id"], name: "index_campaigns_on_account_id"
    t.index ["campaign_status"], name: "index_campaigns_on_campaign_status"
    t.index ["campaign_type"], name: "index_campaigns_on_campaign_type"
    t.index ["campaignable_id", "campaignable_type"], name: "index_campaigns_on_campaignable_id_and_campaignable_type"
    t.index ["inbox_id"], name: "index_campaigns_on_inbox_id"
    t.index ["scheduled_at"], name: "index_campaigns_on_scheduled_at"
  end

  create_table "canned_responses", id: :serial, force: :cascade do |t|
    t.integer "account_id", null: false
    t.string "short_code"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "channel_api", force: :cascade do |t|
    t.integer "account_id", null: false
    t.string "webhook_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "identifier"
    t.string "hmac_token"
    t.boolean "hmac_mandatory", default: false
    t.index ["hmac_token"], name: "index_channel_api_on_hmac_token", unique: true
    t.index ["identifier"], name: "index_channel_api_on_identifier", unique: true
  end

  create_table "channel_email", force: :cascade do |t|
    t.integer "account_id", null: false
    t.string "email"
    t.string "forward_to_email", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "imap_enabled", default: false
    t.string "imap_address", default: ""
    t.integer "imap_port", default: 0
    t.string "imap_email", default: ""
    t.string "imap_password", default: ""
    t.boolean "imap_enable_ssl", default: true
    t.datetime "imap_inbox_synced_at"
    t.boolean "smtp_enabled", default: false
    t.string "smtp_address", default: ""
    t.integer "smtp_port", default: 0
    t.string "smtp_email", default: ""
    t.string "smtp_password", default: ""
    t.string "smtp_domain", default: ""
    t.boolean "smtp_enable_starttls_auto", default: true
    t.string "smtp_authentication", default: "login"
    t.string "smtp_openssl_verify_mode", default: "none"
    t.boolean "smtp_enable_ssl_tls", default: false
    t.string "smtp_protocol", default: "none"
    t.boolean "smtp_auth_enable", default: false
    t.integer "maximum_send_rate"
    t.string "unsubscribe_setting", default: "none"
    t.string "bounces_and_complaint_tracking"
    t.string "email_api_url"
    t.string "email_api_key"
    t.string "channel_name"
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_channel_email_on_deleted_at"
    t.index ["email"], name: "index_channel_email_on_email", unique: true
    t.index ["forward_to_email"], name: "index_channel_email_on_forward_to_email", unique: true
  end

  create_table "channel_facebook_pages", id: :serial, force: :cascade do |t|
    t.string "page_id", null: false
    t.string "user_access_token", null: false
    t.string "page_access_token", null: false
    t.integer "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "instagram_id"
    t.index ["page_id", "account_id"], name: "index_channel_facebook_pages_on_page_id_and_account_id", unique: true
    t.index ["page_id"], name: "index_channel_facebook_pages_on_page_id"
  end

  create_table "channel_kakao_sms", force: :cascade do |t|
    t.integer "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "service_id"
    t.string "channel_type"
  end

  create_table "channel_line", force: :cascade do |t|
    t.integer "account_id", null: false
    t.string "line_channel_id", null: false
    t.string "line_channel_secret", null: false
    t.string "line_channel_token", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["line_channel_id"], name: "index_channel_line_on_line_channel_id", unique: true
  end

  create_table "channel_sms", force: :cascade do |t|
    t.integer "account_id", null: false
    t.string "phone_number", null: false
    t.string "provider", default: "default"
    t.jsonb "provider_config", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["phone_number"], name: "index_channel_sms_on_phone_number", unique: true
  end

  create_table "channel_tata_sms", force: :cascade do |t|
    t.string "ss_key", null: false
    t.string "phone_number", null: false
    t.string "app_id", null: false
    t.integer "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "token"
  end

  create_table "channel_telegram", force: :cascade do |t|
    t.string "bot_name"
    t.integer "account_id", null: false
    t.string "bot_token", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["bot_token"], name: "index_channel_telegram_on_bot_token", unique: true
  end

  create_table "channel_twilio_sms", force: :cascade do |t|
    t.string "phone_number", null: false
    t.string "auth_token", null: false
    t.string "account_sid", null: false
    t.integer "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "medium", default: 0
    t.index ["account_id", "phone_number"], name: "index_channel_twilio_sms_on_account_id_and_phone_number", unique: true
  end

  create_table "channel_twitter_profiles", force: :cascade do |t|
    t.string "profile_id", null: false
    t.string "twitter_access_token", null: false
    t.string "twitter_access_token_secret", null: false
    t.integer "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "tweets_enabled", default: true
    t.index ["account_id", "profile_id"], name: "index_channel_twitter_profiles_on_account_id_and_profile_id", unique: true
  end

  create_table "channel_types", force: :cascade do |t|
    t.string "name"
    t.string "class_name"
    t.string "provider"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "channel_viber_sms", force: :cascade do |t|
    t.string "service_id", null: false
    t.integer "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "channel_type"
  end

  create_table "channel_web_widgets", id: :serial, force: :cascade do |t|
    t.string "website_url"
    t.integer "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "website_token"
    t.string "widget_color", default: "#1f93ff"
    t.string "welcome_title"
    t.string "welcome_tagline"
    t.integer "feature_flags", default: 3, null: false
    t.integer "reply_time", default: 0
    t.string "hmac_token"
    t.boolean "pre_chat_form_enabled", default: false
    t.jsonb "pre_chat_form_options", default: {}
    t.boolean "hmac_mandatory", default: false
    t.boolean "continuity_via_email", default: true, null: false
    t.index ["hmac_token"], name: "index_channel_web_widgets_on_hmac_token", unique: true
    t.index ["website_token"], name: "index_channel_web_widgets_on_website_token", unique: true
  end

  create_table "channel_wechat_sms", force: :cascade do |t|
    t.string "open_id", null: false
    t.string "app_id", null: false
    t.string "app_secret", null: false
    t.integer "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "channel_whatsapp", force: :cascade do |t|
    t.integer "account_id", null: false
    t.string "phone_number", null: false
    t.string "provider", default: "default"
    t.jsonb "provider_config", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "message_templates", default: {}
    t.datetime "message_templates_last_updated"
    t.string "channel_name"
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_channel_whatsapp_on_deleted_at"
    t.index ["phone_number"], name: "index_channel_whatsapp_on_phone_number", unique: true
  end

  create_table "common_event_attributes", force: :cascade do |t|
    t.string "name"
    t.string "display_name"
    t.string "category"
    t.integer "common_event_id"
    t.text "values", default: [], array: true
    t.string "data_types", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "common_events", force: :cascade do |t|
    t.string "name"
    t.string "displayed_name"
    t.text "description"
    t.string "category"
    t.string "source", array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "property_name"
    t.string "data_type"
    t.integer "account_id"
    t.index ["account_id"], name: "index_common_events_on_account_id"
    t.index ["data_type"], name: "index_common_events_on_data_type"
    t.index ["name"], name: "index_common_events_on_name"
  end

  create_table "contact_common_events", force: :cascade do |t|
    t.integer "contact_id"
    t.integer "common_event_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "campaign_id"
    t.string "campaign_channel"
    t.string "campaign_type"
    t.string "campaign_name"
    t.string "message_id"
    t.string "app_version"
    t.string "sdk_version"
    t.string "platform"
    t.integer "account_id"
    t.string "unique_user_id"
    t.index ["campaign_channel"], name: "index_contact_common_events_on_campaign_channel"
    t.index ["campaign_id"], name: "index_contact_common_events_on_campaign_id"
    t.index ["campaign_name"], name: "index_contact_common_events_on_campaign_name"
    t.index ["campaign_type"], name: "index_contact_common_events_on_campaign_type"
    t.index ["common_event_id"], name: "index_contact_common_events_on_common_event_id"
    t.index ["contact_id"], name: "index_contact_common_events_on_contact_id"
    t.index ["created_at"], name: "index_contact_common_events_on_created_at"
  end

  create_table "contact_device_details", force: :cascade do |t|
    t.bigint "contact_id"
    t.bigint "device_id"
    t.string "unique_user_id"
    t.string "push_opt_in_status_ios"
    t.string "user_push_preference"
    t.string "tcl_engage_push_opted_out"
    t.jsonb "properties"
    t.jsonb "location"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "logged_in_status"
    t.integer "account_id"
    t.index ["contact_id"], name: "index_contact_device_details_on_contact_id"
    t.index ["device_id"], name: "index_contact_device_details_on_device_id"
  end

  create_table "contact_event_filters", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "campaign_id"
    t.datetime "executed_at"
    t.string "filter_type"
    t.jsonb "filter_hash"
    t.text "description"
    t.text "sql_query"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id", "campaign_id"], name: "index_contact_event_filters_uniqueness", unique: true
    t.index ["account_id"], name: "index_contact_event_filters_on_account_id"
    t.index ["campaign_id"], name: "index_contact_event_filters_on_campaign_id"
  end

  create_table "contact_inboxes", force: :cascade do |t|
    t.bigint "contact_id"
    t.bigint "inbox_id"
    t.string "source_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "hmac_verified", default: false
    t.string "pubsub_token"
    t.index ["contact_id"], name: "index_contact_inboxes_on_contact_id"
    t.index ["inbox_id", "source_id"], name: "index_contact_inboxes_on_inbox_id_and_source_id", unique: true
    t.index ["inbox_id"], name: "index_contact_inboxes_on_inbox_id"
    t.index ["pubsub_token"], name: "index_contact_inboxes_on_pubsub_token", unique: true
    t.index ["source_id"], name: "index_contact_inboxes_on_source_id"
  end

  create_table "contact_support_mails", force: :cascade do |t|
    t.string "subject"
    t.text "description"
    t.string "product_area"
    t.string "priority"
    t.string "cc_users", default: [], array: true
    t.string "bcc_users", default: [], array: true
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_contact_support_mails_on_user_id"
  end

  create_table "contacts", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "phone_number"
    t.integer "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "pubsub_token"
    t.jsonb "additional_attributes", default: {}
    t.string "identifier"
    t.jsonb "custom_attributes", default: {}
    t.datetime "last_activity_at"
    t.string "first_name"
    t.string "gender"
    t.string "locale_country"
    t.string "creation_source"
    t.integer "source_id", default: [], array: true
    t.datetime "birth_date"
    t.string "locale_language"
    t.string "location"
    t.string "sms_subscription_status"
    t.datetime "first_seen"
    t.integer "ltv"
    t.datetime "last_seen"
    t.integer "no_of_conversions"
    t.integer "no_of_sessions"
    t.string "campaign_name"
    t.string "publisher_name"
    t.string "install_status"
    t.datetime "uninstall_time"
    t.datetime "device_reinstall"
    t.datetime "user_reinstall"
    t.string "push_opt_in_status"
    t.string "web_push_subscription_page_url"
    t.string "web_push_subscription_status"
    t.string "last_known_city"
    t.string "last_known_country"
    t.string "last_known_pincode"
    t.string "last_known_state"
    t.string "user_timezone_offset"
    t.boolean "hard_bounce", default: false
    t.boolean "spam", default: false
    t.boolean "unsubscribe", default: false
    t.string "advertising_identifier"
    t.string "browser_details"
    t.integer "google_advertising_id"
    t.boolean "mobile_user"
    t.bigint "import_user_id"
    t.datetime "last_interaction_at"
    t.integer "interaction_count"
    t.string "last_name"
    t.string "customer_id"
    t.integer "data_sync_import_id"
    t.string "middle_name"
    t.string "city"
    t.string "address"
    t.string "country"
    t.index ["account_id"], name: "index_contacts_on_account_id"
    t.index ["birth_date"], name: "index_contacts_on_birth_date"
    t.index ["browser_details"], name: "index_contacts_on_browser_details"
    t.index ["customer_id"], name: "index_contacts_on_customer_id"
    t.index ["email"], name: "index_contacts_on_email"
    t.index ["first_name"], name: "index_contacts_on_first_name"
    t.index ["first_seen"], name: "index_contacts_on_first_seen"
    t.index ["gender"], name: "index_contacts_on_gender"
    t.index ["google_advertising_id"], name: "index_contacts_on_google_advertising_id"
    t.index ["id"], name: "index_contacts_on_id"
    t.index ["identifier", "account_id"], name: "uniq_identifier_per_account_contact", unique: true
    t.index ["import_user_id"], name: "index_contacts_on_import_user_id"
    t.index ["last_name"], name: "index_contacts_on_last_name"
    t.index ["last_seen"], name: "index_contacts_on_last_seen"
    t.index ["locale_country"], name: "index_contacts_on_locale_country"
    t.index ["ltv"], name: "index_contacts_on_ltv"
    t.index ["name"], name: "index_contacts_on_name"
    t.index ["phone_number", "account_id"], name: "index_contacts_on_phone_number_and_account_id"
    t.index ["pubsub_token"], name: "index_contacts_on_pubsub_token", unique: true
    t.index ["source_id"], name: "index_contacts_on_source_id"
  end

  create_table "contacts_reports", force: :cascade do |t|
    t.string "file_name"
    t.text "description"
    t.integer "status"
    t.integer "segment_filter_id"
    t.integer "user_id"
    t.text "s3_file_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "header", default: {}
    t.string "object_key"
    t.bigint "segment_id"
  end

  create_table "conversations", id: :serial, force: :cascade do |t|
    t.integer "account_id", null: false
    t.integer "inbox_id", null: false
    t.integer "status", default: 0, null: false
    t.integer "assignee_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "contact_id"
    t.integer "display_id", null: false
    t.datetime "contact_last_seen_at"
    t.datetime "agent_last_seen_at"
    t.jsonb "additional_attributes", default: {}
    t.bigint "contact_inbox_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "identifier"
    t.datetime "last_activity_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.bigint "team_id"
    t.bigint "campaign_id"
    t.datetime "snoozed_until"
    t.jsonb "custom_attributes", default: {}
    t.datetime "assignee_last_seen_at"
    t.index ["account_id", "display_id"], name: "index_conversations_on_account_id_and_display_id", unique: true
    t.index ["account_id"], name: "index_conversations_on_account_id"
    t.index ["assignee_id", "account_id"], name: "index_conversations_on_assignee_id_and_account_id"
    t.index ["campaign_id"], name: "index_conversations_on_campaign_id"
    t.index ["contact_inbox_id"], name: "index_conversations_on_contact_inbox_id"
    t.index ["status", "account_id"], name: "index_conversations_on_status_and_account_id"
    t.index ["team_id"], name: "index_conversations_on_team_id"
  end

  create_table "crm_cdp_schedule_details", force: :cascade do |t|
    t.bigint "account_id"
    t.jsonb "attribute_mapping"
    t.string "end_type"
    t.string "import_name"
    t.datetime "next_run_at"
    t.integer "occurrences"
    t.datetime "run_at"
    t.string "segment_name"
    t.string "source_id"
    t.string "source_type"
    t.string "table_name"
    t.string "data_fetch_column"
    t.string "time_zone"
    t.string "uuid"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "type"
    t.string "import_type"
    t.jsonb "email_ids", default: [], array: true
    t.datetime "end_date"
    t.boolean "deactivate", default: false
    t.jsonb "events_name", default: [], array: true
    t.jsonb "repeat_on_day_of_month", default: [], array: true
    t.jsonb "repeat_on_day_of_week", default: [], array: true
    t.string "cron_expression"
    t.integer "occurrence_count", default: 0
    t.integer "repeat_every"
    t.datetime "start_date"
    t.integer "status", default: 0
    t.integer "frequency"
    t.integer "schedule_type"
    t.index ["account_id"], name: "index_crm_cdp_schedule_details_on_account_id"
  end

  create_table "csat_survey_responses", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "conversation_id", null: false
    t.bigint "message_id", null: false
    t.integer "rating", null: false
    t.text "feedback_message"
    t.bigint "contact_id", null: false
    t.bigint "assigned_agent_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_csat_survey_responses_on_account_id"
    t.index ["assigned_agent_id"], name: "index_csat_survey_responses_on_assigned_agent_id"
    t.index ["contact_id"], name: "index_csat_survey_responses_on_contact_id"
    t.index ["conversation_id"], name: "index_csat_survey_responses_on_conversation_id"
    t.index ["message_id"], name: "index_csat_survey_responses_on_message_id", unique: true
  end

  create_table "custom_attribute_configurations", force: :cascade do |t|
    t.string "name"
    t.string "displayed_name"
    t.text "description"
    t.string "data_type"
    t.integer "account_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "custom_attribute_definitions", force: :cascade do |t|
    t.string "attribute_display_name"
    t.string "attribute_key"
    t.integer "attribute_display_type", default: 0
    t.integer "default_value"
    t.integer "attribute_model", default: 0
    t.bigint "account_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "attribute_description"
    t.jsonb "attribute_values", default: []
    t.index ["account_id"], name: "index_custom_attribute_definitions_on_account_id"
    t.index ["attribute_key", "attribute_model"], name: "attribute_key_model_index", unique: true
  end

  create_table "custom_attributes", force: :cascade do |t|
    t.string "name"
    t.string "displayed_name"
    t.string "value"
    t.string "source", array: true
    t.integer "contact_id"
    t.integer "account_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "custom_filters", force: :cascade do |t|
    t.string "name", null: false
    t.integer "filter_type", default: 0, null: false
    t.jsonb "query", default: "{}", null: false
    t.bigint "account_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_custom_filters_on_account_id"
    t.index ["user_id"], name: "index_custom_filters_on_user_id"
  end

  create_table "custom_segments", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "name"
    t.text "description"
    t.string "segment_source"
    t.string "source_type"
    t.text "file_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "data_imports", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "data_type", null: false
    t.integer "status", default: 0, null: false
    t.text "processing_errors"
    t.integer "total_records"
    t.integer "processed_records"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_data_imports_on_account_id"
  end

  create_table "data_sync_imports", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "crm_cdp_schedule_detail_id"
    t.string "folder_path"
    t.string "name"
    t.integer "processed_count"
    t.integer "synced_count"
    t.string "uuid"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "import_type"
    t.integer "status"
    t.string "file_key"
    t.string "failed_error"
    t.string "segment_name"
    t.integer "total_rows"
    t.string "custom_segment"
    t.integer "custom_segment_id"
    t.integer "processed_rows"
    t.index ["account_id"], name: "index_data_sync_imports_on_account_id"
    t.index ["crm_cdp_schedule_detail_id"], name: "index_data_sync_imports_on_crm_cdp_schedule_detail_id"
  end

  create_table "db_configurations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "adapter"
    t.string "encoding"
    t.text "host"
    t.string "username"
    t.string "password"
    t.string "database"
    t.string "port"
    t.bigint "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
    t.index ["account_id"], name: "index_db_configurations_on_account_id"
  end

  create_table "devices", force: :cascade do |t|
    t.string "advertising_identifier"
    t.string "vender_identifier"
    t.string "os_version"
    t.string "device_timezone"
    t.string "name"
    t.string "device_model"
    t.string "platform"
    t.bigint "contact_id"
    t.bigint "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "device_model_name"
    t.string "model"
    t.string "device_token"
    t.string "model_version"
    t.integer "api_level"
    t.string "product_name"
    t.string "manufacturer"
    t.string "android_id"
    t.string "gaid"
    t.string "gaid_tracking_status"
    t.string "carrier"
    t.string "device_density"
    t.string "device_width"
    t.string "device_height"
    t.string "network_type"
    t.string "unique_user_id"
    t.index ["account_id"], name: "index_devices_on_account_id"
    t.index ["contact_id"], name: "index_devices_on_contact_id"
  end

  create_table "email_campaigns", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "campaign_tag_id"
    t.integer "campaign_content_type", default: 0, null: false
    t.string "user_attribute_with_email_address"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "email_template_id"
    t.index ["account_id"], name: "index_email_campaigns_on_account_id"
    t.index ["campaign_content_type"], name: "index_email_campaigns_on_campaign_content_type"
    t.index ["campaign_tag_id"], name: "index_email_campaigns_on_campaign_tag_id"
  end

  create_table "email_general_settings", force: :cascade do |t|
    t.bigint "channel_email_id", null: false
    t.string "user_attribute"
    t.string "email_address", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "account_id"
    t.index ["channel_email_id"], name: "index_email_general_settings_on_channel_email_id"
  end

  create_table "email_templates", force: :cascade do |t|
    t.string "name", null: false
    t.text "body", null: false
    t.integer "account_id"
    t.integer "template_type", default: 1
    t.integer "locale", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "design"
    t.index ["name", "account_id"], name: "index_email_templates_on_name_and_account_id", unique: true
  end

  create_table "fc_dnd_setting_countries", force: :cascade do |t|
    t.bigint "fc_dnd_setting_id", null: false
    t.string "country_code"
    t.string "week_days", array: true
    t.datetime "start_time"
    t.datetime "end_time"
    t.string "dnd_timezone"
    t.string "phone_code"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["fc_dnd_setting_id"], name: "index_fc_dnd_setting_countries_on_fc_dnd_setting_id"
  end

  create_table "fc_dnd_settings", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.boolean "fc_enabled", default: false
    t.boolean "dnd_enabled", default: false
    t.integer "max_message"
    t.integer "no_of_days"
    t.integer "refresh_timezone", default: 0
    t.boolean "allow_in_dnd_period", default: false
    t.integer "save_and_send_criteria", default: 0
    t.integer "message_queue", default: 0
    t.boolean "control_queue", default: false
    t.integer "control_queue_gap", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "channel_id"
    t.string "channel_type"
    t.index ["account_id"], name: "index_fc_dnd_settings_on_account_id"
  end

  create_table "global_control_groups", force: :cascade do |t|
    t.integer "control_group"
    t.integer "random_allocation_percentage"
    t.boolean "apply_global"
    t.boolean "allow_marketers"
    t.boolean "active"
    t.bigint "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_global_control_groups_on_account_id"
  end

  create_table "goal_events", force: :cascade do |t|
    t.bigint "campaign_goal_id", null: false
    t.string "event_name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "group_tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "import_file_segments", force: :cascade do |t|
    t.bigint "segment_id", null: false
    t.bigint "account_user_id", null: false
    t.integer "status", default: 0
    t.integer "total_users", default: 0
    t.integer "added_users", default: 0
    t.integer "removed_users", default: 0
    t.integer "invalid_users", default: 0
    t.string "failed_file_url"
    t.string "s3_object_id"
    t.string "event_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "emails", default: [], array: true
    t.index ["account_user_id"], name: "index_import_file_segments_on_account_user_id"
    t.index ["segment_id"], name: "index_import_file_segments_on_segment_id"
  end

  create_table "import_users", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "account_user_id", null: false
    t.text "file_url"
    t.integer "user_type", null: false
    t.integer "total_rows"
    t.integer "new_users_count"
    t.integer "updated_users_count"
    t.string "custom_segment"
    t.integer "custom_segment_id"
    t.boolean "update_existing_user", default: true, null: false
    t.boolean "has_header"
    t.string "identifier"
    t.jsonb "skipped_col", default: []
    t.json "col_types", default: {}
    t.jsonb "new_custom_attributes", default: []
    t.text "failed_scenarios_file_url"
    t.text "error_message"
    t.integer "status", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "file_name"
    t.integer "failed_count", default: 0
    t.integer "skipped_count", default: 0
  end

  create_table "inbox_members", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "inbox_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["inbox_id", "user_id"], name: "index_inbox_members_on_inbox_id_and_user_id", unique: true
    t.index ["inbox_id"], name: "index_inbox_members_on_inbox_id"
  end

  create_table "inboxes", id: :serial, force: :cascade do |t|
    t.integer "channel_id"
    t.integer "account_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "channel_type"
    t.boolean "enable_auto_assignment", default: true
    t.boolean "greeting_enabled", default: false
    t.string "greeting_message"
    t.string "email_address"
    t.boolean "working_hours_enabled", default: false
    t.string "out_of_office_message"
    t.string "timezone", default: "UTC"
    t.boolean "enable_email_collect", default: true
    t.boolean "csat_survey_enabled", default: false
    t.boolean "allow_messages_after_resolved", default: true
    t.boolean "archived", default: false
    t.datetime "deleted_at"
    t.index ["account_id"], name: "index_inboxes_on_account_id"
    t.index ["deleted_at"], name: "index_inboxes_on_deleted_at"
  end

  create_table "installation_configs", force: :cascade do |t|
    t.string "name", null: false
    t.jsonb "serialized_value", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "locked", default: true, null: false
    t.index ["name", "created_at"], name: "index_installation_configs_on_name_and_created_at", unique: true
    t.index ["name"], name: "index_installation_configs_on_name", unique: true
  end

  create_table "integrations_hooks", force: :cascade do |t|
    t.integer "status", default: 0
    t.integer "inbox_id"
    t.integer "account_id"
    t.string "app_id"
    t.integer "hook_type", default: 0
    t.string "reference_id"
    t.string "access_token"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "settings", default: {}
  end

  create_table "kbase_articles", force: :cascade do |t|
    t.integer "account_id", null: false
    t.integer "portal_id", null: false
    t.integer "category_id"
    t.integer "folder_id"
    t.integer "author_id"
    t.string "title"
    t.text "description"
    t.text "content"
    t.integer "status"
    t.integer "views"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "kbase_categories", force: :cascade do |t|
    t.integer "account_id", null: false
    t.integer "portal_id", null: false
    t.string "name"
    t.text "description"
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "kbase_folders", force: :cascade do |t|
    t.integer "account_id", null: false
    t.integer "category_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "kbase_portals", force: :cascade do |t|
    t.integer "account_id", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.string "custom_domain"
    t.string "color"
    t.string "homepage_link"
    t.string "page_title"
    t.text "header_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["slug"], name: "index_kbase_portals_on_slug", unique: true
  end

  create_table "labels", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "color", default: "#1f93ff", null: false
    t.boolean "show_on_sidebar"
    t.bigint "account_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_labels_on_account_id"
    t.index ["title", "account_id"], name: "index_labels_on_title_and_account_id", unique: true
  end

  create_table "mentions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "conversation_id", null: false
    t.bigint "account_id", null: false
    t.datetime "mentioned_at", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_mentions_on_account_id"
    t.index ["conversation_id"], name: "index_mentions_on_conversation_id"
    t.index ["user_id", "conversation_id"], name: "index_mentions_on_user_id_and_conversation_id", unique: true
    t.index ["user_id"], name: "index_mentions_on_user_id"
  end

  create_table "messages", id: :serial, force: :cascade do |t|
    t.text "content"
    t.integer "account_id", null: false
    t.integer "inbox_id", null: false
    t.integer "conversation_id", null: false
    t.integer "message_type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "private", default: false
    t.integer "status", default: 0
    t.string "source_id"
    t.integer "content_type", default: 0, null: false
    t.json "content_attributes", default: {}
    t.string "sender_type"
    t.bigint "sender_id"
    t.jsonb "external_source_ids", default: {}
    t.integer "campaign_id"
    t.index ["account_id"], name: "index_messages_on_account_id"
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["inbox_id"], name: "index_messages_on_inbox_id"
    t.index ["sender_type", "sender_id"], name: "index_messages_on_sender_type_and_sender_id"
    t.index ["source_id"], name: "index_messages_on_source_id"
  end

  create_table "notes", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "account_id", null: false
    t.bigint "contact_id", null: false
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_notes_on_account_id"
    t.index ["contact_id"], name: "index_notes_on_contact_id"
    t.index ["user_id"], name: "index_notes_on_user_id"
  end

  create_table "notification_channel_secrete_files", force: :cascade do |t|
    t.bigint "notification_channel_id", null: false
    t.string "file_name"
    t.string "file_type"
    t.string "secret_file_password"
    t.string "device"
    t.string "file_extension"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "notification_channels", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "channel_name"
    t.jsonb "configuration", default: {}
    t.string "platform"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "notification_settings", force: :cascade do |t|
    t.integer "account_id"
    t.integer "user_id"
    t.integer "email_flags", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "push_flags", default: 0, null: false
    t.index ["account_id", "user_id"], name: "by_account_user", unique: true
  end

  create_table "notification_subscriptions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "subscription_type", null: false
    t.jsonb "subscription_attributes", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "identifier"
    t.index ["identifier"], name: "index_notification_subscriptions_on_identifier", unique: true
    t.index ["user_id"], name: "index_notification_subscriptions_on_user_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "user_id", null: false
    t.integer "notification_type", null: false
    t.string "primary_actor_type", null: false
    t.bigint "primary_actor_id", null: false
    t.string "secondary_actor_type"
    t.bigint "secondary_actor_id"
    t.datetime "read_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_notifications_on_account_id"
    t.index ["primary_actor_type", "primary_actor_id"], name: "uniq_primary_actor_per_account_notifications"
    t.index ["secondary_actor_type", "secondary_actor_id"], name: "uniq_secondary_actor_per_account_notifications"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "old_passwords", force: :cascade do |t|
    t.string "encrypted_password", null: false
    t.string "password_archivable_type", null: false
    t.integer "password_archivable_id", null: false
    t.datetime "created_at"
    t.index ["password_archivable_type", "password_archivable_id"], name: "index_password_archivable"
  end

  create_table "platform_app_permissibles", force: :cascade do |t|
    t.bigint "platform_app_id", null: false
    t.string "permissible_type", null: false
    t.bigint "permissible_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["permissible_type", "permissible_id"], name: "index_platform_app_permissibles_on_permissibles"
    t.index ["platform_app_id", "permissible_id", "permissible_type"], name: "unique_permissibles_index", unique: true
    t.index ["platform_app_id"], name: "index_platform_app_permissibles_on_platform_app_id"
  end

  create_table "platform_apps", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "queue_items", force: :cascade do |t|
    t.text "contents"
    t.string "topic"
    t.boolean "pending", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "report_schedulers", force: :cascade do |t|
    t.integer "report_type"
    t.integer "scheduling_frequency"
    t.datetime "start_date"
    t.datetime "end_date"
    t.integer "repeat_every"
    t.integer "max_occurrence"
    t.integer "occurrence_count"
    t.string "repeat_on_day_of_month", array: true
    t.string "repeat_on_day_of_week", array: true
    t.integer "status", default: 0
    t.string "cron_expression"
    t.text "campaign_ids", array: true
    t.boolean "api_enabled", default: false
    t.bigint "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_report_schedulers_on_account_id"
  end

  create_table "reporting_events", force: :cascade do |t|
    t.string "name"
    t.float "value"
    t.integer "account_id"
    t.integer "inbox_id"
    t.integer "user_id"
    t.integer "conversation_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_reporting_events_on_account_id"
    t.index ["created_at"], name: "index_reporting_events_on_created_at"
    t.index ["inbox_id"], name: "index_reporting_events_on_inbox_id"
    t.index ["name"], name: "index_reporting_events_on_name"
    t.index ["user_id"], name: "index_reporting_events_on_user_id"
  end

  create_table "s3_configurations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "bucket_name"
    t.text "access_key"
    t.text "secret_key"
    t.string "region"
    t.string "folder_path"
    t.bigint "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_s3_configurations_on_account_id"
  end

  create_table "segment_filters", force: :cascade do |t|
    t.bigint "account_id"
    t.datetime "executed_at"
    t.string "filter_type"
    t.jsonb "filter_hash", default: {}
    t.text "description"
    t.text "sql_query"
    t.string "custom_attribute1"
    t.string "custom_attribute2"
    t.string "custom_attribute3"
    t.string "custom_attribute4"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "user_ids", default: [], array: true
    t.bigint "users_count"
    t.datetime "last_refreshed_at"
    t.string "status", default: "draft"
    t.datetime "success_at"
    t.jsonb "sms_reachability", default: {}
    t.jsonb "email_reachability", default: {}
    t.jsonb "whatsapp_reachability", default: {}
    t.bigint "total_reachable_users", default: 0
    t.string "audience_type"
    t.boolean "exclude_users", default: false
  end

  create_table "segment_user_ids", force: :cascade do |t|
    t.bigint "segment_filter_id", null: false
    t.text "user_ids", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["segment_filter_id"], name: "index_segment_user_ids_on_segment_filter_id"
  end

  create_table "segments", force: :cascade do |t|
    t.string "segment_type"
    t.bigint "account_id", null: false
    t.string "name"
    t.text "description"
    t.bigint "user_count"
    t.text "user_ids", default: [], array: true
    t.bigint "reachable_users_count"
    t.float "reachability_percentage_by_channel"
    t.string "source_type"
    t.boolean "archived", default: false
    t.integer "sms_camp_reachable_count"
    t.integer "email_camp_reachable_count"
    t.integer "push_camp_reachable_count"
    t.integer "whatsapp_camp_reachable_count"
    t.float "sms_camp_reachable_percentage"
    t.float "email_camp_reachable_percentage"
    t.float "push_camp_reachable_percentage"
    t.float "whatsapp_camp_reachable_percentage"
    t.datetime "archived_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "segment_filter_id"
    t.datetime "last_run_at"
    t.index ["account_id"], name: "index_segments_on_account_id"
    t.index ["segment_filter_id"], name: "index_segments_on_segment_filter_id"
  end

  create_table "sftp_configurations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "hostname"
    t.string "username"
    t.string "password"
    t.boolean "is_encrypted", default: false
    t.text "decryption_key"
    t.string "folder_path"
    t.bigint "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_sftp_configurations_on_account_id"
  end

  create_table "sms_campaigns", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "campaign_tag_id"
    t.string "template_id"
    t.integer "template_record_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "tiny_urls", default: [], array: true
    t.index ["account_id"], name: "index_sms_campaigns_on_account_id"
    t.index ["campaign_tag_id"], name: "index_sms_campaigns_on_campaign_tag_id"
  end

  create_table "sms_templates", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type", "taggable_id"], name: "index_taggings_on_taggable_type_and_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
    t.index ["tagger_type", "tagger_id"], name: "index_taggings_on_tagger_type_and_tagger_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "tata_smscs", force: :cascade do |t|
    t.text "auth_token"
    t.string "medium"
    t.integer "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "sender_id"
    t.integer "sender_type"
    t.string "callback_url"
    t.string "channel_name"
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_tata_smscs_on_deleted_at"
  end

  create_table "team_members", force: :cascade do |t|
    t.bigint "team_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["team_id", "user_id"], name: "index_team_members_on_team_id_and_user_id", unique: true
    t.index ["team_id"], name: "index_team_members_on_team_id"
    t.index ["user_id"], name: "index_team_members_on_user_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.boolean "allow_auto_assign", default: true
    t.bigint "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_teams_on_account_id"
    t.index ["name", "account_id"], name: "index_teams_on_name_and_account_id", unique: true
  end

  create_table "telegram_bots", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "auth_key"
    t.integer "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "templates", force: :cascade do |t|
    t.string "name", null: false
    t.string "pe_id"
    t.string "telemarketer_id"
    t.text "registered_dlt"
    t.string "sender_id"
    t.text "description"
    t.text "message", null: false
    t.integer "account_id"
    t.integer "template_type", default: 1
    t.integer "locale", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "template_id"
    t.integer "account_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name", null: false
    t.string "display_name"
    t.string "email"
    t.json "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "pubsub_token"
    t.integer "availability", default: 0
    t.jsonb "ui_settings", default: {}
    t.jsonb "custom_attributes", default: {}
    t.string "type"
    t.text "message_signature"
    t.datetime "last_interaction_at"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "password_changed_at"
    t.index ["email"], name: "index_users_on_email"
    t.index ["password_changed_at"], name: "index_users_on_password_changed_at"
    t.index ["pubsub_token"], name: "index_users_on_pubsub_token", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.bigint "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  create_table "webhooks", force: :cascade do |t|
    t.integer "account_id"
    t.integer "inbox_id"
    t.string "url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "webhook_type", default: 0
    t.index ["account_id", "url"], name: "index_webhooks_on_account_id_and_url", unique: true
  end

  create_table "whatsapp_campaigns", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "campaign_tag_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_whatsapp_campaigns_on_account_id"
    t.index ["campaign_tag_id"], name: "index_whatsapp_campaigns_on_campaign_tag_id"
  end

  create_table "whatsapp_templates", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "working_hours", force: :cascade do |t|
    t.bigint "inbox_id"
    t.bigint "account_id"
    t.integer "day_of_week", null: false
    t.boolean "closed_all_day", default: false
    t.integer "open_hour"
    t.integer "open_minutes"
    t.integer "close_hour"
    t.integer "close_minutes"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "open_all_day", default: false
    t.index ["account_id"], name: "index_working_hours_on_account_id"
    t.index ["inbox_id"], name: "index_working_hours_on_inbox_id"
  end

  add_foreign_key "account_users", "accounts", on_delete: :cascade
  add_foreign_key "account_users", "users", on_delete: :cascade
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "agent_bots", "accounts", on_delete: :cascade
  add_foreign_key "campaign_deliveries", "accounts"
  add_foreign_key "campaign_deliveries", "campaigns"
  add_foreign_key "campaign_deliveries", "contacts"
  add_foreign_key "campaign_details", "accounts"
  add_foreign_key "campaign_details", "campaigns"
  add_foreign_key "campaign_devices", "campaigns"
  add_foreign_key "campaign_devices", "devices"
  add_foreign_key "campaign_global_control_groups", "campaigns"
  add_foreign_key "campaign_global_control_groups", "global_control_groups"
  add_foreign_key "campaign_schedulers", "accounts"
  add_foreign_key "campaign_syncs", "accounts"
  add_foreign_key "campaign_syncs", "campaigns"
  add_foreign_key "campaign_tags", "campaigns"
  add_foreign_key "campaign_tags", "group_tags"
  add_foreign_key "campaigns", "accounts", on_delete: :cascade
  add_foreign_key "campaigns", "inboxes", on_delete: :cascade
  add_foreign_key "contact_event_filters", "accounts"
  add_foreign_key "contact_event_filters", "campaigns"
  add_foreign_key "contact_inboxes", "contacts", on_delete: :cascade
  add_foreign_key "contact_inboxes", "inboxes", on_delete: :cascade
  add_foreign_key "contact_support_mails", "users"
  add_foreign_key "contacts", "import_users"
  add_foreign_key "conversations", "campaigns", on_delete: :cascade
  add_foreign_key "conversations", "contact_inboxes", on_delete: :cascade
  add_foreign_key "conversations", "teams", on_delete: :cascade
  add_foreign_key "csat_survey_responses", "accounts", on_delete: :cascade
  add_foreign_key "csat_survey_responses", "contacts", on_delete: :cascade
  add_foreign_key "csat_survey_responses", "conversations", on_delete: :cascade
  add_foreign_key "csat_survey_responses", "messages", on_delete: :cascade
  add_foreign_key "csat_survey_responses", "users", column: "assigned_agent_id", on_delete: :cascade
  add_foreign_key "data_imports", "accounts", on_delete: :cascade
  add_foreign_key "db_configurations", "accounts"
  add_foreign_key "devices", "accounts"
  add_foreign_key "devices", "contacts"
  add_foreign_key "email_campaigns", "accounts"
  add_foreign_key "email_campaigns", "campaign_tags"
  add_foreign_key "fc_dnd_setting_countries", "fc_dnd_settings"
  add_foreign_key "fc_dnd_settings", "accounts"
  add_foreign_key "global_control_groups", "accounts"
  add_foreign_key "import_file_segments", "account_users"
  add_foreign_key "import_file_segments", "segments"
  add_foreign_key "mentions", "conversations", on_delete: :cascade
  add_foreign_key "mentions", "users", on_delete: :cascade
  add_foreign_key "notes", "accounts", on_delete: :cascade
  add_foreign_key "notes", "contacts", on_delete: :cascade
  add_foreign_key "notes", "users", on_delete: :cascade
  add_foreign_key "report_schedulers", "accounts"
  add_foreign_key "s3_configurations", "accounts"
  add_foreign_key "segments", "accounts"
  add_foreign_key "sftp_configurations", "accounts"
  add_foreign_key "sms_campaigns", "accounts"
  add_foreign_key "sms_campaigns", "campaign_tags"
  add_foreign_key "team_members", "teams", on_delete: :cascade
  add_foreign_key "team_members", "users", on_delete: :cascade
  add_foreign_key "teams", "accounts", on_delete: :cascade
  add_foreign_key "whatsapp_campaigns", "accounts"
  add_foreign_key "whatsapp_campaigns", "campaign_tags"
  create_trigger("accounts_after_insert_row_tr", :generated => true, :compatibility => 1).
      on("accounts").
      after(:insert).
      for_each(:row) do
    "execute format('create sequence IF NOT EXISTS conv_dpid_seq_%s', NEW.id);"
  end

  create_trigger("conversations_before_insert_row_tr", :generated => true, :compatibility => 1).
      on("conversations").
      before(:insert).
      for_each(:row) do
    "NEW.display_id := nextval('conv_dpid_seq_' || NEW.account_id);"
  end

  create_trigger("camp_dpid_before_insert", :generated => true, :compatibility => 1).
      on("accounts").
      name("camp_dpid_before_insert").
      after(:insert).
      for_each(:row) do
    "execute format('create sequence IF NOT EXISTS camp_dpid_seq_%s', NEW.id);"
  end

  create_trigger("campaigns_before_insert_row_tr", :generated => true, :compatibility => 1).
      on("campaigns").
      before(:insert).
      for_each(:row) do
    "NEW.display_id := nextval('camp_dpid_seq_' || NEW.account_id);"
  end

end
