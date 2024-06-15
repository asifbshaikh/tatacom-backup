require 'nokogiri'
class SendImportUsersMailJob < ApplicationJob
  queue_as :high
  def perform(import_user, duplicate_records, attachment_data, failed_instances, error_message, is_skipped_records)

    # call access_token api of microsoft graph for work with send mail api

    tenant_id = GlobalConfigService.load('GRAPH_TENANT_ID', 'common')
    token_url = "https://login.microsoftonline.com/#{tenant_id}/oauth2/v2.0/token"
    request_uri = URI(token_url)
    
    https = Net::HTTP.new(request_uri.host, request_uri.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(request_uri)
    request["Content-Type"] = "application/x-www-form-urlencoded"
    params = {:grant_type=>"client_credentials", :client_id=>ENV["GRAPH_CLIENT_ID"], :scope=>"https://graph.microsoft.com/.default", :client_secret=>ENV["GRAPH_CLIENT_SECRET"]}
    request.body =  URI.encode_www_form(params)
    api_response = https.request(request)
    response = JSON.parse(api_response.read_body)
    token_type = response["token_type"]
    access_token = response["access_token"]
    
    # call send mail api for send mail to user of duplicate records
    duplicate_records_html_file = "<!DOCTYPE html><html><head><meta content='text/html; charset=UTF-8' http-equiv='Content-Type' /></head><body><p>Dear #{import_user.account_user.user.name},</p><p>We’ve identified duplicate records in your recent import.</p><p>Note: System cannot update any of the duplicate records.</p><p>Number of Duplicates: #{duplicate_records&.count}</p><p>Import Date: #{import_user.created_at}</p><p>Please review and rectify the duplicates to ensure data accuracy.</p><p>Thank you</p></body></html>" 

    skipped_records_html_file = "<!DOCTYPE html><html><head><meta content='text/html; charset=UTF-8' http-equiv='Content-Type' /></head><body><p>Dear #{import_user.account_user.user.name},</p><p>We’ve identified skipped records in your recent import due to update existing records option is selected.</p><p>Note: System cannot update any of the skipped records.</p><p>Number of skipped records: #{failed_instances&.count}</p><p>Import Date: #{import_user.created_at}</p><p>Please review and rectify the skipped records to ensure data accuracy.</p><p>Thank you</p></body></html>" 

    if error_message&.any?
      errors_html = ""
      errors_html += "<ul>" 
      error_message.each do |error_msg|
        errors_html += "<li>#{error_msg}</li>"
      end
      errors_html += "</ul>"
    else
      errors_html = "<p>No errors were encountered during import</p>"
    end

    failed_scenarios_html_file = "<html><head>  <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' /></head><body><p>Dear #{import_user.account_user.user.name},</p><p>It is to inform you that your recent import encountered an error and could not be completed successfully. Below are the error details.</p><p>Error Message: </p>#{errors_html}<p>Import Date: #{import_user.created_at}</p><p>Please review and rectify the errors.</p><p>Thank you</p></body></html>"

    mailer_id = GlobalConfigService.load('MAILER_SENDER_EMAIL', 'common')
    send_mail_url = "https://graph.microsoft.com/v1.0/users/#{mailer_id}/sendMail"
    request_url = URI(send_mail_url)

    encoded = Base64.encode64(attachment_data)
    https = Net::HTTP.new(request_url.host, request_url.port)
    https.use_ssl = true
    request = Net::HTTP::Post.new(request_url)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "#{token_type} #{access_token}"

    if duplicate_records.present?
      subject = "Duplicate Records detected in your recent import"
      content = duplicate_records_html_file
      file_name = "duplicate_import_users.txt"
    elsif is_skipped_records == true
      subject = "Some records Skipped in your current import."
      content = skipped_records_html_file
      file_name = "skipped_records_import_users.txt"
    elsif error_message.present?
      subject = "Import failed - Error details inside"
      content = failed_scenarios_html_file
      file_name = "failed_import_users.txt"    
    end

    request.body = JSON.dump({
      "message": {
        "subject": "#{subject}",
        "body": {
          "contentType": "html",
          "content": content
        },
        "toRecipients": [
          {
            "emailAddress": {
              "address": "#{import_user&.account_user&.user&.email}"
            }
          }
        ],
        "attachments": [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            "name": file_name,
            "contentType": "text/plain",
            "contentBytes": "#{encoded.gsub(/\n/,"")}"
          }
        ]
      },
      "saveToSentItems": "false"
    })

    response = https.request(request)
    
    Rails.logger.info "********************** Please find the microsoft graph api response for sending mail: #{response.code} ***************************"
  end
end