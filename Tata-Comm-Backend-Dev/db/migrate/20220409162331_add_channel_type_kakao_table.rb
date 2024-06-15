class AddChannelTypeKakaoTable < ActiveRecord::Migration[6.1]
  def change
    add_column :channel_kakao_sms, :channel_type, :string
  end
end
