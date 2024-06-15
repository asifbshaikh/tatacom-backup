require 'nokogiri'
class ContactSupportMailJob < ApplicationJob
  queue_as :high
  def perform(email_options)
    contact_support_mail = email_options[:contact_support_mail]
    user_mail = email_options[:user_mail]
    token_type, access_token = fetch_access_token

    # call send mail api for reaching customer care
    mailer_id = GlobalConfigService.load('MAILER_SENDER_EMAIL', 'common')
    send_mail_url = "#{MAIL_URL}/#{mailer_id}/sendMail"
    request_url = URI(send_mail_url)

    https = Net::HTTP.new(request_url.host, request_url.port)
    https.use_ssl = true
    request = Net::HTTP::Post.new(request_url)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "#{token_type} #{access_token}"

    # Render the HTML template
    content = ApplicationController.render(
      template: 'mail_templates/contact_support_mail',
      layout: false,
      locals: { user_mail: user_mail, id: contact_support_mail.id, description: contact_support_mail.description }
    )

    attachments = prepare_attachments(contact_support_mail)

    cc_recipients = contact_support_mail.cc_users
    bcc_recipients = contact_support_mail.bcc_users
    request.body = JSON.dump({
                               "message": {
                                 "subject": "#{contact_support_mail.subject}",
                                 "body": {
                                   "contentType": "html",
                                   "content": content
                                 },
                                 "toRecipients": [
                                   {
                                     "emailAddress": {
                                       "address": "#{user_mail}"
                                     }
                                   }
                                 ],
                                 "ccRecipients": cc_recipients.map { |cc| { "emailAddress": { "address": cc } } },
                                 "bccRecipients": bcc_recipients.map { |bcc| { "emailAddress": { "address": bcc } } },
                                 "attachments": attachments
                               },
                               "saveToSentItems": "false"
                             })

    response = https.request(request)
  rescue StandardError => e
    Rails.logger.info "****************************** ContactSupportMailJob: #{e.message} *******************************"
  end

  def fetch_access_token
    # call access_token api of microsoft graph for work with send mail api
    tenant_id = GlobalConfigService.load('GRAPH_TENANT_ID', 'common')
    request_uri = URI("https://login.microsoftonline.com/#{tenant_id}/oauth2/v2.0/token")

    https = Net::HTTP.new(request_uri.host, request_uri.port)
    https.use_ssl = true
    request = Net::HTTP::Get.new(request_uri)
    request["Content-Type"] = "application/x-www-form-urlencoded"
    params = { :grant_type => "client_credentials", :client_id => ENV["GRAPH_CLIENT_ID"], :scope => "https://graph.microsoft.com/.default", :client_secret => ENV["GRAPH_CLIENT_SECRET"] }
    request.body = URI.encode_www_form(params)
    api_response = https.request(request)
    response = JSON.parse(api_response.read_body)
    [response["token_type"], response["access_token"]]
  end

  def prepare_attachments(contact_support_mail)
    attachments = []
    if contact_support_mail.attachment_file.present?
      encoded = Base64.strict_encode64(contact_support_mail.attachment_file.download)
      encoded = encoded.gsub(/\n/, "") if encoded.present?
      file_name = contact_support_mail.attachment_file.blob.filename.to_s
      attachments <<
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          "name": file_name,
          "contentType": "text/plain",
          "contentBytes": encoded
        }
    end
    attachments
  end
end
