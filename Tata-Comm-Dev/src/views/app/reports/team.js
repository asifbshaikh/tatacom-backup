import React from 'react';

import CommonReport from './CommonReport';

const TeamList = ({ match }) => {
    return (
        <CommonReport
            match={match}
            type='team'
            headingLabel='TEAM_REPORTS.HEADER'
            downloadLabel='TEAM_REPORTS.DOWNLOAD_TEAM_REPORTS'
            filePrefix='team'
        />
    );
};

export default TeamList;