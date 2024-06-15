import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';


import {
    getIntegrations,
} from 'redux/actions';

import ListIntegrationsHeading from 'containers/settings/integrations/ListIntegrationsHeading';
import AddIntegrationModal from 'containers/settings/integrations/AddIntegrationModal';
import DeleteIntegrationModal from 'containers/settings/integrations/DeleteIntegrationModal';
// import ImportModal from 'containers/contacts/ImportModal';
import ListIntegrationsListing from 'containers/settings/integrations/ListIntegrationsListing';
// import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
// import useMousetrap from 'hooks/use-mousetrap';
// import { count } from 'console';


const IntegrationsList = ({
    match,
    integrations,
    loadedIntegrations,
    getIntegrationsAction,
}) => {
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    
    useEffect(() => {
        getIntegrationsAction();
    }, [])

    return !loadedIntegrations ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListIntegrationsHeading
                    heading="INTEGRATION_SETTINGS.HEADER"
                    match={match}
                    toggleModal={() => setModalOpenAdd(!modalOpenAdd)}
                />
                <DeleteIntegrationModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <AddIntegrationModal
                    modalOpen={modalOpenAdd}
                    toggleModal={() => {
                        setModalOpenAdd(!modalOpenAdd)
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <ListIntegrationsListing
                    items={integrations}
                    loadedItems={loadedIntegrations}
                    setEditFormData={setEditFormData}
                    setModalOpenDelete={setModalOpenDelete}
                    setModalOpen={setModalOpenAdd}
                />
            </div>
        </>
    );
};


const mapStateToProps = ({ integrationsApp }) => {
    const {
        integrations,
        loadedIntegrations,
    } = integrationsApp;
    return {
        integrations,
        loadedIntegrations,
    };
};
export default connect(mapStateToProps, {
    getIntegrationsAction: getIntegrations,
})(IntegrationsList);
