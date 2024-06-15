import React, { useState } from 'react';

import { connect } from 'react-redux';


import {
    getTeams,
    getTeamClean,
} from 'redux/actions';

import ListTeamsHeading from 'containers/settings/teams/ListTeamsHeading';
// import AddNewModal from 'containers/contacts/AddNewModal';
import DeleteTeamModal from 'containers/settings/teams/DeleteTeamModal';
// import ImportModal from 'containers/contacts/ImportModal';
import ListTeamsListing from 'containers/settings/teams/ListTeamsListing';
// import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
// import useMousetrap from 'hooks/use-mousetrap';
// import { count } from 'console';


const TeamsList = ({
    match,
    teams,
    loadedTeams,
    getTeamsAction,
    getTeamCleanAction,
}) => {
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    if (!loadedTeams && !teams.length) {
        getTeamsAction();
    }
    getTeamCleanAction();

    return !loadedTeams ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListTeamsHeading
                    heading="TEAMS_SETTINGS.HEADER"
                    match={match}
                />
                <DeleteTeamModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <ListTeamsListing
                    items={teams}
                    loadedItems={loadedTeams}
                    setEditFormData={setEditFormData}
                    setModalOpenDelete={setModalOpenDelete}
                />
            </div>
        </>
    );
};


const mapStateToProps = ({ teamsApp }) => {
    const {
        teams,
        loadedTeams,
    } = teamsApp;
    return {
        teams,
        loadedTeams,
    };
};
export default connect(mapStateToProps, {
    getTeamsAction: getTeams,
    getTeamCleanAction: getTeamClean,
})(TeamsList);
