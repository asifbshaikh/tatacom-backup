import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';


import {
    getApplications,
    getIntegration,
} from 'redux/actions';

import ListApplicationsHeading from 'containers/settings/applications/ListApplicationsHeading';
import AddApplicationModal from 'containers/settings/applications/AddApplicationModal';
import DeleteApplicationModal from 'containers/settings/applications/DeleteApplicationModal';
// import ImportModal from 'containers/contacts/ImportModal';
import ListApplicationsListing from 'containers/settings/applications/ListApplicationsListing';
// import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
// import useMousetrap from 'hooks/use-mousetrap';
// import { count } from 'console';


const ApplicationsList = ({
    match,
    applications,
    loadedApplications,
    getApplicationsAction,
    integration,
    getIntegrationAction,
}) => {
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        if (!loadedApplications) {
            getApplicationsAction();
        }
    }, [])
    useEffect(() => {
        getIntegrationAction(match.params.applicationid);
    }, [applications, match.params.applicationid])
    if (typeof integration !== "object") {
        return <>Loading</>;
    }


    const showIntegrationHooks = () => {
        // return !this.uiFlags.isFetching && !isEmptyObject(this.integration);
        return integration && integration.id;
    }
    const integrationType = () => {
        return integration.id && integration.allow_multiple_hooks ? 'multiple' : 'single';
    }
    const isIntegrationMultiple = () => {
        return integration.id && integrationType() === 'multiple';
    }
    const isIntegrationSingle = () => {
        return integration.id && integrationType() === 'single';
    }
    const showAddButton = () => {
        return showIntegrationHooks() && isIntegrationMultiple();
    }
    const isHookTypeInbox = () => {
        return integration.hook_type === 'inbox';
    }

    return !loadedApplications ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListApplicationsHeading
                    heading="INTEGRATION_APPS.HEADER"
                    match={match}
                    toggleModal={() => setModalOpenAdd(!modalOpenAdd)}
                    showAddButton={showAddButton}
                />
                <DeleteApplicationModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                    isHookTypeInbox={isHookTypeInbox}
                />
                <AddApplicationModal
                    modalOpen={modalOpenAdd}
                    toggleModal={() => {
                        setModalOpenAdd(!modalOpenAdd)
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                    isHookTypeInbox={isHookTypeInbox}
                    integration={integration}
                />
                {isIntegrationMultiple() && <ListApplicationsListing
                    items={applications}
                    integration={integration}
                    loadedItems={loadedApplications}
                    setEditFormData={setEditFormData}
                    setModalOpenDelete={setModalOpenDelete}
                    setModalOpen={setModalOpenAdd}
                    isIntegrationMultiple={isIntegrationMultiple}
                    isIntegrationSingle={isIntegrationSingle}
                    isHookTypeInbox={isHookTypeInbox}
                />}
                {isIntegrationSingle() && <div><b>TODO</b></div>}
            </div>
        </>
    );
};


const mapStateToProps = ({ applicationsApp }) => {
    const {
        applications,
        loadedApplications,
        integration,
    } = applicationsApp;
    return {
        applications,
        loadedApplications,
        integration,
    };
};
export default connect(mapStateToProps, {
    getApplicationsAction: getApplications,
    getIntegrationAction: getIntegration,
})(ApplicationsList);
