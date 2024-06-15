class DashboardPolicy < ApplicationPolicy
  def index?
    @account_user.administrator?
  end

  def export_campaigns?
    @account_user.administrator?
  end

  def all?
    @account_user.administrator?
  end

  def draft?
    @account_user.administrator?
  end

  def ran_yesterday?
    @account_user.administrator?
  end

  def active?
    @account_user.administrator?
  end

  def scheduled?
    @account_user.administrator?
  end
end
