# == Schema Information
#
# Table name: contact_support_mails
#
#  id           :bigint           not null, primary key
#  bcc_users    :string           default([]), is an Array
#  cc_users     :string           default([]), is an Array
#  description  :text
#  priority     :string
#  product_area :string
#  subject      :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_contact_support_mails_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class ContactSupportMail < ApplicationRecord
  has_one_attached :attachment_file
  belongs_to :user
  validates :attachment_file, size: { less_than_or_equal_to: 10.megabytes , message: 'size should be less then 10mb' }, content_type: {in: ['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'], message: 'format is not supported'}
  validates :subject, :description, :product_area, :priority, presence: true
end
