import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import ListApplicationsHeading from 'containers/settings/applications/ListApplicationsAllHeading';
import ListApplicationsListing from 'containers/settings/applications/ListApplicationsAllListing';


import {
    getApplications,
    getAppIntegrations,
} from 'redux/actions';


const ApplicationsList = ({
    match,
    applications,
    loadedApplications,
    getApplicationsAction,
    appIntegrations,
    getAppIntegrationsAction,
}) => {
    useEffect(() => {
        getApplicationsAction();
    }, [])
    useEffect(() => {
        getAppIntegrationsAction();
    }, [applications])

    return !loadedApplications ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListApplicationsHeading
                    heading="INTEGRATION_APPS.HEADER"
                    match={match}
                />
                <ListApplicationsListing
                    items={appIntegrations}
                    loadedItems={loadedApplications}
                />
            </div>
        </>
    );
};


const mapStateToProps = ({ applicationsApp }) => {
    const {
        applications,
        loadedApplications,
        appIntegrations,
    } = applicationsApp;
    return {
        applications,
        loadedApplications,
        appIntegrations,
    };
};
export default connect(mapStateToProps, {
    getApplicationsAction: getApplications,
    getAppIntegrationsAction: getAppIntegrations,
})(ApplicationsList);
