class S3ConfigurationPolicy < ApplicationPolicy
  def index?
    @account_user.administrator?
  end

  def create?
    @account_user.administrator?
  end

  def update?
    @account_user.administrator?
  end

  def show?
    @account_user.administrator?
  end

  def download_csv?
    @account_user.administrator?
  end

  def downloadable_csv_preview?
    @account_user.administrator?
  end
end
