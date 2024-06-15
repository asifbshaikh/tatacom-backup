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
  Label,
  Alert,
  Badge,
} from 'reactstrap';

import { Formik, Form } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import { mergeContactItem, mergeContactItemClean } from 'redux/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import ReactAutoSugegstContact from 'containers/contacts/ReactAutoSugegstContact';

const ContactCard = ({ editFormData }) => {
  return (
    <div className="d-flex flex-row mb-3 p-2 border">
      <div className="pl-3 pr-2">
        <div className="font-weight-medium mb-0">
          {editFormData.name}
          <span className="float-rightaa ml-1">(ID: {editFormData.id})</span>
        </div>
        <div className="text-muted mb-0 text-small">
          <i className="simple-icon-envelope" /> {` `}
          {editFormData.email}
        </div>
      </div>
    </div>
  );
};

const MergeModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  mergeContactItemAction,
  mergeContactItemCleanAction,
  selectedSuggestion,
  setSelectedSuggestion,
}) => {
  const closeForm = (isSuccess) => {
    if (modalOpen) {
      if (isSuccess === 'yes') {
        mergeContactItemCleanAction({});
      }
      setSelectedSuggestion(false);
      toggleModal(isSuccess);
    }
  };

  const onMergeContactItem = (values) => {
    if (formLoading) {
      return false;
    }
    mergeContactItemAction(values);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      closeForm('yes');
      NotificationManager.success(
        'Saved successfully',
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }

  const initialValues = {
    base_contact_id: editFormData ? editFormData.id : '',
    mergee_contact_id: selectedSuggestion ? selectedSuggestion.id : '',
  };

  const onSuggestionSelected = (e, { suggestion }) => {
    setSelectedSuggestion(suggestion);
  };

  return (
    <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
      <ModalHeader toggle={closeForm}>
        <IntlMessages id="contacts.merge-modal-title" />
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onMergeContactItem}
      >
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <p>
                <IntlMessages id="contacts.merge-modal-msg" />
              </p>
              <div>
                <Label>
                  <IntlMessages id="contacts.primary" />
                </Label>
                <p className="d-sm-inline-block mb-1">
                  <Badge className="ml-1" color="info" pill>
                    <IntlMessages id="contacts.primary_tag" />
                  </Badge>
                </p>
                <ContactCard editFormData={editFormData} />
              </div>
              <div>
                <Label>
                  <IntlMessages id="contacts.secondry" />
                </Label>
                <p className="d-sm-inline-block mb-1">
                  <Badge className="ml-1" color="danger" pill>
                    <IntlMessages id="contacts.secondry_tag" />
                  </Badge>
                </p>

                <ReactAutoSugegstContact
                  onSuggestionSelected={onSuggestionSelected}
                  currentContact={editFormData}
                />
                {selectedSuggestion && (
                  <ContactCard editFormData={selectedSuggestion} />
                )}
              </div>
              {selectedSuggestion && (
                <div className="d-flex flex-row mb-3 p-2 border">
                  <div className="pl-3 pr-2">
                    <div className="font-weight-medium mb-0">
                      <IntlMessages id="contacts.summary" />
                    </div>
                    <div className="font-weight-medium mb-0">
                      <i className="iconsminds-close" />
                      <IntlMessages id="contacts.merge.summary-text-one-part-one" />{' '}
                      {selectedSuggestion.name}{' '}
                      <IntlMessages id="contacts.merge.summary-text-one-part-two" />
                    </div>
                    <div className="text-muted mb-0 text-small">
                      <i className="iconsminds-yes" />{' '}
                      <IntlMessages id="contacts.merge.summary-text-two-part-one" />{' '}
                      {selectedSuggestion.name}{' '}
                      <IntlMessages id="contacts.merge.summary-text-two-part-two" />{' '}
                      {editFormData.name}.
                    </div>
                  </div>
                </div>
              )}
              {errors.mergee_contact_id && touched.mergee_contact_id && (
                <div className="invalid-feedback d-block">
                  {errors.mergee_contact_id}
                </div>
              )}
              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="pages.cancel" />
              </Button>
              <Button
                color="primary"
                disabled={
                  selectedSuggestion ? (!formLoading ? false : true) : true
                }
                className={`btn-multiple-state ${
                  formLoading ? 'show-spinner' : ''
                }`}
              >
                <span className="spinner d-inline-block">
                  <span className="bounce1" />
                  <span className="bounce2" />
                  <span className="bounce3" />
                </span>
                <span className="label">
                  <IntlMessages id="pages.submit" />
                </span>
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { contactsApp } = state;
  const { successMerge, errorMerge, loadingMerge } = contactsApp;
  return {
    formSuccess: successMerge,
    formError: errorMerge,
    formLoading: loadingMerge,
  };
};
export default connect(mapStateToProps, {
  mergeContactItemAction: mergeContactItem,
  mergeContactItemCleanAction: mergeContactItemClean,
})(MergeModal);
