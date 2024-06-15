json.total_count @total_count
json.emails do
  json.array! @emails do |email|
    json.id email.id
    json.account_id email.account_id
    json.forward_to_email email.forward_to_email
    json.created_at email.created_at
    json.updated_at email.updated_at    
    json.smtp_enabled email.smtp_enabled
    json.host_name email.smtp_address
    json.port email.smtp_port
    json.smtp_user_name email.smtp_email
    json.smtp_password email.smtp_password
    json.smtp_domain email.smtp_domain
    json.smtp_enable_starttls_auto email.smtp_enable_starttls_auto
    json.smtp_authentication email.smtp_authentication
    json.smtp_openssl_verify_mode email.smtp_openssl_verify_mode
    json.smtp_enable_ssl_tls email.smtp_enable_ssl_tls
    json.protocol email.smtp_protocol
    json.smtp_auth_enable email.smtp_auth_enable
    json.maximum_send_rate email.maximum_send_rate
    json.unsubscribe_setting email.unsubscribe_setting
    json.bounces_and_complaint_tracking email.bounces_and_complaint_tracking      
  end
end