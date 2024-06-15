import React from 'react';

import CommonReport from './CommonReport';

const InboxList = ({ match }) => {
    return (
        <CommonReport
            match={match}
            type='inbox'
            headingLabel='INBOX_REPORTS.HEADER'
            downloadLabel='INBOX_REPORTS.DOWNLOAD_INBOX_REPORTS'
            filePrefix='inbox'
        />
    );
};

export default InboxList;