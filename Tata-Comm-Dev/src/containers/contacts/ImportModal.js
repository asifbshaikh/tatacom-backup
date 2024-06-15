/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
import React from 'react';

// import axios from 'axios';

import {
  // CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Input,
  // Label,
  FormText,
  FormGroup,
  Input,
  // Form,
  Alert,
} from 'reactstrap';


import {
  Formik,
  Form,
  // Field
} from 'formik';
import IntlMessages from 'helpers/IntlMessages';

import { importContactItem, importContactItemClean } from 'redux/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';

const ImportModal = ({ modalOpen, toggleModal, formSuccess, formError, formLoading, reloadList, setReloadList, importContactItemAction, importContactItemCleanAction }) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      importContactItemCleanAction({});
    }
  }

  const onImportContactItem = (values) => {
    if (formLoading) {
      return false;
    }
    const formData = new FormData();
    formData.append('import_file', values.import_file);
     importContactItemAction(formData);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      closeForm();
      setReloadList(reloadList + 1);
      NotificationManager.success(
        <IntlMessages id="IMPORT_CONTACTS.SUCCESS_MESSAGE" />,
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
      toggle={toggleModal}
      // wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="IMPORT_CONTACTS.TITLE" />
      </ModalHeader>

      <Formik onSubmit={onImportContactItem} initialValues={{ import_file: '' }}>
        {/* {({ errors, touched }) => ( */}
        {({ handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup className="form-group has-float-label">
                <FormText color="muted">
                  <IntlMessages id="IMPORT_CONTACTS.DESC" /> {'  '}
                  <a className='btn-link' href='/assets/sample/import-contacts-sample.csv' download>
                    <IntlMessages id="IMPORT_CONTACTS.DOWNLOAD_LABEL" />
                  </a>
                </FormText>
              </FormGroup>
              <FormGroup className="form-group has-float-label">
                <FormText color="muted">
                  <IntlMessages id="IMPORT_CONTACTS.FORM.LABEL" /> {'  '}
                  <Input name="import_file" type="file" onChange={(event) => {
                    setFieldValue('import_file', event.currentTarget.files[0], false);
                  }} />
                </FormText>
              </FormGroup>

              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}

              {/* <FormGroupCoustom identifier='import_file' type="file" errors={errors} touched={touched} /> */}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={closeForm}>
                <IntlMessages id="IMPORT_CONTACTS.FORM.CANCEL" />
              </Button>
              <Button color="primary">
                <IntlMessages id="IMPORT_CONTACTS.FORM.SUBMIT" />
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
  const { successImport, errorImport, loadingImport } = contactsApp;
  return { formSuccess: successImport, formError: errorImport, formLoading: loadingImport };
};
export default connect(mapStateToProps, {
  importContactItemAction: importContactItem,
  importContactItemCleanAction: importContactItemClean,
})(ImportModal);