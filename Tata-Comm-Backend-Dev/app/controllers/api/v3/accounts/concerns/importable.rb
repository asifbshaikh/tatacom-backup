module Api::V3::Accounts::Concerns::Importable
  extend ActiveSupport::Concern
  include Api::V3::Accounts::ImportUsersHelper
  included do
    def import_users_to_db(import_user)
      return if import_user.status == 'completed' || import_user.status == 'failed'

      import_user.update!(status: :processing)
      import_user.create_custom_attribute_defination
      custom_attributes = get_custom_attribute(import_user)
      existing_contact = []
      new_user_updated_count = 0
      @errors = []
      duplicate_records = []
      identifier_values = []
      column_types = import_user.col_types
      column_key = column_types.keys.map(&:to_i)
      column_key = column_key - import_user.skipped_col
      col_types = {}
      check_custom_segment_update = ["creation_source", "source_id", "import_user_id"]
      column_key.each do |key|
        col_types.merge!(column_types[key.to_s])
      end

      # Initialize a hash to store duplicate records
      duplicate_records_hash = {}

      # Initialize a hash to keep track of processed records
      processed_records = {}
      csv_data = {}
      error_hash = {}

      # Iterate through the CSV data to identify and store duplicates
      csv = CSV.parse(import_user.import_file.first.download, headers: import_user.has_header, encoding: 'UTF-8')
      headers = col_types.keys
      csv.each do |row|
        row_data = filtered_selected_column(row, column_key, import_user.has_header)
        data, error = import_user.has_header ?  map_data_types(row_data, col_types) :  map_csv_data_no_header(row_data, col_types)
        email = data['email']
        phone_number = data['phone_number']
        if import_user.user_type == 'anonymous'
          if email.present? && phone_number.present? 
            identifier_value = "#{email}_#{phone_number}"  # Combine email and phone_number
            if processed_records.key?(identifier_value)
              if !duplicate_records.include? processed_records[identifier_value]
                duplicate_records_hash[identifier_value] ||= true
                duplicate_records << processed_records[identifier_value]
                duplicate_records << row
              else
                duplicate_records << row
              end
            else
              processed_records[identifier_value] = row
              csv_data[identifier_value] = data
            end

            if error.present?
              error_hash[identifier_value] = error
            end
          else
            @errors << data.merge("errors" => "Email and phone number are required")
          end
        elsif import_user.user_type == 'registered'
          customer_id = data['customer_id']
          if customer_id.present?
            identifier_value = "#{customer_id}"  # Combine email and phone_number
            if processed_records.key?(identifier_value)
              if !duplicate_records.include? processed_records[identifier_value]
                duplicate_records_hash[identifier_value] ||= true
                duplicate_records << processed_records[identifier_value]
                duplicate_records << row
              else
                duplicate_records << row
              end
            else
              processed_records[identifier_value] = row
              csv_data[identifier_value] = data
            end

            if error.present?
              error_hash[identifier_value] = error
            end
          else
            @errors << data.merge("errors" => "customer Id column value missing")
          end
        end
      end
      
      csv_data.each do |key, data|
        email = data['email']
        phone_number = data['phone_number']
        if import_user.user_type == 'anonymous'
          if !duplicate_records_hash.key?(key)
            if error_hash[key].present?
              @errors << data.merge("errors" => error_hash[key].uniq.join(', '))
            else
              contacts_records, is_new_contact = build_contact(data.with_indifferent_access, import_user, custom_attributes)
              if contacts_records.present?
                if is_new_contact
                  unless contacts_records.save
                    @errors << data.merge("errors" => contacts_records.errors.messages)
                  else
                    new_user_updated_count = new_user_updated_count + 1
                  end
                else                
                  if (contacts_records.changes.keys.length != 1 && contacts_records.changes.keys.first != "import_user_id") && !(contacts_records.changes.keys == check_custom_segment_update)
                    existing_contact << contacts_records
                  else
                    @errors << data.merge("errors" => 'Attached records are already existing in the system.')
                  end
                end
              end
            end
          end
        elsif import_user.user_type == 'registered'
          if !duplicate_records_hash.key?(key)
            if !data['customer_id'].present?
              @errors << data.merge("errors" => 'customer Id column value missing')
            elsif error_hash[key].present?
              @errors << data.merge("errors" => error_hash[key].uniq.join(', '))
            else
              contacts_records, is_new_contact = build_contact(data.with_indifferent_access, import_user, custom_attributes)
              if contacts_records.present?
                if is_new_contact
                  unless contacts_records.save
                    @errors << data.merge("errors" => contacts_records.errors.messages)
                  else
                    new_user_updated_count = new_user_updated_count + 1
                  end
                else
                  if (contacts_records.changes.keys.length != 1 && contacts_records.changes.keys.first != "import_user_id") && !(contacts_records.changes.keys == check_custom_segment_update)
                    existing_contact << contacts_records
                  else
                    @errors << data.merge("errors" => 'Attached records are already existing in the system.')
                  end
                end
              end
            end
          end
        end
      end

      if existing_contact.present?
        column_name = get_column_names
        column_name.delete(import_user.identifier.to_sym)
        existing_contact_result = import_user.account.contacts.import(existing_contact.uniq{|f| f.values_at(:id)}, on_duplicate_key_update: { conflict_target: [:id], columns: column_name }, batch_size: 1000, validate_uniqueness: true, validate: true)
        existing_contact_result.ids.each do |contact_id|
          contact = Contact.find(contact_id)
          log_success_record_upload(contact_id, contact.updated_at)
          contact.send(:sync_custom_attributes)
        end
      end

      failed_instances = existing_contact_result.present? ? existing_contact_result.failed_instances : []
      import_user.update!(
        status: :completed,
        total_rows: csv.length,
        new_users_count: new_user_updated_count,
        updated_users_count: existing_contact_result.present? ? existing_contact_result.ids.count : 0
      )
      
      if @errors.length > 0 || (existing_contact_result.present? && failed_instances.length > 0)
        attachment_data, error_message = generate_failed_senarios_csv(failed_instances, @errors, import_user, headers)
        if attachment_data.present?
          SendImportUsersMailJob.perform_now(import_user, nil, attachment_data, failed_instances, error_message)
          handle_failed_scenarios_attachment(attachment_data, import_user)
        end
      end

      if duplicate_records.length > 0
        attachment_data = generate_duplicate_senarios_csv(duplicate_records, import_user.has_header)
        if attachment_data.present?
          SendImportUsersMailJob.perform_now(import_user, duplicate_records, attachment_data, nil, nil)
        end
      end
    end
  end
end