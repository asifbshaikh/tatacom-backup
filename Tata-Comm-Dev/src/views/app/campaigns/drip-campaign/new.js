import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import DripCampaignProgressBar from 'containers/campaigns/drip-campaign/DripCampaignProgressBar';

const CreateDripCampaign = ({ match }) => {
  return (
    <div>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb
            heading="DRIP_CAMPAIGN.DRIP_CAMPAIGN_TITLE"
            match={match}
          />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12">
          <DripCampaignProgressBar />
        </Colxx>
      </Row>
    </div>
  );
};
export default CreateDripCampaign;
