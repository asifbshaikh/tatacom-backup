json.array! @channels do |channel|
  json.inbox_id channel&.inbox&.id
  json.channel_id channel.id
  json.channel_name channel.channel_name
  if channel.name == "Email"
    ## Email Channel Attributes
    json.forward_to_email channel.forward_to_email
    json.email channel.email

    ## IMAP
    json.imap_email channel.imap_email
    json.imap_password channel.imap_password
    json.imap_address channel.imap_address
    json.imap_port channel.imap_port
    json.imap_enabled channel.imap_enabled
    json.imap_enable_ssl channel.imap_enable_ssl

    ## SMTP
    json.smtp_email channel.smtp_email
    json.smtp_password channel.smtp_password
    json.smtp_address channel.smtp_address
    json.smtp_port channel.smtp_port
    json.smtp_enabled channel.smtp_enabled
    json.smtp_domain channel.smtp_domain
    json.smtp_enable_ssl_tls channel.smtp_enable_ssl_tls
    json.smtp_enable_starttls_auto channel.smtp_enable_starttls_auto
    json.smtp_openssl_verify_mode channel.smtp_openssl_verify_mode
    json.smtp_auth_enable channel.smtp_auth_enable
    json.maximum_send_rate channel.maximum_send_rate
    json.unsubscribe_setting channel.unsubscribe_setting
    json.bounces_and_complaint_tracking channel.bounces_and_complaint_tracking
    json.smtp_protocol channel.smtp_protocol
    json.email_api_url channel.email_api_url
    json.email_api_key channel.email_api_key
  end

  ## TATA SMS Center

  if channel.name == "TataSmsc"
    json.auth_token channel.decrypt_auth_token
    json.medium channel.medium
    json.sender_id channel.sender_id
    json.sender_type channel.sender_type
    json.callback_url channel.callback_url
  end

  if channel.name == "Whatsapp"
    json.provider_config channel.provider_config
    json.phone_number channel.phone_number
  end
 end