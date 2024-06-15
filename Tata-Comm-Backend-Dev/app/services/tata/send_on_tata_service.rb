class Tata::SendOnTataService < Base::SendOnChannelService
  private

  def channel_class
    # Channel::ChannelTataSm
    Channel::Tata
  end

  def getURI
    # 'https://sms.tatacommunications.com/mmx/v1/messaging/sms'
    "https://engage-api.digo.link/v1/messaging/sms"
  end

  def getData
    @toSend = {
      'to' => contact_inbox.source_id,
      'from' => channel.phone_number,
      'msg' => message.content,
      # 'tlv' => {
      #   'PE_ID' => '0',
      #   'TEMPLATE_ID' => '0',
      #   'TELEMARKETER_ID' => '0'
      # }
      'type' => "transactional",
      'dlr' => {
        'mask' => 1,
        'url' => inbox.callback_webhook_url
      }
    }

    @toSend.to_json
  end

  def perform_reply
    uri = URI.parse(getURI)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    # req = Net::HTTP::Post.new(uri.path, initheader = { 'Content-Type' => 'application/json' })
    req = Net::HTTP::Post.new(uri.path, initheader = {
      'Content-Type' => 'application/json',
      'Authorization' => "Bearer #{channel.token}",
      'X-Authorization' => "Basic #{Base64.strict_encode64(channel.app_id + ":" + channel.ss_key)}"
    })
    req.body = getData
    # req.basic_auth channel.appID, channel.ssKey
    res = https.request(req)
    message.update!(source_id: JSON.parse(res.body)['id'])
  end

  def attachments
    message.attachments.map(&:file_url)
  end

  def inbox
    @inbox ||= message.inbox
  end

  def channel
    @channel ||= inbox.channel
  end

  def outgoing_message?
    message.outgoing? || message.template?
  end
end
