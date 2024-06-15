class CampaignPolicy < ApplicationPolicy
  def index?
    @account_user.administrator?
  end

  def update?
    @account_user.administrator?
  end

  def show?
    @account_user.administrator?
  end

  def create?
    @account_user.administrator?
  end

  def destroy?
    @account_user.administrator?
  end

  def calculate_metrics?
    @account_user.administrator?
  end

  def calculate_revenue?
    @account_user.administrator?
  end

  def get_campaign_analytics?
    @account_user.administrator?
  end

  def campaign_info?
    @account_user.administrator?
  end

  def personalize_message?
    @account_user.administrator?
  end

  def test_sms_message_via_tatasms?
    @account_user.administrator?
  end

  def send_sms_message?
    @account_user.administrator?
  end

  def find_template_id_by_sender_id?
    @account_user.administrator?
  end

  # def webhook_response?
  #   true
  # end

  def campaign_delivery?
    @account_user.administrator?
  end

  def save_as_draft?
    @account_user.administrator?
  end

  def test_campaign_via_tataemail?
    @account_user.administrator?
  end

  def perform_test?
    @account_user.administrator?
  end

  def reschedule?
    @account_user.administrator?
  end

  def generate_tiny_url_report?
    @account_user.administrator?
  end
end
