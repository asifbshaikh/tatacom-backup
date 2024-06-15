class Segmentation::EditSegmentNotifierMailer < ApplicationMailer
  def send_import_success(user_email)
    mail(
      to: user_email,
      subject: 'Your import for file segment is completed'
    ) do |format|
      format.html { render 'segmentation/edit_segment_notifier_mailer/send_import_success' }
    end
  end
end
