class Webhooks::ViberController < ActionController::API
  def process_payload
    Webhooks::ViberEventsJob.perform_later(params.to_unsafe_hash)
    head :ok
  end
end
