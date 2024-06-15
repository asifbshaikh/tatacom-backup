require 'uri'
require 'net/http'

class TinyUrlApi
  TINY_URL_BASE_LINK = ENV.fetch('TINY_URL_BASE_LINK', nil)

  def initialize
    @username = ENV.fetch('TINY_URL_USERNAME', nil)
    @password = ENV.fetch('TINY_URL_PASSWORD', nil)
  end

  def generate_tiny_url(url, keyword)
    uri = URI.parse(TINY_URL_BASE_LINK)
    resp = Net::HTTP.post_form(uri, generate_api_params(url, keyword))
    if resp.is_a?(Net::HTTPSuccess)
      JSON.parse(resp.body)
    else
      { message: resp.body }
    end
  end

  def shorturl_tracking_report(shorturl)
    uri = URI.parse(TINY_URL_BASE_LINK)
    resp = Net::HTTP.post_form(uri, get_short_url_params(shorturl))
    if resp.is_a?(Net::HTTPSuccess)
      JSON.parse(resp.body)
    else
      failure_response
    end
  end

  private

  def generate_api_params(url, keyword)
    {
      'url': url,
      'format': 'json',
      'action': 'shorturl',
      'username': @username,
      'password': @password,
      'keyword': keyword
    }
  end

  def get_short_url_params(shorturl)
    {
      'shorturl': shorturl,
      'format': 'json',
      'action': 'url-stats-countries',
      'username': @username,
      'password': @password
    }
  end

  def failure_response
    { status: 'fail', message: 'Something went wrong, please try again', statusCode: 422 }
  end
end
