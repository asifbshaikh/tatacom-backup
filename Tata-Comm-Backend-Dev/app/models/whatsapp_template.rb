# == Schema Information
#
# Table name: templates
#
#  id              :bigint           not null, primary key
#  description     :text
#  locale          :integer          default(0), not null
#  message         :text             not null
#  name            :string           not null
#  registered_dlt  :text
#  template_type   :integer          default(1)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  account_id      :integer
#  account_user_id :integer
#  pe_id           :string
#  sender_id       :string
#  telemarketer_id :string
#  template_id     :string
#
class WhatsappTemplate < Template
  belongs_to :template, foreign_key: :template_id
end
