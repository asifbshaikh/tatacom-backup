# == Schema Information
#
# Table name: import_users
#
#  id                        :bigint           not null, primary key
#  col_types                 :json
#  custom_segment            :string
#  error_message             :text
#  failed_count              :integer
#  failed_scenarios_file_url :text
#  file_name                 :text
#  file_url                  :text
#  has_header                :boolean
#  identifier                :string
#  new_custom_attributes     :jsonb
#  new_users_count           :integer
#  skipped_col               :jsonb
#  skipped_count             :integer
#  status                    :integer          default("created"), not null
#  total_rows                :integer
#  update_existing_user      :boolean          default(TRUE), not null
#  updated_users_count       :integer
#  user_type                 :integer          not null
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  account_id                :bigint           not null
#  account_user_id           :bigint           not null
#  custom_segment_id         :integer
#

class ImportUser < ApplicationRecord
  validates :account_id, presence: true
  validates :account_user_id, presence: true
  validates :user_type, presence: true
  belongs_to :account
  belongs_to :account_user
  has_many :contacts, dependent: :destroy_async
  enum user_type: {registered: 0, anonymous: 1 }
  enum status: { created: 0, processing: 1, completed: 2, failed: 3 }
  has_many_attached :import_file
  after_create_commit :import

  def create_custom_attribute_defination
    if self.new_custom_attributes.length > 0
      existing_custom_attributes = self.account.custom_attribute_definitions.with_attribute_model(:contact_attribute).map { |attribute| attribute.attribute_key}
      self.new_custom_attributes.each do | custome_attribute|
        unless existing_custom_attributes.include? custome_attribute.parameterize.underscore
          display_type = find_display_type(custome_attribute, self.col_types.values) #self.col_types[custome_attribute] || self.col_types[custome_attribute.parameterize.underscore]
          if display_type.present?
            if display_type == 'datetime'
              display_type = 'date'
            end
            self.account.custom_attribute_definitions.create!({attribute_model: 'contact_attribute' , attribute_display_name: custome_attribute , attribute_key: custome_attribute.parameterize.underscore, attribute_display_type: display_type == 'string' ? "text" : display_type, attribute_description: ' import file'})
          end
        end
      end
    end
  end

  def registered?
    user_type == REGISTERED
  end

  def anonymous?
    user_type == ANONYMOUS
  end

  private

  def import
    ImportUserJob.perform_later(self)
  end

  def find_display_type(custom_attribute, col_types)
    disp_type = nil
    col_types.each do |hash|
      if hash.key?(custom_attribute) || hash.key?(custom_attribute.parameterize.underscore)
        disp_type = hash.values.first
        break
      end
    end
    disp_type
  end
end
