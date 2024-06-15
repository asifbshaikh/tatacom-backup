FactoryBot.define do
  factory :email_template do
    name {'Sample'}
    body {'<html><body class="<% params[:home_page] ? "homepage" : "" %>"></html>'}
    after(:build) do |email_template|
      email_template.account ||= create(:account)
    end
  end
end