import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';


import {
    getLabels,
} from 'redux/actions';

import ListLabelsHeading from 'containers/settings/labels/ListLabelsHeading';
import AddLabelModal from 'containers/settings/labels/AddLabelModal';
import DeleteLabelModal from 'containers/settings/labels/DeleteLabelModal';
// import ImportModal from 'containers/contacts/ImportModal';
import ListLabelsListing from 'containers/settings/labels/ListLabelsListing';
// import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
// import useMousetrap from 'hooks/use-mousetrap';
// import { count } from 'console';


const LabelsList = ({
    match,
    labels,
    loadedLabels,
    getLabelsAction,
}) => {
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [editFormData, setEditFormData] = useState({});


    useEffect(() => {
        getLabelsAction();
    }, [])

    return !loadedLabels ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListLabelsHeading
                    heading="LABEL_MGMT.HEADER"
                    match={match}
                    toggleModal={() => setModalOpenAdd(!modalOpenAdd)}
                />
                <DeleteLabelModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <AddLabelModal
                    modalOpen={modalOpenAdd}
                    toggleModal={() => {
                        setModalOpenAdd(!modalOpenAdd)
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <ListLabelsListing
                    items={labels}
                    loadedItems={loadedLabels}
                    setEditFormData={setEditFormData}
                    setModalOpenDelete={setModalOpenDelete}
                    setModalOpen={setModalOpenAdd}
                />
            </div>
        </>
    );
};


const mapStateToProps = ({ labelsApp }) => {
    const {
        labels,
        loadedLabels,
    } = labelsApp;
    return {
        labels,
        loadedLabels,
    };
};
export default connect(mapStateToProps, {
    getLabelsAction: getLabels,
})(LabelsList);
