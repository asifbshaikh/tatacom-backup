class AddServiceIdKakaoTable < ActiveRecord::Migration[6.1]
  def change
    add_column :channel_kakao_sms, :service_id, :string
  end
end
