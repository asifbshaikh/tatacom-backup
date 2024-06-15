import React, { useState } from 'react';

import { connect } from 'react-redux';


import {
    getCanneds,
} from 'redux/actions';

import ListCannedsHeading from 'containers/settings/canneds/ListCannedsHeading';
import AddCannedModal from 'containers/settings/canneds/AddCannedModal';
import DeleteCannedModal from 'containers/settings/canneds/DeleteCannedModal';
// import ImportModal from 'containers/contacts/ImportModal';
import ListCannedsListing from 'containers/settings/canneds/ListCannedsListing';
// import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
// import useMousetrap from 'hooks/use-mousetrap';
// import { count } from 'console';


const CannedsList = ({
    match,
    canneds,
    loadedCanneds,
    getCannedsAction,
}) => {
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    if (!loadedCanneds && !canneds.length) {
        getCannedsAction();
    }

    return !loadedCanneds ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListCannedsHeading
                    heading="CANNED_MGMT.HEADER"
                    match={match}
                    toggleModal={() => setModalOpenAdd(!modalOpenAdd)}
                />
                <DeleteCannedModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <AddCannedModal
                    modalOpen={modalOpenAdd}
                    toggleModal={() => {
                        setModalOpenAdd(!modalOpenAdd)
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <ListCannedsListing
                    items={canneds}
                    loadedItems={loadedCanneds}
                    setEditFormData={setEditFormData}
                    setModalOpenDelete={setModalOpenDelete}
                    setModalOpen={setModalOpenAdd}
                />
            </div>
        </>
    );
};


const mapStateToProps = ({ cannedsApp }) => {
    const {
        canneds,
        loadedCanneds,
    } = cannedsApp;
    return {
        canneds,
        loadedCanneds,
    };
};
export default connect(mapStateToProps, {
    getCannedsAction: getCanneds,
})(CannedsList);
