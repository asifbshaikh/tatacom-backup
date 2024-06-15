class Tata::WebhookSetupService
  include Rails.application.routes.url_helpers

  pattr_initialize [:inbox!]

  def perform
    if phone_numbers.empty?
      Rails.logger.info "TATA_PHONE_NUMBER_NOT_FOUND: #{channel.phone_number}"
    else
      tata_client
        .incoming_phone_numbers(phonenumber_sid)
        .update(sms_method: 'POST', sms_url: tata_callback_index_url)
    end
  rescue Tata::REST::TataError => e
    Rails.logger.info "TATA_FAILURE: #{e.message}"
  end

  private

  def phonenumber_sid
    phone_numbers.first.sid
  end

  def phone_numbers
    @phone_numbers ||= tata_client.incoming_phone_numbers.list(phone_number: channel.phone_number)
  end

  def channel
    @channel ||= inbox.channel
  end

  def tata_client
    @tata_client ||= ::Tata::REST::Client.new(channel.account_sid, channel.auth_token)
  end
end
