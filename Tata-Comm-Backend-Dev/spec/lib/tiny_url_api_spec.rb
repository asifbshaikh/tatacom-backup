require 'rails_helper'

describe TinyUrlApi do
  let(:url) { 'https://www.example.com/RANDOM_KEYWORDS' }
  let(:keyword) { '1a2b3' }
  let(:shorturl) { 'https://su.digo.link/marutisuzuki2' }
  let(:tiny_url_api) { described_class.new }
  let!(:generate_response_body) do
    '{
                          "url": {
                              "keyword": "RANDOM_KEYWORDS", "url": "https://www.marutisuzuki.com/channels/arena/all-cars",
                              "title": "https://www.marutisuzuki.com/channels/arena/all-cars", "date": "2023-08-14 16:34:22",
                              "ip": "0.0.0.0"
                            },
                          "status": "success", "message": "https://www.example.com/RANDOM_KEYWORDS added to database",
                          "title": "https://www.example.com/RANDOM_KEYWORDS", "shorturl": "https://su.digo.link/RANDOM_KEYWORDS",
                          "statusCode": 200
                        }'
  end

  let(:get_tracking_response) do
    '{  "statusCode": 200,
                                    "message": "success",
                                    "link": {
                                      "shorturl": "https://su.digo.link/marutisuzuki2",
                                      "url": "https://www.marutisuzuki.com/channels/arena/all-cars",
                                      "title": "https://www.marutisuzuki.com/channels/arena/all-cars",
                                      "clicks": "1",
                                      "OS": "Linux",
                                      "country": "US",
                                      "IP": "165.225.124.241",
                                      "click_time": "2023-08-16 06:48:35"
                                    }
                                }'
  end

  context 'when calling external tiny url api' do
    it 'generates the tiny_url' do
      allow(tiny_url_api).to receive(:generate_tiny_url).with(url, keyword).and_return(generate_response_body)
    end

    it 'gets the shorturl tracking report' do
      allow(tiny_url_api).to receive(:shorturl_tracking_report).with(shorturl).and_return(get_tracking_response)
    end
  end
end
