class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  include RequestExceptionHandler
  include Pundit::Authorization
  include SwitchLocale

  skip_before_action :verify_authenticity_token

  before_action :set_current_user, unless: :devise_controller?
  around_action :switch_locale
  around_action :handle_with_exception, unless: :devise_controller?
  before_action :set_paper_trail_whodunnit

  private

  def set_current_user
    @user ||= current_user
    Current.user = @user
  end

  def current_subscription
    @subscription ||= Current.account.subscription
  end

  def pundit_user
    {
      user: Current.user,
      account: Current.account,
      account_user: Current.account_user
    }
  end

  def page
    @page ||= params[:page] || 1
  end

  def per_page
    @per_page ||= params[:per_page] || 10
  end
end
