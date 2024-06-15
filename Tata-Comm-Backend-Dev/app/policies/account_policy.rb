class AccountPolicy < ApplicationPolicy
  def show?
    @account_user.administrator? || @account_user.agent?
  end

  def update?
    @account_user.administrator?
  end

  def update_active_at?
    true
  end

  def setting?
    @account_user.administrator?
  end

  def generate_access_token?
    true
  end

  def create_event_log?
    true
  end

  def get_event_log?
    @account_user.administrator?
  end
end
