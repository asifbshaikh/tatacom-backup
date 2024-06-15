import React, { useState } from 'react';
import { Row } from 'reactstrap';
import DripCampaignHeading from 'containers/campaigns/drip-campaign/DripCampaignHeading';
import DripCampaignsListing from 'containers/campaigns/drip-campaign/DripCampaignListing';

const DripCampaignList = ({ match }) => {
  const [filters, setFilters] = useState(null);
  return (
    <>
      <div className="app-row1 drip-campaign">
        <DripCampaignHeading
          heading="DRIP_CAMPAIGN.DRIP_CAMPAIGN_TITLE"
          match={match}
          addLabel="DRIP_CAMPAIGN.CREATE_DRIP_FLOW"
          setFilters={setFilters}
          filters={filters}
        />
        <DripCampaignsListing
          match={match}
          items={[]}
          loadedItems={[]}
          setEditFormData={() => {}}
          setModalOpenDelete={() => {}}
          setModalOpen={() => {}}
          isOngoingType={() => {}}
          setFilters={setFilters}
          filters={filters}
        />
      </div>
    </>
  );
};

export default DripCampaignList;
