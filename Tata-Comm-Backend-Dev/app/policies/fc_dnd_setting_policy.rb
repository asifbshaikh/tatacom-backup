class FcDndSettingPolicy < ApplicationPolicy
  def index?
    @account_user.administrator?
  end

  def show?
    @account_user.administrator?
  end

  def all_countries?
    @account_user.administrator?
  end

  def update?
    @account_user.administrator?
  end
end
