# == Schema Information
#
# Table name: global_control_groups
#
#  id                           :bigint           not null, primary key
#  active                       :boolean
#  allow_marketers              :boolean
#  apply_global                 :boolean
#  control_group                :integer
#  random_allocation_percentage :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  account_id                   :bigint           not null
#
# Indexes
#
#  index_global_control_groups_on_account_id  (account_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#
require 'csv'
class GlobalControlGroup < ApplicationRecord
  # enumarators
  enum control_group: { random_allocation: 0, upload_user_list: 1 }

  # associations
  belongs_to :account
  has_one_attached :user_list_file
  has_one :campaign_global_control_group
  has_one :campaign, through: :campaign_global_control_group

  # validations
  validates :control_group, presence: true
  validates :random_allocation_percentage, presence: true, if: :random_allocation?
  validates :user_list_file, attached: { message: "user_list_file is not present now" },
                             size: { less_than_or_equal_to: 50.megabytes, message: 'max size for file upload is 50mb.' }, content_type: { in: ['text/csv'], message: 'only csv file uploads are allowed.' }, if: :upload_user_list?

  # public methods

  def random_allocation?
    control_group == 'random_allocation'
  end

  def upload_user_list?
    control_group == 'upload_user_list'
  end

  def download_random_allocation_users
    contacts_list = set_random_restricted_contacts
    generate_csv_file(contacts_list)
  end

  def download_upload_user_list_users
    contacts_list = set_restricted_contacts_from_user_list
    generate_csv_file(contacts_list)
  end

  # calling this method from campaign model so moving to public
  def user_list_csv_file
    if Rails.env.development?
      URI.parse(user_list_file_url).open { |f| CSV.parse(f, headers: true, encoding: 'UTF-8', skip_blanks: true) }
    else
      CSV.parse(user_list_file.download, headers: true, encoding: 'UTF-8', skip_blanks: true)
    end
  end

  # private methods
  private

  def set_random_restricted_contacts
    contact_ids = Current.account.contacts.ids
    restricted_contact_size = (contact_ids.count * random_allocation_percentage) / 100
    Contact.where(id: contact_ids.sample(restricted_contact_size))
  end

  def set_restricted_contacts_from_user_list
    customer_ids = user_list_csv_file.map { |file_row| file_row['customerId'] }
    Contact.where(customer_id: customer_ids)
  end

  def user_list_file_url
    S3::GeneratePresignedUrl.generate_presigned_url(user_list_file, 7200) # expires in 2 hours
  end

  def generate_csv_file(contacts_list)
    CSV.generate(headers: true) do |csv|
      csv << CSV_HEADERS
      contacts_list.each_with_index do |contact, index|
        csv << [index + 1, contact.customer_id]
      end
    end
  end
end
