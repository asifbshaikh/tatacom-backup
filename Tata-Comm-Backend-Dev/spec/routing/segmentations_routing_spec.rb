require "rails_helper"

RSpec.describe '/segmentations' , type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/segmentations").to route_to("segmentations#index")
    end

    it "routes to #new" do
      expect(get: "/segmentations/new").to route_to("segmentations#new")
    end

    it "routes to #show" do
      expect(get: "/segmentations/1").to route_to("segmentations#show", id: "1")
    end

    it "routes to #edit" do
      expect(get: "/segmentations/1/edit").to route_to("segmentations#edit", id: "1")
    end


    it "routes to #create" do
      expect(post: "/segmentations").to route_to("segmentations#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/segmentations/1").to route_to("segmentations#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/segmentations/1").to route_to("segmentations#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/segmentations/1").to route_to("segmentations#destroy", id: "1")
    end
  end
end
