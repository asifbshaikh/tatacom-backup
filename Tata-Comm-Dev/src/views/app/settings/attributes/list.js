import React, { useState } from 'react';

import { connect } from 'react-redux';


import {
    getAttributes,
} from 'redux/actions';

import ListAttributesHeading from 'containers/settings/attributes/ListAttributesHeading';
import AddAttributeModal from 'containers/settings/attributes/AddAttributeModal';
import DeleteAttributeModal from 'containers/settings/attributes/DeleteAttributeModal';
// import ImportModal from 'containers/contacts/ImportModal';
import ListAttributesListing from 'containers/settings/attributes/ListAttributesListing';
// import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
// import useMousetrap from 'hooks/use-mousetrap';
// import { count } from 'console';


const AttributesList = ({
    match,
    attributes,
    loadedAttributes,
    getAttributesAction,
}) => {
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    if (!loadedAttributes && !attributes.length) {
        getAttributesAction();
    }

    return !loadedAttributes ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListAttributesHeading
                    heading="ATTRIBUTES_MGMT.HEADER"
                    match={match}
                    toggleModal={() => setModalOpenAdd(!modalOpenAdd)}
                />
                <DeleteAttributeModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <AddAttributeModal
                    modalOpen={modalOpenAdd}
                    toggleModal={() => {
                        setModalOpenAdd(!modalOpenAdd)
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <ListAttributesListing
                    items={attributes}
                    loadedItems={loadedAttributes}
                    setEditFormData={setEditFormData}
                    setModalOpenDelete={setModalOpenDelete}
                    setModalOpen={setModalOpenAdd}
                />
            </div>
        </>
    );
};


const mapStateToProps = ({ attributesApp }) => {
    const {
        attributes,
        loadedAttributes,
    } = attributesApp;
    return {
        attributes,
        loadedAttributes,
    };
};
export default connect(mapStateToProps, {
    getAttributesAction: getAttributes,
})(AttributesList);
