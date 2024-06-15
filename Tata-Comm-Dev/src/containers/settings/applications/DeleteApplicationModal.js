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

import { deleteApplication, deleteApplicationClean } from 'redux/actions';
import { connect } from 'react-redux';

import { NotificationManager } from 'components/common/react-notifications';


const DeleteApplicationModal = ({
    modalOpen, toggleModal,
    formSuccess, formError, formLoading, editFormData,
    // reloadList, setReloadList,
    deleteApplicationAction, deleteApplicationCleanAction,
    isHookTypeInbox
}) => {
    const closeForm = () => {
        if (modalOpen) {
            toggleModal();
            deleteApplicationCleanAction({});
        }
    }

    const onDeleteContactItem = (values) => {
        if (formLoading) {
            return false;
        }
         deleteApplicationAction(values);
        return false;
    };
    if (modalOpen) {
        if (formSuccess) {
            const successMsg = "INTEGRATION_APPS.DELETE.API.SUCCESS_MESSAGE";
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
    const deleteTitle = isHookTypeInbox() ? 'INTEGRATION_APPS.DELETE.TITLE.INBOX' : 'INTEGRATION_APPS.DELETE.TITLE.ACCOUNT';
    const deleteMessage = isHookTypeInbox() ? 'INTEGRATION_APPS.DELETE.MESSAGE.INBOX' : 'INTEGRATION_APPS.DELETE.MESSAGE.ACCOUNT';
    const confirmText = isHookTypeInbox() ? 'INTEGRATION_APPS.DELETE.CONFIRM_BUTTON_TEXT.INBOX' : 'INTEGRATION_APPS.DELETE.CONFIRM_BUTTON_TEXT.ACCOUNT';
    const cancelText = 'INTEGRATION_APPS.DELETE.CANCEL_BUTTON_TEXT';

    return (
        <Modal
            isOpen={modalOpen}
            toggle={closeForm}
            // wrapClassName="modal-right"
            backdrop="static"
        >
            <ModalHeader toggle={closeForm}>
                <IntlMessages id={deleteTitle} />
            </ModalHeader>

            <Formik initialValues={editFormData} onSubmit={onDeleteContactItem}>
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <ModalBody>
                            <IntlMessages id={deleteMessage} />

                            {formError && formError.errorMsg && (
                                <Alert color="danger" className="rounded">
                                    {formError.errorMsg}
                                </Alert>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" outline onClick={closeForm}>
                                <IntlMessages id={cancelText} />
                            </Button>
                            <Button color="primary">
                                <IntlMessages id={confirmText} />
                            </Button>{' '}
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

const mapStateToProps = ({ applicationsApp }) => {
    const { successDelete, errorDelete, loadingDelete } = applicationsApp;
    return { formSuccess: successDelete, formError: errorDelete, formLoading: loadingDelete };
};
export default connect(mapStateToProps, {
    deleteApplicationAction: deleteApplication,
    deleteApplicationCleanAction: deleteApplicationClean,
})(DeleteApplicationModal);