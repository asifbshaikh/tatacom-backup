module Api::V3::Accounts::Concerns::PersonaliseMessage
  extend ActiveSupport::Concern

  def personlise_custom_messages(custom_message, contact, personalise_mapping_attribute)
    begin
      custom_message = custom_message.gsub(/{{([^}]+)}}/) do |match|
        attribute = $1
        if personalise_mapping_attribute.key?(attribute)
          placeholer_value = contact.send(personalise_mapping_attribute[attribute])
          if placeholer_value.is_a?(String)
            placeholer_value = Regexp.escape(placeholer_value)
          end
          contact.send(personalise_mapping_attribute[attribute])
        else
          match
        end
      end
    rescue StandardError => e
      Rails.logger.info "PersonaliseMessage #{e}"
    end
    custom_message
  end
end
