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

import { deleteLabel, deleteLabelClean } from 'redux/actions';
import { connect } from 'react-redux';

import { NotificationManager } from 'components/common/react-notifications';


const DeleteLabelModal = ({
    modalOpen, toggleModal,
    formSuccess, formError, formLoading, editFormData,
    // reloadList, setReloadList,
    deleteLabelAction, deleteLabelCleanAction
}) => {
    const closeForm = () => {
        if (modalOpen) {
            toggleModal();
            deleteLabelCleanAction({});
        }
    }

    const onDeleteContactItem = (values) => {
        if (formLoading) {
            return false;
        }
       deleteLabelAction(values);
        return false;
    };
    if (modalOpen) {
        if (formSuccess) {
            const successMsg = "LABEL_MGMT.DELETE.API.SUCCESS_MESSAGE";
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
                <IntlMessages id="LABEL_MGMT.DELETE.CONFIRM.TITLE" />
            </ModalHeader>

            <Formik initialValues={editFormData} onSubmit={onDeleteContactItem}>
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <ModalBody>
                            <IntlMessages id="LABEL_MGMT.DELETE.CONFIRM.MESSAGE" />

                            {formError && formError.errorMsg && (
                                <Alert color="danger" className="rounded">
                                    {formError.errorMsg}
                                </Alert>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" outline onClick={closeForm}>
                                <IntlMessages id="LABEL_MGMT.DELETE.CONFIRM.NO" />
                            </Button>
                            <Button color="primary">
                                <IntlMessages id="LABEL_MGMT.DELETE.CONFIRM.YES" />
                            </Button>{' '}
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

const mapStateToProps = ({ labelsApp }) => {
    const { successDelete, errorDelete, loadingDelete } = labelsApp;
    return { formSuccess: successDelete, formError: errorDelete, formLoading: loadingDelete };
};
export default connect(mapStateToProps, {
    deleteLabelAction: deleteLabel,
    deleteLabelCleanAction: deleteLabelClean,
})(DeleteLabelModal);