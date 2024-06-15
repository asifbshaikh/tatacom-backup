class ImportUserPolicy < ApplicationPolicy
  def index?
    @account_user.administrator?
  end

  def import?
    @account_user.administrator?
  end

  def update?
    @account_user.administrator?
  end

  def show?
    @account_user.administrator?
  end

  def user_attribute_mapping?
    @account_user.administrator?
  end
end
