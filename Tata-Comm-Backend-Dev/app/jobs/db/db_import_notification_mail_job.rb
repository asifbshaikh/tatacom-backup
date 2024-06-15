require 'nokogiri'
class Db::DbImportNotificationMailJob < ApplicationJob
  queue_as :high
  def perform(email_id, db_schedule_id, status, failed_events_data, failed_errors)
    db_schedule = DbScheduleDetail.find(db_schedule_id)
    subject = status ? 'DB import success notfication' : 'DB import failed notification'
    token_type, access_token = fetch_access_token

    # call send mail api for reaching customer care
    mailer_id = GlobalConfigService.load('MAILER_SENDER_EMAIL', 'common')
    send_mail_url = "#{MAIL_URL}/#{mailer_id}/sendMail"
    request_url = URI(send_mail_url)

    encoded = Base64.encode64(failed_events_data) if failed_events_data.present?
    https = Net::HTTP.new(request_url.host, request_url.port)
    https.use_ssl = true
    request = Net::HTTP::Post.new(request_url)
    request['Content-Type'] = 'application/json'
    request['Authorization'] = "#{token_type} #{access_token}"
    # Render the HTML template
    content = ApplicationController.render(
      template: 'mail_templates/db_import_mail',
      layout: false,
      locals: { status: status, import_name: db_schedule.import_name, salutation: email_id, failed_errors: failed_errors }
    )

    file_name = 'failed_events.txt' if failed_events_data.present?

    if failed_events_data.present?
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
                                  "attachments": [
                                    {
                                      "@odata.type": "#microsoft.graph.fileAttachment",
                                      "name": file_name,
                                      "contentType": "text/plain",
                                      "contentBytes": "#{encoded.gsub(/\n/,"")}"
                                    }
                                  ]
                                },
                                'saveToSentItems': 'false'
                              })
    else
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
                                  ]
                                },
                                'saveToSentItems': 'false'
                              })
    end
    https.request(request)
  rescue StandardError => e
    Rails.logger.info "****************************** DbImportMailJob: #{e.message} *******************************"
  end

  def fetch_access_token
    # call access_token api of microsoft graph for work with send mail api
    tenant_id = GlobalConfigService.load('GRAPH_TENANT_ID', 'common')
    request_uri = URI("https://login.microsoftonline.com/#{tenant_id}/oauth2/v2.0/token")

    https = Net::HTTP.new(request_uri.host, request_uri.port)
    https.use_ssl = true
    request = Net::HTTP::Get.new(request_uri)
    request['Content-Type'] = 'application/x-www-form-urlencoded'
    params = { grant_type: 'client_credentials', client_id: ENV.fetch('GRAPH_CLIENT_ID', nil), scope: 'https://graph.microsoft.com/.default', client_secret: ENV.fetch('GRAPH_CLIENT_SECRET', nil) }
    request.body = URI.encode_www_form(params)
    api_response = https.request(request)
    response = JSON.parse(api_response.read_body)
    [response['token_type'], response['access_token']]
  end
end
