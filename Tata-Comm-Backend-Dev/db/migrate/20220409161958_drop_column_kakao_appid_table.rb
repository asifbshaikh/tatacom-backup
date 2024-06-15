class DropColumnKakaoAppidTable < ActiveRecord::Migration[6.1]
  def change
    remove_column :channel_kakao_sms, :app_id
  end
end
