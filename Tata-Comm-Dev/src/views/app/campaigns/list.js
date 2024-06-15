import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';


import {
    getCampaigns,
} from 'redux/actions';

import ListCampaignsHeading from 'containers/campaigns/ListCampaignsHeading';
import AddCampaignModal from 'containers/campaigns/AddCampaignModal';
import DeleteCampaignModal from 'containers/campaigns/DeleteCampaignModal';
// import ImportModal from 'containers/contacts/ImportModal';
import ListCampaignsListing from 'containers/campaigns/ListCampaignsListing';
// import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
// import useMousetrap from 'hooks/use-mousetrap';
// import { count } from 'console';


const CampaignsList = ({
    match,
    campaigns,
    loadedCampaigns,
    getCampaignsAction,
}) => {
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        getCampaignsAction();
    }, []);
    const isOngoingType = (campaigntypeParam) => {
        if (campaigntypeParam) {
            return campaigntypeParam === 'ongoing';
        }
        return match.params.campaigntype === 'ongoing';
    }

    return !loadedCampaigns ? (
        <div className="loading" />
    ) : (
        <>
            <div className="app-row1">
                <ListCampaignsHeading
                    heading={`${isOngoingType() ? "CAMPAIGN.ONGOING.HEADER" : "CAMPAIGN.ONE_OFF.HEADER"}`}
                    match={match}
                    toggleModal={() => setModalOpenAdd(!modalOpenAdd)}
                    addLabel={`${isOngoingType() ? "CAMPAIGN.HEADER_BTN_TXT.ONGOING" : "CAMPAIGN.HEADER_BTN_TXT.ONE_OFF"}`}
                />
                <DeleteCampaignModal
                    modalOpen={modalOpenDelete}
                    toggleModal={() => {
                        setModalOpenDelete(!modalOpenDelete);
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                />
                <AddCampaignModal
                    modalOpen={modalOpenAdd}
                    toggleModal={() => {
                        setModalOpenAdd(!modalOpenAdd)
                        setEditFormData({}); // reset edit form
                    }}
                    editFormData={editFormData}
                    isOngoingType={isOngoingType}
                />
                <ListCampaignsListing
                    match={match}
                    items={campaigns}
                    loadedItems={loadedCampaigns}
                    setEditFormData={setEditFormData}
                    setModalOpenDelete={setModalOpenDelete}
                    setModalOpen={setModalOpenAdd}
                    isOngoingType={isOngoingType}
                />
            </div>
        </>
    );
};


const mapStateToProps = ({ campaignsApp }) => {
    const {
        campaigns,
        loadedCampaigns,
    } = campaignsApp;
    return {
        campaigns,
        loadedCampaigns,
    };
};
export default connect(mapStateToProps, {
    getCampaignsAction: getCampaigns,
})(CampaignsList);
