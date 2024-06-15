import { Separator } from 'components/common/CustomBootstrap';
import React from 'react';

const ABComparisonCampaignMappping = React.lazy(() =>
  import(
    '../../../containers/dashboards/ab-comparison/ABComparisonCampaignMappping'
  )
);

const ABComparisonHeading = React.lazy(() =>
  import('../../../containers/dashboards/ab-comparison/ABComparisonHeading')
);

const ABCamparison = ({ match }) => {
  return (
    <>
      <div>
        <ABComparisonHeading match={match} />
      </div>
      <Separator className="mb-5" />
      <div>
        <ABComparisonCampaignMappping match={match} />
      </div>
    </>
  );
};

export default ABCamparison;
