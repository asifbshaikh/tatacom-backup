import React from 'react';
import UserReportsHeading from 'containers/reports/UserReportsHeading';

const Users = ({ match }) => {
    return (
        <UserReportsHeading
            match={match}
            headingLabel='USER_REPORTS.HEADER'
        />
    );
};

export default Users;