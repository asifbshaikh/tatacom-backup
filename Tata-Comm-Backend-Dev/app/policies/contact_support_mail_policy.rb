class ContactSupportMailPolicy < ApplicationPolicy
  def new?
    @account_user.administrator?
  end

  def create?
    @account_user.administrator?
  end
end
