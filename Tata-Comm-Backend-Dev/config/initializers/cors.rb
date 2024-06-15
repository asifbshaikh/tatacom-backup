Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '*','https://engage-2-dev.tatacommunicationsdigo.io'
      resource '*', headers: :any, methods: [:options, :get, :post, :put, :delete, :patch], expose: ['expiry', 'uid', 'client', 'access-token']
    end
  end
