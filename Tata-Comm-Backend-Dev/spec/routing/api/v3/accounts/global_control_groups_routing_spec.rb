require "rails_helper"

RSpec.describe Api::V3::Accounts::GlobalControlGroupsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/api/v3/accounts/global_control_groups").to route_to("api/v3/accounts/global_control_groups#index")
    end

    it "routes to #new" do
      expect(get: "/api/v3/accounts/global_control_groups/new").to route_to("api/v3/accounts/global_control_groups#new")
    end

    it "routes to #show" do
      expect(get: "/api/v3/accounts/global_control_groups/1").to route_to("api/v3/accounts/global_control_groups#show", id: "1")
    end

    it "routes to #edit" do
      expect(get: "/api/v3/accounts/global_control_groups/1/edit").to route_to("api/v3/accounts/global_control_groups#edit", id: "1")
    end


    it "routes to #create" do
      expect(post: "/api/v3/accounts/global_control_groups").to route_to("api/v3/accounts/global_control_groups#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/api/v3/accounts/global_control_groups/1").to route_to("api/v3/accounts/global_control_groups#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/api/v3/accounts/global_control_groups/1").to route_to("api/v3/accounts/global_control_groups#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/api/v3/accounts/global_control_groups/1").to route_to("api/v3/accounts/global_control_groups#destroy", id: "1")
    end
  end
end
