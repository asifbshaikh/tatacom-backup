import React from 'react';

import CommonReport from './CommonReport';

const LabelList = ({ match }) => {
    return (
        <CommonReport
            match={match}
            type='label'
            headingLabel='LABEL_REPORTS.HEADER'
            downloadLabel='LABEL_REPORTS.DOWNLOAD_LABEL_REPORTS'
            filePrefix='label'
        />
    );
};

export default LabelList;