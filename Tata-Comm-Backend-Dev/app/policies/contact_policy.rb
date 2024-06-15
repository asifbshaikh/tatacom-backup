class ContactPolicy < ApplicationPolicy
  def index?
    true
  end

  def active?
    true
  end

  def import?
    @account_user.administrator?
  end

  def search?
    true
  end

  def filter?
    true
  end

  def update?
    true
  end

  def contactable_inboxes?
    true
  end

  def destroy_custom_attributes?
    true
  end

  def show?
    true
  end

  def create?
    true
  end

  def destroy?
    @account_user.administrator?
  end

  def contact_phone_numbers?
    @account_user.administrator?
  end

  def user_audience_count?
    @account_user.administrator?
  end

  def select_target_audience?
    @account_user.administrator?
  end

  def simulate_interaction?
    @account_user.administrator?
  end

  def best_time_to_send?
    @account_user.administrator?
  end

  def test_phone_number_validity?
    @account_user.administrator?
  end
end
