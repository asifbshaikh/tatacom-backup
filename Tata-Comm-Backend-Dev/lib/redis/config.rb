module Redis::Config
  DEFAULT_SENTINEL_PORT ||= '26379'.freeze
  class << self
    def app
      config
    end

    def config
      @config ||= sentinel? ? sentinel_config : base_config
      tls? ? @config.merge!(tls_config) : @config
    end

    def base_config
      {
        host: ENV.fetch("REDIS_HOST_#{Rails.env.upcase}", '127.0.0.1'),
        port: ENV.fetch("REDIS_PORT_#{Rails.env.upcase}", '6379'),
        password: ENV.fetch("REDIS_PASSWORD_#{Rails.env.upcase}", nil).presence,
        reconnect_attempts: 2,
        network_timeout: 5
      }
    end

    def tls?
      ENV.fetch("REDIS_SSL_#{Rails.env.upcase}", nil).presence
    end

    def sentinel?
      ENV.fetch('REDIS_SENTINELS', nil).presence
    end

    def sentinel_config
      redis_sentinels = ENV.fetch('REDIS_SENTINELS', nil)

      # expected format for REDIS_SENTINELS url string is host1:port1, host2:port2
      sentinels = redis_sentinels.split(',').map do |sentinel_url|
        host, port = sentinel_url.split(':').map(&:strip)
        { host: host, port: port.presence || DEFAULT_SENTINEL_PORT, password: base_config[:password] }
      end

      # over-write redis url as redis://:<your-redis-password>@<master-name>/ when using sentinel
      # more at https://github.com/redis/redis-rb/issues/531#issuecomment-263501322
      master = "redis://#{ENV.fetch('REDIS_SENTINEL_MASTER_NAME', 'mymaster')}"

      base_config.merge({ url: master, sentinels: sentinels })
    end

    def tls_config
      {
        ssl: ENV.fetch("REDIS_SSL_#{Rails.env.upcase}", false),
        ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
      }
    end
  end
end
