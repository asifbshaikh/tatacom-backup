require 'rails_helper'

RSpec.describe SftpConfiguration, type: :model do
  let(:account) { create(:account) }
  let(:sftp_configuration) { build(:sftp_configuration, account: account) }
  let(:sftp_params) { {
      hostname: "mohr.example",
      username: "yvonne",
      password: "NB9By37ii",
      is_encrypted: true,
      decryption_key: "d31ed9ea144e634436c1bd6f999b3f10603a84272aeb952a1f7844a0d1e5fc73357ca698d52e7ad7e07e4c3b498f7aaca959f66f21107148d6272832c50e5168da3d7ed519b99cd38bf9a295d85898de19511dd00502d6966dc1d2be995fb3fd7b8530f93815f3f0c13ee13ad4c43e6275b7d562948556fc40f3d38ba99274c00fc2b5eeec37698d3c7477b4dc57ed9ee60a92ed25682edf51626c56e7d6cce88783417955c511bc0b92164f114fc64746a50cbdfbf38055e1fb8f62b2030926062b49876f915a9541dd962fa759f667d91a26f281759612769e8d6035e01f9c7059c599a782fb34aa69181796b38449ee30087f08b32bf25bedd57de0dfdcbaa9e49f9dc35194d1701dbd0183bc6855766f92b7acac40204522ce4949075384b25d1499375e300e1a41d1e4f83db3a173af681dfdd20fd6f5bb48527a41dbf3016cc3978110712967e615dacc63ccc4840c043ed8a223bde0f31531ae4c940ce0d31d0481861c2313fcb484866cf4b0868742b101a35a8c832491ec97fa4740618c877c6bbcf08b79c4414109722ebc955819cdcc4016ea4d8a21a15f67c7d1c33736c027ea6e6b6fa41324c8474b455ba0b52e491d7f9f78262fd1633ef938a05bcf5ec83b49acea95d35e5b8c6787b30f5a23281152ac51dcc1c5111c5272d0320c9d290eb03f07927673a587e57d8eedf69f",
      folder_path: "drill-agree/stuff-twilight/satisfaction_relationship"
    }.as_json
  }

  context 'validate associations' do
    it { is_expected.to belong_to(:account) }
  end

  context '.validations' do
    it { is_expected.to validate_presence_of(:hostname) }
    it { is_expected.to validate_presence_of(:username) }
    it { is_expected.to validate_presence_of(:password) }
    it { is_expected.to validate_presence_of(:folder_path) }
    it { is_expected.to validate_presence_of(:account_id) }
  end

  context "runs before_save" do
    it "preserves it" do
      sftp_config = sftp_configuration
      expect { sftp_config.save }.to change { sftp_config.hostname }
    end
  end

  context "validate instance methods" do
    before do
      @sftp_config = account.sftp_configurations.create(sftp_params)
    end

    it "should return dcrypted hostname" do
      expect(@sftp_config.decrypted_hostname).to eq(sftp_params["hostname"])
      @sftp_config.hostname = SecureRandom.uuid
      expect(@sftp_config.decrypted_hostname).not_to eq(sftp_params["hostname"])
    end

    it "should return dcrypted username" do
      expect(@sftp_config.decrypted_username).to eq(sftp_params["username"])
      @sftp_config.username = SecureRandom.uuid
      expect(@sftp_config.decrypted_username).not_to eq(sftp_params["username"])
    end

    it "should return dcrypted password" do
      expect(@sftp_config.decrypted_password).to eq(sftp_params["password"])
      @sftp_config.password = SecureRandom.uuid
      expect(@sftp_config.decrypted_password).not_to eq(sftp_params["password"])
    end

    it "should return dcrypted folder_path" do
      expect(@sftp_config.decrypted_folder_path).to eq(sftp_params["folder_path"])
      @sftp_config.folder_path = SecureRandom.uuid
      expect(@sftp_config.decrypted_folder_path).not_to eq(sftp_params["folder_path"])
    end

    it "should return dcrypted decryption_key" do
      expect(@sftp_config.decrypted_decryption_key).to eq(sftp_params["decryption_key"])
      @sftp_config.decryption_key = SecureRandom.uuid
      expect(@sftp_config.decrypted_decryption_key).not_to eq(sftp_params["decryption_key"])
    end
  end
end
