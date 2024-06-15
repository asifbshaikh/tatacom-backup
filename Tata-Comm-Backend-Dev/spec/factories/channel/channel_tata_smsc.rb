FactoryBot.define do
  factory :channel_tata_smsc, class: 'Channel::TataSmsc'  do
    auth_token { 'Basic dGNsLXRyaWFscG9zdG1hbnJlc3RkaXJlY3RteHByZWZlbnRlcnByaXNlOkJ0WFFmOXpF' }
    medium { 'tata'}
    sender_id { 12345 }
    sender_type { ["promotional", "transactional"].sample }
    account

    after(:create) do |channel_tata_smsc|
      create(:inbox, channel: channel_tata_smsc, account: channel_tata_smsc.account)
    end
  end
end
