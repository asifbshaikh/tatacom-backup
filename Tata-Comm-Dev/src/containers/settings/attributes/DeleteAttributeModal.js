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
  Input,
  FormGroup,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import IntlMessages, { intlDirectMessage } from 'helpers/IntlMessages';
import { deleteAttribute, deleteAttributeClean } from 'redux/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import * as Yup from 'yup';

const DeleteAttributeModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  deleteAttributeAction,
  deleteAttributeCleanAction,
}) => {
  const deleteAttributeValidationSchema = Yup.object().shape({
    confirmationText: Yup.string().required(
      <IntlMessages id="ATTRIBUTES_MGMT.DELETE.CONFIRM.VALIDATION.FIELD_REQUIRED" />
    ),
  });
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      deleteAttributeCleanAction({});
    }
  };

  const onDeleteContactItem = (values) => {
    if (formLoading) {
      return false;
    }
    deleteAttributeAction(values);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = 'ATTRIBUTES_MGMT.DELETE.API.SUCCESS_MESSAGE';
      closeForm();
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages
          id="ATTRIBUTES_MGMT.DELETE.CONFIRM.TITLE"
          values={{
            attributeName: editFormData.attribute_display_name,
          }}
        />
      </ModalHeader>
      <Formik
        initialValues={editFormData}
        onSubmit={onDeleteContactItem}
        validationSchema={deleteAttributeValidationSchema}
        validateOnBlur
        validateOnChange
      >
        {({ handleSubmit, values, errors, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <IntlMessages id="ATTRIBUTES_MGMT.DELETE.CONFIRM.MESSAGE" />
                <FormGroup className="form-group">
                  <Input
                    type="text"
                    name="confirmationText"
                    value={values.confirmationText}
                    onChange={(e) => {
                      setFieldValue('confirmationText', e.target.value);
                    }}
                    placeholder={intlDirectMessage(
                      {
                        id: 'ATTRIBUTES_MGMT.DELETE.CONFIRM.PLACE_HOLDER',
                      },
                      {
                        attributeName: editFormData.attribute_display_name,
                      }
                    )}
                    noLable
                  />
                  {errors && errors['confirmationText'] && (
                    <div className="invalid-feedback d-block">
                      {errors['confirmationText']}
                    </div>
                  )}
                </FormGroup>
                {formError && formError.errorMsg && (
                  <Alert color="danger" className="rounded">
                    {formError.errorMsg}
                  </Alert>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" outline onClick={closeForm}>
                  <IntlMessages id="ATTRIBUTES_MGMT.DELETE.CONFIRM.NO" />
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  title={`${intlDirectMessage({
                    id: 'ATTRIBUTES_MGMT.DELETE.CONFIRM.YES',
                  })} ${editFormData.attribute_display_name}`}
                  disabled={
                    editFormData.attribute_display_name !==
                    values['confirmationText']
                  }
                >
                  <div className="text-truncate btn-mw-200">
                    <IntlMessages id="ATTRIBUTES_MGMT.DELETE.CONFIRM.YES" />{' '}
                    {editFormData.attribute_display_name}
                  </div>
                </Button>
              </ModalFooter>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ attributesApp }) => {
  const { successDelete, errorDelete, loadingDelete } = attributesApp;
  return {
    formSuccess: successDelete,
    formError: errorDelete,
    formLoading: loadingDelete,
  };
};
export default connect(mapStateToProps, {
  deleteAttributeAction: deleteAttribute,
  deleteAttributeCleanAction: deleteAttributeClean,
})(DeleteAttributeModal);
