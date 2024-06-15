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
  FormGroup,
  Input,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import IntlMessages, { intlDirectMessage } from 'helpers/IntlMessages';
import { deleteTeam, deleteTeamClean } from 'redux/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import * as Yup from 'yup';

const DeleteTeamModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  deleteTeamAction,
  deleteTeamCleanAction,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      deleteTeamCleanAction({});
    }
  };

  const onDeleteContactItem = (values) => {
    if (formLoading) {
      return false;
    }
    deleteTeamAction(values);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = 'TEAMS_SETTINGS.DELETE.API.SUCCESS_MESSAGE';
      closeForm();
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        '' // className
      );
    }
  }

  const deleteTeamValidationSchema = Yup.object().shape({
    confirmationText: Yup.string().required(
      <IntlMessages id="ATTRIBUTES_MGMT.DELETE.CONFIRM.VALIDATION.FIELD_REQUIRED" />
    ),
  });

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages
          id="TEAMS_SETTINGS.DELETE.CONFIRM.TITLE"
          values={{
            teamName: editFormData.name,
          }}
        />
      </ModalHeader>

      <Formik
        initialValues={editFormData}
        onSubmit={onDeleteContactItem}
        validationSchema={deleteTeamValidationSchema}
      >
        {({ handleSubmit, values, errors, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <IntlMessages id="TEAMS_SETTINGS.DELETE.CONFIRM.MESSAGE" />
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
                      id: 'TEAMS_SETTINGS.DELETE.CONFIRM.PLACE_HOLDER',
                    },
                    {
                      teamName: editFormData.name,
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
                <IntlMessages id="TEAMS_SETTINGS.DELETE.CONFIRM.NO" />
              </Button>
              <Button
                color="primary"
                type="submit"
                title={`${intlDirectMessage({
                  id: 'ATTRIBUTES_MGMT.DELETE.CONFIRM.YES',
                })} ${editFormData.name}`}
                disabled={editFormData.name !== values['confirmationText']}
              >
                <div className="text-truncate btn-mw-200">
                  <IntlMessages id="TEAMS_SETTINGS.DELETE.CONFIRM.YES" />{' '}
                  {editFormData.name}
                </div>
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ teamsApp }) => {
  const { successDelete, errorDelete, loadingDelete } = teamsApp;
  return {
    formSuccess: successDelete,
    formError: errorDelete,
    formLoading: loadingDelete,
  };
};
export default connect(mapStateToProps, {
  deleteTeamAction: deleteTeam,
  deleteTeamCleanAction: deleteTeamClean,
})(DeleteTeamModal);
