class CampaignTagPolicy < ApplicationPolicy
  def create?
    @account_user.administrator?
  end

  def index?
    @account_user.administrator?
  end
end
