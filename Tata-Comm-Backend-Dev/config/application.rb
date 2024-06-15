# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'
require_relative '../app/logging/log_formatter'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Tring
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.eager_load_paths << Rails.root.join('lib')
    config.eager_load_paths << Rails.root.join('enterprise/lib')
    # rubocop:disable Rails/FilePath
    config.eager_load_paths += Dir["#{Rails.root}/enterprise/app/**"]
    # rubocop:enable Rails/FilePath

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    config.generators.javascripts = false
    config.generators.stylesheets = false
    config.active_record.yaml_column_permitted_classes = [ActiveSupport::HashWithIndifferentAccess, Symbol, Date, Time, ActiveSupport::TimeWithZone, ActiveSupport::TimeZone]

    # Log formatter
    config.log_formatter = LogFormatter.new

    # Custom tring configurations
    config.x = config_for(:app).with_indifferent_access

    config.encoding = 'utf-8'
  end

  def self.config
    @config ||= Rails.configuration.x
  end
end
