import React from 'react';

import CommonReport from './CommonReport';

const AgentList = ({ match }) => {
    return (
        <CommonReport
            match={match}
            type='agent'
            headingLabel='AGENT_REPORTS.HEADER'
            downloadLabel='REPORT.DOWNLOAD_AGENT_REPORTS'
            filePrefix='agent'
        />
    );
};

export default AgentList;