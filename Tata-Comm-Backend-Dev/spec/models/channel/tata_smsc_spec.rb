require 'rails_helper'

RSpec.describe Channel::TataSmsc do
  let!(:random_hax) { Random.hex(32) }
  let!(:account) { create(:account) }
  let!(:tata_smsc) { create(:channel_tata_smsc, auth_token: random_hax, account: account) }

  it { is_expected.to validate_presence_of(:auth_token) }
  it { is_expected.to validate_presence_of(:sender_id) }

  context 'create tata_smsc' do
    it 'returns tata_smsc' do
      tata_smsc
    end
  end

  context 'update tata_smsc' do
    let!(:tata_smsc1) { build(:channel_tata_smsc, auth_token: random_hax, sender_id: 123321, account: account) }
    it 'encrypts tata_smsc auth_token' do
      expect(tata_smsc1.auth_token).to eq(random_hax)
      tata_smsc1.save!
      expect(tata_smsc1.auth_token).not_to eq(random_hax)
    end

    it 'encrypts tata_smsc auth_token' do
      tata_smsc1.save!
      expect(tata_smsc1.decrypt_auth_token).to eq(random_hax)
    end
  end
end
