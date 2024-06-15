class TinyUrlClickReportJob
  include Sidekiq::Worker
  include CampaignSchedulable
  queue_as :high

  def perform(id)
    campaign = Campaign.find_by(id: id)
    campaign_deliveries = campaign&.campaign_deliveries&.where(clicked: false).where.not(tiny_url: nil)
    campaign_deliveries.each do |camp_delivery|
      url = camp_delivery.tiny_url
      response = TinyUrlApi.new.shorturl_tracking_report(url)
      update_clicks(response, camp_delivery)
    end
    campaign.campaign_sync.update(status: 2, last_run_at: Time.zone.now)
    trigger_email(campaign)
  end

  def trigger_email(campaign)
    fetch_account_user_email = fetch_account_user(campaign)
    body = html_template
    email_content = { to: [fetch_account_user_email.to_s], subject: 'Tiny Url Click Report', body: body }
    send_email = Mail::Message.new(email_content)
    RestMail.new.deliver!(send_email)
  end

  def fetch_account_user(campaign)
    account_id = campaign&.account&.id
    AccountUser.where(account_id: account_id).first.user.email
  end

  def html_template
    "<!DOCTYPE html><html><head><meta content='text/html; charset=UTF-8' http-equiv='Content-Type' /></head><body><p>Dear User</p><p> Report has been generated.</p><p>Thank you</p></body></html>"
  end

  def update_clicks(response, campaign_delivery)
    return unless response['statusCode'] == 200

    click_count = begin
      response['link']['clicks'].to_i
    rescue StandardError
      0
    end
    return unless click_count.positive?

    campaign_delivery.update(clicked: true)
    create_click_event(campaign_delivery)
  end

  def create_click_event(campaign_delivery)
    create_contact_common_events(CLICKED, campaign_delivery, WHATSAPP) # To create contact events for triggered campaign only for click events of whatsapp
  end
end
