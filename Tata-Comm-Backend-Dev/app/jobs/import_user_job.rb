class ImportUserJob < ApplicationJob
  queue_as :critical
  def perform(import_user)
    return if import_user.status == 'completed' || import_user.status == 'failed'

    import_user.update!(status: :processing)
    import_user.create_custom_attribute_defination
    custom_attributes = get_custom_attribute(import_user)
    existing_contact = []
    skipped_records = []
    custom_attr_contacts = []
    new_contacts = []
    @errors = []
    @skipped_col_errors = []
    existing_contact_for_custom_segment_update = []
    column_types = import_user.col_types
    column_key = column_types.keys.map(&:to_i)
    column_key -= import_user.skipped_col
    col_types = {}
    batch_size = 5000
    check_custom_segment_update = %w[creation_source source_id import_user_id]
    column_key.each do |key|
      col_types.merge!(column_types[key.to_s])
    end

    # Initialize a hash to store duplicate records

    # Initialize a hash to keep track of processed records
    csv_data = {}

    new_contact_count = 0
    updated_contacts_ids = []
    column_name = get_column_names
    failed_instances = []
    contact_attributes = Contact.new.attributes.keys.map(&:to_sym)
    account = import_user.account
    email_index = col_types.keys.index('email')
    phone_number_index = col_types.keys.index('phone_number')
    customer_id_index = col_types.keys.index('customer_id')

    # Iterate through the CSV data to identify and store duplicates
    file = import_user&.import_file&.first
    file_url = S3::GeneratePresignedUrl.generate_presigned_url(file, 7200) # expires in 2 hours
    sleep(2)

    csv = URI.parse(file_url).open do |f|
      CSV.parse(f, headers: import_user.has_header, encoding: 'UTF-8',
                   skip_blanks: true)
    end
    if import_user.has_header
      csv.reject { |row| row.to_hash.values.all?(&:nil?) }
    else
      csv.reject! { |row| row.all?(&:nil?) }
    end
    headers = col_types.keys
    csv.each_slice(BATCH_SIZE) do |batch|
      batch.each do |row|
        row_data = filtered_selected_column(row, column_key, import_user.has_header)
        if import_user.user_type == ANONYMOUS
          email = import_user.has_header? ? row_data['Email'] : row_data[email_index]
          phone_number = import_user.has_header? ? row_data['Phone Number'] : row_data[phone_number_index]
          if email.present? && phone_number.present?
            identifier_value = "#{email.downcase}_#{phone_number}" # Combine email and phone_number
            csv_data[identifier_value] ||= []
            csv_data[identifier_value] << row
          else
            data, = import_user.has_header ? map_data_types(row_data, col_types) : map_csv_data_no_header(row_data, col_types)
            @errors << data.merge('errors' => 'Email and phone number are required')
          end
        elsif import_user.user_type == REGISTERED
          customer_id = import_user.has_header? ? row_data['Customer ID'] : row_data[customer_id_index]
          if customer_id.present?
            identifier_value = customer_id.to_s # Combine email and phone_number
            csv_data[identifier_value] ||= []
            csv_data[identifier_value] << row
          else
            data, = import_user.has_header ? map_data_types(row_data, col_types) : map_csv_data_no_header(row_data, col_types)
            @errors << data.merge('errors' => 'customer Id column value missing')
          end
        end
      end
    end
    csv_data, duplicate_records = find_duplicate_records(csv_data)
    csv_data.each_slice(BATCH_SIZE) do |batch|
      batch.each do |_key, row|
        row_data = filtered_selected_column(row.first, column_key, import_user.has_header)
        data, error = import_user.has_header ? map_data_types(row_data, col_types) : map_csv_data_no_header(row_data, col_types)
        if import_user.user_type == ANONYMOUS
          if error.present?
            @errors << data.merge('errors' => error.uniq.join(', '))
          else
            contacts_records, is_new_contact = build_contact(data.with_indifferent_access, account, import_user, contact_attributes,
                                                             custom_attributes)
            if contacts_records.present? && contacts_records.valid?
              if is_new_contact
                new_contacts << contacts_records
              elsif (contacts_records.changes.keys.length != 1 && contacts_records.changes.keys.first != 'import_user_id') && contacts_records.changes.keys != check_custom_segment_update
                custom_attr_contacts << contacts_records.id if contacts_records.changes['custom_attributes'].present?
                existing_contact << contacts_records
              else
                existing_contact_for_custom_segment_update << contacts_records if import_user.custom_segment?
                @errors << data.merge('errors' => 'Attached records are already existing in the system.')
              end
            elsif contacts_records.present?
              @errors << data.merge('errors' => contacts_records.errors.messages)
            else
              skipped_records << data
              if import_user.update_existing_user?
                @skipped_col_errors << data.merge('errors' => 'This column is skipped due to update existing records option is selected.')
              end
            end
          end
        elsif import_user.user_type == REGISTERED
          if data['customer_id'].blank?
            @errors << data.merge('errors' => 'customer Id column value missing')
          elsif error.present?
            @errors << data.merge('errors' => error.uniq.join(', '))
          else
            contacts_records, is_new_contact = build_contact(data.with_indifferent_access, account, import_user, contact_attributes,
                                                             custom_attributes)
            if contacts_records.present? && contacts_records.valid?
              if is_new_contact
                new_contacts << contacts_records
              elsif (contacts_records.changes.keys.length != 1 && contacts_records.changes.keys.first != 'import_user_id') && contacts_records.changes.keys != check_custom_segment_update
                custom_attr_contacts << contacts_records.id if contacts_records.changes['custom_attributes'].present?
                existing_contact << contacts_records
              else
                existing_contact_for_custom_segment_update << contacts_records if import_user.custom_segment?
                @errors << data.merge('errors' => 'Attached records are already existing in the system.')
              end
            elsif contacts_records.present?
              @errors << data.merge('errors' => contacts_records.errors.messages)
            else
              skipped_records << data
              if import_user.update_existing_user?
                @skipped_col_errors << data.merge('errors' => 'This column is skipped due to update existing records option is selected.')
              end
            end
          end
        end
      end

      if existing_contact.present?
        column_name.delete(import_user.identifier.to_sym)
        existing_contact_result = import_user.account.contacts.import(existing_contact.uniq do |f|
                                                                        f.values_at(:id)
                                                                      end, on_duplicate_key_update: { conflict_target: [:id], columns: column_name }, batch_size: batch_size, validate_uniqueness: true, validate: true)
        updated_contacts_ids += existing_contact_result.ids
        failed_instances += existing_contact_result.failed_instances
        existing_contact = []
      end

      next if new_contacts.blank?

      column_name.delete(import_user.identifier.to_sym)
      new_contacts_result = import_user.account.contacts.import(new_contacts, on_duplicate_key_update: { columns: column_name },
                                                                              batch_size: batch_size, validate_uniqueness: true, validate: true)
      next if new_contacts_result.blank?

      custom_attr_contacts += new_contacts_result.ids if custom_attributes.present?
      failed_instances += new_contacts_result.failed_instances
      new_contact_count += new_contacts_result.ids.count
      new_contacts = []
    end
    csv_data.clear
    import_user.update!(
      status: :completed,
      total_rows: csv.length,
      new_users_count: new_contact_count,
      updated_users_count: updated_contacts_ids.count
    )

    if existing_contact_for_custom_segment_update.present?
      existing_contact_for_custom_segment_update.each do |contact|
        contact.update_columns(creation_source: import_user.custom_segment, source_id: (contact.source_id << import_user.custom_segment_id))
      end
    end
    if @skipped_col_errors.length.positive?
      attachment_data, error_message = generate_failed_senarios_csv(nil, @skipped_col_errors, import_user, headers, true)
      if attachment_data.present?
        import_user.update!(skipped_count: @skipped_col_errors.length)
        SendImportUsersMailJob.perform_now(import_user, nil, attachment_data, skipped_records, error_message, true)
        handle_failed_scenarios_attachment(attachment_data, import_user)
      end
    end

    if @errors.length.positive? || failed_instances.length.positive?
      attachment_data, error_message = generate_failed_senarios_csv(failed_instances, @errors, import_user, headers, false)
      if attachment_data.present?
        SendImportUsersMailJob.perform_now(import_user, nil, attachment_data, failed_instances, error_message, false)
        handle_failed_scenarios_attachment(attachment_data, import_user)
      end
    end

    duplicate_records.each do |dupl_record|
      contact = if import_user.registered?
                  account.contacts.find_by(customer_id: dupl_record[0])
                else
                  account.contacts.find_by(email: dupl_record[0].downcase, phone_number: "+#{dupl_record[1]}", customer_id: nil)
                end
      if contact.present? && import_user.custom_segment_id.present? && contact.source_id.exclude?(import_user.custom_segment_id)
        contact.update_columns(creation_source: import_user.custom_segment,
                               source_id: (contact.source_id << import_user.custom_segment_id))
      end
    end

    attachment_data = generate_duplicate_senarios_csv(duplicate_records, import_user.has_header)
    SendImportUsersMailJob.perform_now(import_user, duplicate_records, attachment_data, nil, nil, false) if attachment_data.present?
    failed_count = @errors&.length&.+ failed_instances&.length&.+ duplicate_records.length
    import_user.update!(failed_count: failed_count)
    log_success_record_upload(updated_contacts_ids, batch_size) if updated_contacts_ids.present?
    AddCustomAttrJob.perform_later(custom_attr_contacts) if custom_attr_contacts.present?
  rescue StandardError => e
    Rails.logger.error("ImportUserJob => #{e.message}")
    import_user.update!(status: :failed, error_message: e.message)
  end

  private

  def log_success_record_upload(contact_ids, batch_size)
    contact_ids.each_slice(batch_size) do |contact_id|
      contacts = Contact.where(id: contact_id).select(:id, :account_id, :updated_at)
      contacts.each do |contact|
        message = "Record with ID #{contact.id} was successfully uploaded at #{contact.updated_at}"
        Rails.logger.info(message)
      end
    end
  end

  def handle_failed_scenarios_attachment(attachment_data, import_user)
    temp_file = Tempfile.new(["failed_scenarios_#{import_user.id}", '.csv'])
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
    selected_col = [] if selected_col.nil?
    if has_header
      filtered_hash = row.to_h.select.with_index { |(_, _), index| selected_col.include?(index) }
      filtered_row = CSV::Row.new(filtered_hash.keys, filtered_hash.values)
    else
      filtered_row = row.each_with_index.select { |_, index| selected_col.include?(index) }.map(&:first)
    end
    filtered_row
  end

  def generate_duplicate_senarios_csv(duplicate_records, has_header)
    return if duplicate_records.blank?
    csv_data = CSV.generate(headers: true) do |csv|
      csv << duplicate_records.first.headers if has_header
      duplicate_records.each do |row|
        value = has_header ? row.fields : row
        csv << value
      end
    end
    return if csv_data.blank?

    csv_data
  end

  def generate_failed_senarios_csv(existing_failed_instances, new_failed_instances, _import_user, headers, is_skipped_records)
    error_message = []
    csv_data = CSV.generate(headers: true) do |csv|
      headers_with_errors = headers + ['errors']
      csv << headers_with_errors
      all_failed_instances = if is_skipped_records == true
                               new_failed_instances
                             else
                               existing_failed_instances + new_failed_instances
                             end
      all_failed_instances.each do |record|
        values = headers_with_errors.map { |header| record_value(record, header) }
        csv << values
        errors = values.last.to_s.split(',').map(&:strip)
        error_message.concat(errors - error_message)
      end
    end
    return if csv_data.blank?

    [csv_data, error_message]
  end

  def record_value(record, header)
    if record.class != Hash && record.class != ActiveSupport::HashWithIndifferentAccess
      record_value = record.attributes
      record = record_value.merge('errors' => record.errors.messages)
    end

    value = record[header] || record[header.parameterize.underscore]

    if header == 'errors' && value.present? && value.class != String
      format_error_messages(value)
    else
      value.presence
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

      next if column_key.nil?

      value, error = cast_value(row[header], header_mapping[column_key].to_sym, column_key)
      errors << error if error.present?
      data[column_key] = value
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
        value.to_s.downcase
        if value.casecmp('true').zero? || value.casecmp('false').zero?
          value.to_s.downcase
        else
          error = "Type mismatch for the uploaded #{column_key} #{value}"
        end
      when :string
        if (column_key != 'email' && column_key != "address") && (value =~ /[^\w\s]/) == 0
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

  def build_contact(params, account, import_user, contact_attributes, custom_attributes)
    new_contact = false
    filtered_params = filter_attributes(params, contact_attributes)
    existing_contact = get_identified_contacts(params, account, import_user)
    # intiating the new contact / contact attributes only by ensuring the identifier or email duplication errors won't occur
    contact = existing_contact

    if contact.nil? && import_user.user_type == ANONYMOUS && !import_user.update_existing_user
      contact = account.contacts.new(filtered_params.slice(:email, :identifier))
      new_contact = true
    elsif import_user.user_type == REGISTERED && contact.nil? && !import_user.update_existing_user
      contact = account.contacts.new(filtered_params.slice(:email, :identifier))
      contact.customer_id = params[:customer_id]
      new_contact = true
    end
    if contact.present? && import_user.user_type == ANONYMOUS && !new_contact
      contact = assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    elsif contact.present? && import_user.update_existing_user && import_user.user_type == REGISTERED
      contact = assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    elsif new_contact && !import_user.update_existing_user
      contact = assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    elsif contact.present? && !import_user.update_existing_user && import_user.user_type == REGISTERED
      contact = assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    end

    [contact, new_contact]
  end

  def assign_attributes(params, filtered_params, contact, import_user, custom_attributes)
    filtered_params['phone_number'] = "+#{filtered_params[:phone_number]}" if filtered_params[:phone_number].present?
    filtered_params['email'] = filtered_params['email'].downcase if filtered_params[:email].present?
    filtered_params['pubsub_token'] = SecureRandom.base58(24) if filtered_params[:pubsub_token].present?
    if filtered_params.keys.any?(%w[name first_name last_name])
      filtered_params['name'] = if filtered_params[:name].present?
                                  filtered_params[:name]
                                else
                                  (if (filtered_params[:name].blank? && contact.name.blank?) || (contact.name.present? && filtered_params[:first_name].present? && filtered_params[:last_name].present?)
                                     "#{filtered_params[:first_name]} #{filtered_params[:last_name]}"
                                   else
                                     (contact.name.present? && contact.import_user.update_existing_user == true && filtered_params[:first_name].present? && filtered_params[:last_name].blank? ? "#{filtered_params[:first_name]} #{contact.last_name}" : "#{contact.first_name} #{filtered_params[:last_name]}")
                                   end)
                                end
    end
    filtered_params.each do |attr, value|
      contact.send("#{attr}=", value) if value.present?
    end

    contact.creation_source = import_user.custom_segment if import_user.custom_segment.present?
    if import_user.custom_segment_id.present? && contact.source_id.exclude?(import_user.custom_segment_id)
      contact.source_id << import_user.custom_segment_id
    end
    contact.import_user_id = import_user.id
    contact.customer_id = params[:customer_id] if import_user.user_type == REGISTERED
    contact = assign_custom_attribute(params, contact, custom_attributes) if custom_attributes.present?
    contact = assign_additional_attributes(params, contact)
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

  def assign_additional_attributes(params, contact)
    additional_attributes = {}
    CONTACT_ATTRIBUTES.each do |attr|
      additional_attributes[attr] = params.fetch(attr, nil)
    end
    additional_attributes['social_profiles'] = {}
    CONTACT_SOCIAL_PROFILES.each do |profile|
      additional_attributes['social_profiles'][profile] = params.fetch(profile, '') if params.has_key?(profile)
    end
    contact.additional_attributes = contact.additional_attributes.merge(additional_attributes)
    contact
  end

  def get_identified_contacts(params, account, import_user)
    if import_user.user_type == ANONYMOUS
      existing_contact = account.contacts.find_by(email: params[:email].downcase, phone_number: "+#{params[:phone_number]}", customer_id: nil)
    elsif import_user.user_type == REGISTERED
      existing_contact = account.contacts.find_by(customer_id: params[:customer_id])
    end
    existing_contact
  end

  def find_duplicate_records(csv_data)
    duplicate_records = []
    csv_data.each_pair do |key, values|
      if values.length > 1
        duplicate_records.concat(values)
        csv_data.delete(key)
      end
    end
    [csv_data, duplicate_records]
  end
end
