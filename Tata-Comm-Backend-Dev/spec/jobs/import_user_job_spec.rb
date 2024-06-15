require 'rails_helper'

RSpec.describe ImportUserJob, type: :job do
  include ActiveJob::TestHelper

  let!(:account) { create(:account) }
  let!(:user) { create(:user, name: "test101@gmail.com", email: "test101@gmail.com") }
  let!(:agent) { create(:user, role: :agent, name: "test02@gmail.com", email: "test02@gmail.com") }
  let!(:account_user) { create(:account_user, account: account, user: user, role: 'agent') }
  let(:import_user) { create(:import_user, account_id: account.id, account_user_id: account_user.id, status: 'created', user_type: 'registered', has_header: true) }

  subject(:job) { described_class.perform_now(import_user) }

  describe 'import user queue size and queue type' do
    context 'when import user job enqueued it should increse the size and check name of queue' do 
      it 'queues the job' do
        expect { job }
          .to change(ActiveJob::Base.queue_adapter.enqueued_jobs, :size).by(1)
      end

      it 'is in high queue' do
        expect(ImportUserJob.new.queue_name).to eq('high')
      end
    end
  end

  describe '#perform' do
    context 'when import user status is "created" and user type is "registered" with header' do      

      it 'updates status to "processing" before processing' do
        expect(import_user.status).to eq('created')        
        expect { ImportUserJob.perform_now(import_user) }.to change { import_user.reload.status }.to eq('processing').or eq('completed')
      end

      it 'updates status to "completed" after processing' do
        ImportUserJob.perform_now(import_user)
        expect(import_user.reload.status).to eq('completed')
      end
    end

    context 'when import user status is "created" and user type is "anonymous" ' do
      let(:import_user) { create(:import_user, account_id: account.id, account_user_id: account_user.id, status: 'created', user_type: 'anonymous', has_header: true) }

      it 'updates status to "processing" before processing' do
        expect(import_user.status).to eq('created')
        expect { ImportUserJob.perform_now(import_user) }.to change { import_user.reload.status }.to eq('processing').or eq('completed')
      end

      it 'updates status to "completed" after processing' do
        ImportUserJob.perform_now(import_user)
        expect(import_user.reload.status).to eq('completed')
      end
    end

    context 'when import user update_existing_user option is true' do
      let(:import_user) { create(:import_user, account_id: account.id, account_user_id: account_user.id, status: 'created', user_type: 'anonymous', has_header: true, update_existing_user: false, col_types: JSON.parse({"1"=>{"first_name"=>"string"}, "2"=>{"last_name"=>"string"}, "3"=>{"email"=>"string"}, "4"=>{"phone_number"=>"string"}}.to_json), skipped_col: [0, 2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40])}


      it 'updates status to "processing" before processing' do
        expect(import_user.status).to eq('created')
        expect { ImportUserJob.perform_now(import_user) }.to change { import_user.reload.status }.to eq('processing').or eq('completed')
      end

      it 'updates status to "completed" after processing' do
        ImportUserJob.perform_now(import_user)
        expect(import_user.reload.status).to eq('completed')
      end

      it 'adds contacts to current account' do        
        stub_request(:get, "https://login.microsoftonline.com/#{ENV["GRAPH_TENANT_ID"]}/oauth2/v2.0/token").
         with(
           body: {"client_id"=>ENV["GRAPH_CLIENT_ID"], "client_secret"=>ENV["GRAPH_CLIENT_SECRET"], "grant_type"=>"client_credentials", "scope"=>"https://graph.microsoft.com/.default"},
           headers: {
       	  'Accept'=>'*/*',
       	  'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
       	  'Content-Type'=>'application/x-www-form-urlencoded',
       	  'Host'=>'login.microsoftonline.com',
       	  'User-Agent'=>'Ruby'
           }).
         to_return(status: 200, body: "", headers: {})
        ImportUserJob.perform_now(import_user)
        expect(account.contacts.count).not_to eq(0) 
        expect(account.contacts.count).to eq(5)
      end
    end

    context 'when importing users with custom_attributes' do
      let(:import_user) { create(:import_user, account_id: account.id, account_user_id: account_user.id, status: 'created', user_type: 'anonymous', has_header: true, update_existing_user: true) }

      it 'updates import_user new_custom_sttributes' do
        expect(import_user.status).to eq('created')
        ImportUserJob.perform_now(import_user)
        expect(import_user.status).to eq('processing').or eq('completed')
        expect(import_user.new_custom_attributes).to eq(['ip_address'])
      end
    end

    context 'when an error occurs during processing' do
      it 'updates status to "failed" and raises an error' do
        allow_any_instance_of(ImportUserJob).to receive(:get_custom_attribute).and_raise(StandardError)
        expect { ImportUserJob.perform_now(import_user) }.to change {import_user.reload.error_message}.to eq('StandardError')
        expect(import_user.reload.status).to eq('failed')
      end
    end
  end
end