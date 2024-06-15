class TemplatePolicy < ApplicationPolicy
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

  def show_template?
    @account_user.administrator?
  end

  def upload_template?
    @account_user.administrator?
  end
end
