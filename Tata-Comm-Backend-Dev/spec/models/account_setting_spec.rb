require 'rails_helper'

RSpec.describe AccountSetting, type: :model do
  let(:account) { create(:account) }
  it { is_expected.to validate_presence_of(:app_id) }
  it { is_expected.to validate_presence_of(:account_id) }

  describe 'validations' do
    it { should validate_presence_of(:account_id) }
    it { should validate_presence_of(:app_id) }
  end

  describe 'associations' do
    it { should belong_to(:account) }
  end

  describe '.authenticate!' do
    it 'returns the account setting when valid credentials are provided' do
      account_setting = create(:account_setting, account: account)
      authenticated_setting = AccountSetting.authenticate!(account_setting.app_id, account_setting.account_id)
      expect(authenticated_setting).to eq(account_setting)
    end
  end

  describe 'JSON serialization' do
    it 'includes only app_id and account_id' do
      account_setting = create(:account_setting, account: account)
      json_data = account_setting.as_json
      expect(json_data.keys).to contain_exactly('app_id', 'account_id')
    end
  end
end
