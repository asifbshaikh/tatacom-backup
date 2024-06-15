class UserPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    @account_user.administrator?
  end

  def update?
    @account_user.administrator?
  end

  def destroy?
    @account_user.administrator?
  end

  def simulate_interaction?
    @account_user.administrator?
  end

  def best_time_to_send?
    @account_user.administrator?
  end
end
