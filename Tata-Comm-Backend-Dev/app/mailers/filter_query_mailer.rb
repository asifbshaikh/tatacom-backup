class FilterQueryMailer < ApplicationMailer
  def query_filter_rerun_success_email(email_id, segment_filter)
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
                                      <p>Dear User,</p>
                                      <p>It is to inform you that your recent filter query is completed successfully.</p>
                                      <p>Filter users count is: #{segment_filter.users_count}</p>
                                      <p>Total Reachable Users for This query is: #{segment_filter.total_reachable_users}</p>
                                      <p>Description: #{segment_filter.description}</p>
                                      <p>Query Run Date and Time: #{segment_filter.created_at}</p>
                                      <p>Last Refreshed Date and Time: #{segment_filter.last_refreshed_at}</p>
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

    subject = 'Query Completed Successfully'
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
                                       'address': email_id.to_s
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
