class GlobalControlGroupPolicy < ApplicationPolicy
  def index?
    @account_user.administrator?
  end

  def show?
    @account_user.administrator?
  end

  def edit?
    @account_user.administrator?
  end

  def update?
    @account_user.administrator?
  end

  def destroy?
    @account_user.administrator?
  end

  def create?
    @account_user.administrator?
  end

  def download_users_csv_file?
    @account_user.administrator?
  end
end
