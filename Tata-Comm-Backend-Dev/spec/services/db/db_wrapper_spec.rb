require 'rails_helper'

describe Db::DbWrapper do
  let!(:account) { create(:account) }
  let!(:db_configuration) { create(:db_configuration, account_id: account.id) }

  describe '#establish_class_connection' do
    it 'establishes the connection to new db in parallel to main db' do
      expect(ActiveRecord::Base.connection_handler.connection_pools.count).to eq(1) # Active connection count before establishing new connection
      described_class.new(db_configuration, db_configuration.name).establish_class_connection
      expect(ActiveRecord::Base.connection_handler.connection_pools.count).to eq(2) # Active connection count after establishing new connection
    end
  end
end
