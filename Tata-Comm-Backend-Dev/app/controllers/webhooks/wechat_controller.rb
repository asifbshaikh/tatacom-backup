class Webhooks::WechatController < ActionController::API
  def process_payload
    Webhooks::WechatEventsJob.perform_later(params.to_unsafe_hash)
    head :ok
  end
end
