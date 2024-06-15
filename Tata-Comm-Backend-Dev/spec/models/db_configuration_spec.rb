require 'rails_helper'

RSpec.describe DbConfiguration do
  let(:account) { create(:account) }
  let(:db_configuration) { build(:db_configuration, account: account) }
  let(:db_params) do
    {
      name: 'test_db',
      adapter: 'postgresql',
      encoding: 'unicode',
      host: 'db-test.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
      username: 'postgres',
      database: 'dev_tes',
      password: 'abcd!1234!',
      port: '5432'
    }.as_json
  end

  context 'validate associations' do
    it { is_expected.to belong_to(:account) }
  end

  describe '.validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:adapter) }
    it { is_expected.to validate_presence_of(:encoding) }
    it { is_expected.to validate_presence_of(:host) }
    it { is_expected.to validate_presence_of(:username) }
    it { is_expected.to validate_presence_of(:database) }
    it { is_expected.to validate_presence_of(:password) }
    it { is_expected.to validate_presence_of(:port) }
    it { is_expected.to validate_presence_of(:account_id) }
  end

  context 'runs before_save' do
    it 'preserves it' do
      db_config = db_configuration
      expect { db_config.save }.to(change { db_config.host })
    end
  end

  context 'validate instance methods' do
    before do
      @db_config = account.db_configurations.create(db_params)
    end

    it 'returns dcrypted host' do
      expect(@db_config.decrypted_host).to eq(db_params['host'])
      @db_config.host = SecureRandom.uuid
      expect(@db_config.decrypted_host).not_to eq(db_params['host'])
    end

    it 'returns dcrypted username' do
      expect(@db_config.decrypted_username).to eq(db_params['username'])
      @db_config.username = SecureRandom.uuid
      expect(@db_config.decrypted_username).not_to eq(db_params['username'])
    end

    it 'returns dcrypted password' do
      expect(@db_config.decrypted_password).to eq(db_params['password'])
      @db_config.password = SecureRandom.uuid
      expect(@db_config.decrypted_password).not_to eq(db_params['password'])
    end

    it 'returns dcrypted database' do
      expect(@db_config.decrypted_database).to eq(db_params['database'])
      @db_config.database = SecureRandom.uuid
      expect(@db_config.decrypted_database).not_to eq(db_params['database'])
    end
  end
end
