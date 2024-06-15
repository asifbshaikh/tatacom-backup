class ExportContactsMailer < ApplicationMailer
  def send_exported_contacts_file_email(user_email, username, file_url)

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
                                      <h2>Subject: Your export contacts file is completed.</h2>
                                      <p>Dear #{username},</p>
                                      <p>It is to inform you that the report for export contacts file you started is completed. Please click on the below link to download the file.</p>

                                      <p></p>
                                      <a href=#{file_url} target='_blank'>Click to download file</a>

                                      <p>Thank you</p>
                                    </body>
                                  </html>"

    mailer_id = GlobalConfigService.load('MAILER_SENDER_EMAIL', 'common')
    send_mail_url = "https://graph.microsoft.com/v1.0/users/#{mailer_id}/sendMail"
    request_url = URI(send_mail_url)

    https = Net::HTTP.new(request_url.host, request_url.port)
    https.use_ssl = true
    request = Net::HTTP::Post.new(request_url)
    request['Content-Type'] = 'application/json'
    request['Authorization'] = "#{token_type} #{access_token}"
    subject = "Segment export successful"
    content = failed_scenarios_html_file

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
                                       'address': user_email.to_s
                                     }
                                   }
                                 ],
                                 'attachments': []
                               },
                               'saveToSentItems': 'false'
                             })
    email_response = https.request(request)
    Rails.logger.info email_response
  rescue StandardError => e
    Rails.logger.error(e.message)
  end
end
