module CommanSharedMethods
  extend ActiveSupport::Concern

  def generate_tiny_url(campaign, message)
    response = { message: message }
    return response if campaign.campaignable.tiny_urls.count.positive?

    urls = URI.extract(message, ['https', 'http', 'www'])
    urls.each do |url|
      tiny_url_api = TinyUrlApi.new.generate_tiny_url(url, nil)
      if tiny_url_api['statusCode'] == 200
        response['tiny_url'] = tiny_url_api['shorturl']
        response['message'] = message.gsub!(url, response['tiny_url'])
      end
      # considering every message will contain only one tiny url for personalise
    end
    response
  end
end
