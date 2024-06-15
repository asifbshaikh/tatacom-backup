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

class Template < ApplicationRecord
  belongs_to :account
  belongs_to :account_user, optional: true
  belongs_to :sender, class_name: 'User', optional: true
  validates :name, :description, :message, presence: true
  validates :name, uniqueness: {scope: :account_id}
  scope :search_query, ->(search_term) { where("concat_ws('', name, CAST(template_id AS text)) ilike ?", "%#{search_term}%") }

  before_destroy :check_running_campaigns

  def self.upload_template(file,upload_params)
    CSV.foreach(file.path, headers: true) do |row|
      @template = Current.account.templates.where(name: row["name"])
      if !@template.empty?
        @template.update(row.to_hash)
      else
        @template = Current.account.templates.create!(row.to_hash)
      end
    end
    return @template
  end

  def check_running_campaigns
    raise "Template cannot be deleted as it is associated with campaigns" if Campaign::SmsCampaign.exists?(template_record_id: id)
  end

end
