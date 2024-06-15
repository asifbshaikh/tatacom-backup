/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */

import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap';


import {
    Formik,
    Form,
} from 'formik';
import IntlMessages from 'helpers/IntlMessages';

import { deleteCampaign, deleteCampaignClean } from 'redux/actions';
import { connect } from 'react-redux';

import { NotificationManager } from 'components/common/react-notifications';


const DeleteCampaignModal = ({
    modalOpen, toggleModal,
    formSuccess, formError, formLoading, editFormData,
    // reloadList, setReloadList,
    deleteCampaignAction, deleteCampaignCleanAction
}) => {
    const closeForm = () => {
        if (modalOpen) {
            toggleModal();
            deleteCampaignCleanAction({});
        }
    }

    const onDeleteContactItem = (values) => {
        if (formLoading) {
            return false;
        }
        const resp = deleteCampaignAction(values);
        return false;
    };
    if (modalOpen) {
        if (formSuccess) {
            const successMsg = "CAMPAIGN.DELETE.API.SUCCESS_MESSAGE";
            closeForm();
            NotificationManager.success(
                <IntlMessages id={successMsg} />,
                'Success',
                6000,
                null,
                null,
                '', // className
            );
        }
    }

    return (
        <Modal
            isOpen={modalOpen}
            toggle={closeForm}
            // wrapClassName="modal-right"
            backdrop="static"
        >
            <ModalHeader toggle={closeForm}>
                <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.TITLE" values={{
                    campaignName: editFormData.campaign_display_name,
                }} />
            </ModalHeader>

            <Formik initialValues={editFormData} onSubmit={onDeleteContactItem}>
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <ModalBody>
                            <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.MESSAGE" />

                            {formError && formError.errorMsg && (
                                <Alert color="danger" className="rounded">
                                    {formError.errorMsg}
                                </Alert>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" outline onClick={closeForm}>
                                <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.NO" />
                            </Button>
                            <Button color="primary">
                                <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.YES" />
                            </Button>{' '}
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

const mapStateToProps = ({ campaignsApp }) => {
    const { successDelete, errorDelete, loadingDelete } = campaignsApp;
    return { formSuccess: successDelete, formError: errorDelete, formLoading: loadingDelete };
};
export default connect(mapStateToProps, {
    deleteCampaignAction: deleteCampaign,
    deleteCampaignCleanAction: deleteCampaignClean,
})(DeleteCampaignModal);