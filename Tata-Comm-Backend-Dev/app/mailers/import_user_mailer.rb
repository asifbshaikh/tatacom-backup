class ImportUserMailer < ApplicationMailer
  def send_duplicate_record_email(user_email, username, number_of_duplicates, import_date, attachment_data)
    @username = username
    @number_of_duplicates = number_of_duplicates
    @import_date = import_date

    attachments['duplicate_record.csv'] = attachment_data
    mail(
      to: user_email,
      subject: "Duplicate Records detected in your recent import"
    ) do |format|
      format.html { render "send_duplicate_record_email" }
    end
  end

  def send_failed_scenarios_email(user_email, username, error_message, date, attachment_data)
    @username = username
    @error_message = error_message
    @date = date

    attachments['failed_scenarios.csv'] = attachment_data

    mail(
      to: user_email,
      subject: "Import failed - Error details inside"
    ) do |format|
      format.html { render "send_failed_scenarios_email" }
    end
  end
end