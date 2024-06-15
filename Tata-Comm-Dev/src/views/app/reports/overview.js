import React from 'react';

import CommonReport from './CommonReport';

const OverviewList = ({ match }) => {
    return (
        <CommonReport
            match={match}
            type='account'
            headingLabel='REPORT.HEADER'
            downloadLabel='REPORT.DOWNLOAD_AGENT_REPORTS'
            filePrefix='agent'
        />
    );
};

export default OverviewList;