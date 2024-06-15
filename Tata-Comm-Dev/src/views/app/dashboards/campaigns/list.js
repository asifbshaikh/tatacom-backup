import React, { useState } from 'react';
import ListDashboardCampaignsHeading from 'containers/dashboards/campaigns/ListDashboardCampaignsHeading';
import ListDashboardCampaignsData from 'containers/dashboards/campaigns/ListDashboardCampaignsData';
import { connect } from 'react-redux';

const DashboadCampaignsList = ({
  match,
  dashboardCampaignList,
  loadedDashboardCampaignList,
}) => {
  const [showRefresh, setShowRefresh] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [filters, setFilters] = useState(null);
  return (
    <>
      <div className="app-row1">
        <ListDashboardCampaignsHeading
          heading="DASHBOARD.CAMPAIGN.LABELS.ALL_CAMPAIGN_FOR"
          match={match}
          setShowRefresh={setShowRefresh}
          showRefresh={showRefresh}
          setExport={setShowExport}
          showExport={showExport}
          setFilters={setFilters}
          filters={filters}
        />
      </div>
      <ListDashboardCampaignsData
        items={dashboardCampaignList}
        loadedItems={loadedDashboardCampaignList}
        showRefresh={showRefresh}
        setFilters={setFilters}
        filters={filters}
      />
    </>
  );
};

const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const { dashboardCampaignList, loadedDashboardCampaignList } =
    dashboardCampaignsApp;
  return {
    dashboardCampaignList,
    loadedDashboardCampaignList,
  };
};
export default connect(mapStateToProps)(DashboadCampaignsList);
