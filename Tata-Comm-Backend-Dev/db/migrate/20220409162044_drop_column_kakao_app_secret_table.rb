class DropColumnKakaoAppSecretTable < ActiveRecord::Migration[6.1]
  def change
    remove_column :channel_kakao_sms, :app_secret
  end
end
