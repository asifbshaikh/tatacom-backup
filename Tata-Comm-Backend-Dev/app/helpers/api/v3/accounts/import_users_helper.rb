module Api::V3::Accounts::ImportUsersHelper
  def log_success_record_upload(contact_id, updated_at)
    message = "Record with ID #{contact_id} was successfully uploaded at #{updated_at}"
    Rails.logger.info(message)
  end

  def handle_failed_scenarios_attachment(attachment_data, import_user)
    temp_file = Tempfile.new(["failed_scenarios_#{import_user.id}", ".csv"])
    temp_file.write(attachment_data)
    temp_file.rewind

    import_user.import_file.attach(io: temp_file, filename: "failed_scenarios_#{import_user.id}.csv", content_type: 'text/csv')

    temp_file.close
    temp_file.unlink
  end

  def get_column_names
    column_name_list = Contact.new.attributes.keys.map(&:to_sym)
    column_name_list.delete(:id)
    column_name_list.delete(:label_list)
    column_name_list
  end


  def filtered_selected_column(row, selected_col, has_header)
    if has_header
      filtered_hash = row.to_h.select.with_index { |(_, _), index| selected_col.include?(index) }
      filtered_row = CSV::Row.new(filtered_hash.keys, filtered_hash.values)
    else
      filtered_row = row.each_with_index.select { |_, index| selected_col.include?(index) }.map(&:first)
    end
    filtered_row
  end

  def generate_duplicate_senarios_csv(duplicate_records, has_header)
    csv_data = CSV.generate(headers: true) do |csv|
      if has_header
        csv << duplicate_records.first.headers
      end
      duplicate_records.each do |row|
        value = has_header ? row.fields : row
        csv << value
      end
    end
    return unless csv_data.present?
    csv_data
  end

  def generate_failed_senarios_csv(existing_failed_instances, new_failed_instances, import_user, headers)
    error_message = []
    csv_data = CSV.generate(headers: true) do |csv|
      headers_with_errors = headers + ['errors']
      csv << headers_with_errors
      all_failed_instances = existing_failed_instances + new_failed_instances
      all_failed_instances.each do |record|
        values = headers_with_errors.map { |header| record_value(record, header) }
        csv << values
        errors = values.last.to_s.split(',').map(&:strip)
        error_message.concat(errors - error_message)
      end
    end
    return unless csv_data.present?

    [csv_data, error_message]
  end

  def record_value(record, header)
    if record.class != Hash && record.class != ActiveSupport::HashWithIndifferentAccess
      record_value = record.attributes
      record = record_value.merge("errors" => record.errors.messages)
    end

    value = record[header] || record[header.parameterize.underscore] 

    if header == "errors" && value.present? && value.class != String
      format_error_messages(value)
    else
      value.present? ? value : nil
    end
  end

  def format_error_messages(error_hash)
    formatted_messages = error_hash.map do |field, messages|
      "#{field}: #{messages.uniq.join(', ')}"
    end

    formatted_messages.join(', ')
  end

  def map_data_types(row, header_mapping)
    data = {}
    errors = []
    row.headers.each_with_index do |header, index|
      column_key = header_mapping.keys[index]
      unless column_key.nil?
        value, error = cast_value(row[header], header_mapping[column_key].to_sym, column_key)
        if error.present?
          errors << error
          data[column_key] = value
        else
          data[column_key] = value
        end
      end
    end
    [data, errors]
  end

  def map_csv_data_no_header(row, col_types)
    data = {}
    errors = []
    row.each_with_index do |value, index|
      column_key = col_types.keys[index]
      next unless column_key # Skip if column index not found in col_types

      value, error = cast_value(value, col_types[column_key].to_sym, column_key)
      if error.present?
        errors << error
      else
        data[column_key] = value
      end
    end
    [data, errors]
  end

  def cast_value(value, data_type, column_key)
    error = nil
    if value.present?
      case data_type
      when :number
        begin
          Integer(value)
        rescue ArgumentError
          error = "Type mismatch for the uploaded #{column_key} #{value}"
          value
        end
      when :boolean
        value.to_s.downcase == 'true'
        if value.downcase == 'true' || value.downcase == 'false'
          value.to_s.downcase
        else
          error = "Type mismatch for the uploaded #{column_key} #{value}"
        end
      when :string
        if column_key!= 'email' && (value =~ /[^\w\s]/) == 0
          error = "Type mismatch for the uploaded #{column_key} #{value}"
          value
        end
        value.to_s
      when :datetime
        begin
          DateTime.parse(value)
        rescue ArgumentError, TypeError
          error = "Type mismatch for the uploaded #{column_key} #{value}"
          value
        end
      else
        value
      end
    end
    [value, error]
  end

  def get_custom_attribute(import_user)
    custom_attribute_definition = import_user.account.custom_attribute_definitions.with_attribute_model(:contact_attribute)
    custom_attribute_definition.map { |attribute| [attribute.attribute_key, attribute.attribute_display_name] }.to_h
  end

  def build_contact(params, import_user, custom_attributes)
    account = import_user.account
    new_contact = false
    # Skip attributes that are not part of the Contact model or present in skipped_col
    contact_attributes = Contact.new.attributes.keys.map(&:to_sym)
    filtered_params = filter_attributes(params, contact_attributes)
    existing_contact = get_identified_contacts(params, account, import_user)
    # intiating the new contact / contact attributes only by ensuring the identifier or email duplication errors won't occur
    contact = existing_contact

    if contact.nil? && import_user.user_type == 'anonymous' && !import_user.update_existing_user
      contact = account.contacts.new(filtered_params.slice(:email, :identifier))
      new_contact = true
    elsif import_user.user_type == 'registered' && contact.nil? && !import_user.update_existing_user
      contact = account.contacts.new(filtered_params.slice(:email, :identifier))
      contact.customer_id = params[:customer_id]
      new_contact = true
    end
    if contact.present? && import_user.user_type == 'anonymous' && !new_contact
      contact = assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    elsif contact.present? && import_user.update_existing_user && import_user.user_type == 'registered'
      contact = assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    elsif new_contact && !import_user.update_existing_user
      contact = assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    elsif contact.present? && !import_user.update_existing_user && import_user.user_type == 'registered'
      contact = assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    end

    [contact, new_contact]
  end

  def assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    filtered_params['phone_number'] = "+#{filtered_params[:phone_number]}" if filtered_params[:phone_number].present?
    filtered_params['pubsub_token'] = SecureRandom.base58(24) if filtered_params[:pubsub_token].present?
    filtered_params['name'] = filtered_params[:name].present? ? filtered_params[:name] : (((!filtered_params[:name].present? && !contact.name.present?) || (contact.name.present? && filtered_params[:first_name].present? && filtered_params[:last_name].present?)) ? "#{filtered_params[:first_name]} #{filtered_params[:last_name]}" : ((contact.name.present? && contact.import_user.update_existing_user == true && filtered_params[:first_name].present? && filtered_params[:last_name].blank?) ? "#{filtered_params[:first_name]} #{contact.last_name}" : "#{contact.first_name} #{filtered_params[:last_name]}"))
    filtered_params.each do |attr, value|
      contact.send("#{attr}=", value) if value.present?
    end

    contact.creation_source = import_user.custom_segment if import_user.custom_segment.present?
    contact.source_id = import_user.custom_segment_id if import_user.custom_segment_id.present?
    contact.import_user_id = import_user.id
    contact.customer_id = params[:customer_id] if import_user.user_type == 'registered'
    if custom_attributes.present?
      contact = assign_custom_attribute(params, contact, custom_attributes)
    end
    contact
  end

  def filter_attributes(params, contact_attributes)
    params.select do |attr, _|
      contact_attributes.include?(attr.to_sym) && attr.to_s != 'id' && attr.to_s != 'customer_id'
    end
  end

  def assign_custom_attribute(params, contact, custom_attributes)
    if custom_attributes.present?
      custom_attributes_params = {}
      custom_attributes.each do |key, _value|
        value = params[key] || params[_value]
        custom_attributes_params[key] = value if value.present?
      end
      contact.custom_attributes = contact.custom_attributes.merge(custom_attributes_params)
    end
    contact
  end

  def get_identified_contacts(params, account, import_user)
    if import_user.user_type == 'anonymous'
      existing_contact = account.contacts.find_by(email: params[:email], phone_number: "+#{params[:phone_number]}", customer_id: nil)
    elsif import_user.user_type == 'registered'
      existing_contact = account.contacts.find_by(customer_id: params[:customer_id])
    end
    existing_contact
  end
end  