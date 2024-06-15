class Webhooks::KakaoController < ActionController::API
  def process_payload
    Webhooks::KakaoEventsJob.perform_later(params.to_unsafe_hash)
    head :ok
  end
end
