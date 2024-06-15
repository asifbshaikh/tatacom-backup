class RestMail
    # initialize is called with the settings provided from your config
    def initialize(settings = nil)
      @settings = settings
    end

    # Ref (Mail::Sendmail, Mail::FileDelivery, Mail::SMTP, etc)
    def deliver!(mail)
      token = ::Redis::Alfred.get("GRAPH_API_TOKEN") || get_access_token
      Rails.logger.info "got access token for GraphAPI Mail"
      ::Redis::Alfred.set("GRAPH_API_TOKEN", token)

      send_email(token, mail)
    end

    def rest_client
      @client ||= MyRestClient.new(@settings)
    end

    # get the graphapi access token
    def get_access_token

      url = URI.parse("https://login.microsoftonline.com/"+GlobalConfigService.load('GRAPH_TENANT_ID', 'common')+"/oauth2/v2.0/token")
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = (url.scheme == "https")

      req = Net::HTTP::Post.new(url.request_uri)
      req.set_form_data({
          'client_id' => GlobalConfigService.load('GRAPH_CLIENT_ID', 'NA'),
          'client_secret' => GlobalConfigService.load('GRAPH_CLIENT_SECRET', 'NA'),
          'grant_type' => 'client_credentials',
          'scope' => 'https://graph.microsoft.com/.default'
      })
      response = http.request(req)
      Rails.logger.info "graph api token response status code:    #{response.code}";
      if response.code.to_s == '200'
          JSON.parse(response.read_body)['access_token']
      else
        Rails.logger.info "GRAPH_API_FAILED_TOKEN_GENERATE #{response.body}"
      end
    end

    # call the graphapi mail
    def send_email(token, mail)
      params = {
        email: mail.to.first,
        subject: mail.subject,
        # content: mail.body.encoded,
        # content: mail.body.raw_source
        content: (mail.text_part || mail.html_part || mail).body.decoded
        # content: mail.html_part.body.decoded,
      }

      url = URI.parse("https://graph.microsoft.com/v1.0/users/"+GlobalConfigService.load('MAILER_SENDER_EMAIL', 'common')+"/sendMail")
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = (url.scheme == "https")
      req = Net::HTTP::Post.new(url.request_uri)
      req["Authorization"] = "Bearer #{token}"
      req["Content-type"] = "application/json"
      Rails.logger.info "Graph mail will be sent to #{params[:email]}"
      req.body = {
        "message": {
          "subject": params[:subject],
            "body": {
                "contentType": "html",
                "content": params[:content]
            },
            "toRecipients": [
                  {
                      "emailAddress": {
                          "address": params[:email]
                      }
                  }
            ]
        },
        "saveToSentItems": "true"
      }.to_json

      response = http.request(req)

      Rails.logger.info "response status code for send email api #{response.code}"

      if (response.code.to_s == '401') && ::Redis::Alfred.get("GRAPH_API_TOKEN")
        ::Redis::Alfred.delete("GRAPH_API_TOKEN")
        # delete expired token from redis, call again `deliver` only one time
        Rails.logger.info "GRAPH_API_FAILED_TOKEN_EXPIRED, recall the `deliver` process (once) #{response.body}"
        deliver!(mail)
      elsif response.code.to_s == '202'
        Rails.logger.info "GRAPH_API_MAIL_SENT, #{response.body}"
      elsif response.code.to_s != '200'
        Rails.logger.info "GRAPH_API_FAILED_MAIL, #{response.body}"
      end
    end

  end