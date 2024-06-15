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

import { deleteCanned, deleteCannedClean } from 'redux/actions';
import { connect } from 'react-redux';

import { NotificationManager } from 'components/common/react-notifications';


const DeleteCannedModal = ({
    modalOpen, toggleModal,
    formSuccess, formError, formLoading, editFormData,
    // reloadList, setReloadList,
    deleteCannedAction, deleteCannedCleanAction
}) => {
    const closeForm = () => {
        if (modalOpen) {
            toggleModal();
            deleteCannedCleanAction({});
        }
    }

    const onDeleteContactItem = (values) => {
        if (formLoading) {
            return false;
        }
        deleteCannedAction(values);
        return false;
    };
    if (modalOpen) {
        if (formSuccess) {
            const successMsg = "CANNED_MGMT.DELETE.API.SUCCESS_MESSAGE";
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
                <IntlMessages id="CANNED_MGMT.DELETE.CONFIRM.TITLE" />
            </ModalHeader>

            <Formik initialValues={editFormData} onSubmit={onDeleteContactItem}>
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <ModalBody>
                            <IntlMessages id="CANNED_MGMT.DELETE.CONFIRM.MESSAGE" />

                            {formError && formError.errorMsg && (
                                <Alert color="danger" className="rounded">
                                    {formError.errorMsg}
                                </Alert>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" outline onClick={closeForm}>
                                <IntlMessages id="CANNED_MGMT.DELETE.CONFIRM.NO" />
                            </Button>
                            <Button color="primary">
                                <IntlMessages id="CANNED_MGMT.DELETE.CONFIRM.YES" />
                            </Button>{' '}
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

const mapStateToProps = ({ cannedsApp }) => {
    const { successDelete, errorDelete, loadingDelete } = cannedsApp;
    return { formSuccess: successDelete, formError: errorDelete, formLoading: loadingDelete };
};
export default connect(mapStateToProps, {
    deleteCannedAction: deleteCanned,
    deleteCannedCleanAction: deleteCannedClean,
})(DeleteCannedModal);