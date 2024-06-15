require 'nokogiri'
class SendImportFileSegmentJob < ApplicationJob
  queue_as :high
  def perform(ifs_id, invalid_csv_data, email)
    import_file_segment = ImportFileSegment.find(ifs_id)
    # call access_token api of microsoft graph for work with send mail api

    tenant_id = GlobalConfigService.load('GRAPH_TENANT_ID', 'common')
    token_url = "https://login.microsoftonline.com/#{tenant_id}/oauth2/v2.0/token"
    request_uri = URI(token_url)

    https = Net::HTTP.new(request_uri.host, request_uri.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(request_uri)
    request['Content-Type'] = 'application/x-www-form-urlencoded'
    params = { grant_type: 'client_credentials', client_id: ENV.fetch('GRAPH_CLIENT_ID', nil), scope: 'https://graph.microsoft.com/.default', client_secret: ENV.fetch('GRAPH_CLIENT_SECRET', nil) }
    request.body = URI.encode_www_form(params)
    api_response = https.request(request)
    response = JSON.parse(api_response.read_body)
    token_type = response['token_type']
    access_token = response['access_token']

    failed_scenarios_html_file = "<html>
                                    <head>
                                      <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' />
                                    </head>
                                    <body>
                                      <p>Dear #{email},</p>
                                      <p>It is to inform you that your recent import is #{import_file_segment&.status}!</p>
                                      <p>Number of Total Records: #{import_file_segment.total_users}</p>
                                      <p>Number of Added Records: #{import_file_segment.added_users}</p>
                                      <p>Number of Removed Records: #{import_file_segment.removed_users}</p>
                                      <p>Number of Invalid Records: #{import_file_segment.invalid_users}</p>
                                      <p>Import Date: #{import_file_segment.created_at}</p>
                                      <p>Please review and rectify the errors if error csv is attached.</p>
                                      <p>Thank you</p>
                                    </body>
                                  </html>"

    mailer_id = GlobalConfigService.load('MAILER_SENDER_EMAIL', 'common')
    send_mail_url = "https://graph.microsoft.com/v1.0/users/#{mailer_id}/sendMail"
    request_url = URI(send_mail_url)
    encoded = Base64.encode64(invalid_csv_data)
    https = Net::HTTP.new(request_url.host, request_url.port)
    https.use_ssl = true
    request = Net::HTTP::Post.new(request_url)
    request['Content-Type'] = 'application/json'
    request['Authorization'] = "#{token_type} #{access_token}"

    subject = "Import #{import_file_segment&.status&.titleize} - Your import is #{import_file_segment&.status}!"
    content = failed_scenarios_html_file
    file_name = 'failed_import_file_segment.csv'

    attachments = if import_file_segment.invalid_users.positive? || invalid_csv_data.include?('ERROR =>')
                    [{
                      '@odata.type': '#microsoft.graph.fileAttachment',
                      'name': file_name,
                      'contentType': 'text/plain',
                      'contentBytes': encoded.delete("\n").to_s
                    }]
                  else
                    []
                  end
    request.body = JSON.dump({
                               'message': {
                                 'subject': subject.to_s,
                                 'body': {
                                   'contentType': 'html',
                                   'content': content
                                 },
                                 'toRecipients': [
                                   {
                                     'emailAddress': {
                                       'address': email.to_s
                                     }
                                   }
                                 ],
                                 'attachments': attachments
                               },
                               'saveToSentItems': 'false'
                             })

    response = https.request(request)
    Rails.logger.info response
  rescue StandardError => e
    Rails.logger.error(e.message)
  end
end
