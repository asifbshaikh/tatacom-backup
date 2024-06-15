class LogFormatter < ActiveSupport::Logger::SimpleFormatter
  def call(severity, timestamp, _progname, message)
    instance = ENV.fetch('MACHINE_SET', 'QA')
    "#{timestamp.to_formatted_s(:db)} [#{instance}-#{Rails.env}] [#{severity}] #{message}\n"
  end
end