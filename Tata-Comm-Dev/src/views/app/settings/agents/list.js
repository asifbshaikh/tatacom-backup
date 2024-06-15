import React, { useState } from 'react';

import { connect } from 'react-redux';


import {
    getAgents,
} from 'redux/actions';

import ListAgentsHeading from 'containers/settings/agents/ListAgentsHeading';
import AddAgentModal from 'containers/settings/agents/AddAgentModal';
import DeleteAgentModal from 'containers/settings/agents/DeleteAgentModal';
// import ImportModal from 'containers/contacts/ImportModal';
import ListAgentsListing from 'containers/settings/agents/ListAgentsListing';
// import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
// import useMousetrap from 'hooks/use-mousetrap';
// import { count } from 'console';


const AgentsList = ({
    match,
    agents,
    loadedAgents,
    getAgentsAction,
}) => {
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    if (!loadedAgents && !agents.length) {
        getAgentsAction();
    }

    return !loadedAgents ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListAgentsHeading
                    heading="AGENT_MGMT.HEADER"
                    match={match}
                    toggleModal={() => setModalOpenAdd(!modalOpenAdd)}
                />
                <DeleteAgentModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <AddAgentModal
                    modalOpen={modalOpenAdd}
                    toggleModal={() => {
                        setModalOpenAdd(!modalOpenAdd)
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <ListAgentsListing
                    items={agents}
                    loadedItems={loadedAgents}
                    setEditFormData={setEditFormData}
                    setModalOpenDelete={setModalOpenDelete}
                    setModalOpen={setModalOpenAdd}
                />
            </div>
        </>
    );
};


const mapStateToProps = ({ agentsApp }) => {
    const {
        agents,
        loadedAgents,
    } = agentsApp;
    return {
        agents,
        loadedAgents,
    };
};
export default connect(mapStateToProps, {
    getAgentsAction: getAgents,
})(AgentsList);
