import React, { useState } from 'react';
import {
  Label,
  FormGroup,
  Row,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Form, Field, Formik } from 'formik';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import DataTableView from 'containers/contacts/DataTableView';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import * as Yup from 'yup';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

function ImportConfiguration({
  formRef,
  userID,
  emailID,
  next,
  previous,
  intl,
}) {
  const { messages } = intl;

  const columnList = [
    { id: 1, value: 'user Id' },
    { id: 2, value: 'email Id' },
    { id: 3, value: 'mobile no' },
    { id: 4, value: 'address' },
    { id: 5, value: 'DOB' },
  ];

  const emailList = [
    { id: 1, value: '' },
    { id: 2, value: 'ab@test.com' },
    { id: 3, value: 'cd@test.com' },
    { id: 4, value: 'ef@test.com' },
    { id: 5, value: 'xy@test.com' },
  ];

  const datatypeList = [
    { id: 1, value: 'String' },
    { id: 2, value: 'Number' },
    { id: 3, value: 'Boolean' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const initialValues = {
    userID: userID ?? '',
    emailID: emailID ?? '',
  };

  const [count, setCount] = useState('5');
  const handleSubmit = (values) => {
    next();
  };

  const handlePreviousBtnClick = () => {
    previous();
  };

  const makeSchema = Yup.object({
    userID: Yup.string().required(),
    emailID: Yup.string().required(),
  });

  return (
    <div>
      <p>
        <b>
          <IntlMessages id="S3SFTP.IMPORT_CONFIG.MAP_COLUMNS" />
        </b>
      </p>
      <br />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        innerRef={formRef}
        validationSchema={makeSchema}
        validateOnBlur
        validateOnChange
        validateOnMount
      >
        {(form) => (
          <Form className="av-tooltip tooltip-label-bottom">
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.USER_ID"
                  placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.USER_ID"
                  identifier="userID"
                  type="select"
                  value={form.values.userID}
                  options={columnList}
                  onChange={(event) =>
                    form.setFieldValue('userID', event.target.value)
                  }
                  className="form-group has-float-label"
                  errors={form.errors}
                  touched={form.touched}
                  dataTestId="userID"
                  required={true}
                />
              </Colxx>
            </Row>

            <Separator className="mb-4" />

            <div className="pb-5">
              <b>
                <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.TOTAL_COLUMNS" /> :{' '}
                {count}
              </b>
            </div>

            <div className="pb-5">
              <table className="table  pb-5">
                <thead>
                  <tr>
                    <th>
                      <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.COLUMN_NAME" />
                    </th>
                    <th className="text-center">
                      <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.MAP_ATTRIBUTE" />
                    </th>
                    <th className="text-center">
                      <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.MORE_ACTION" />
                    </th>
                  </tr>
                  <tr>
                    <td className="">
                      <p>
                        <b>Email</b>
                      </p>
                      <span>test@testmail.com</span>
                    </td>
                    <td>
                      <div className="attribute-row">
                        <FormGroupCoustom
                          identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.ATTRIBUTE"
                          placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.ATTRIBUTE"
                          identifier=""
                          type="select"
                          value={form.values.userID}
                          options={columnList}
                          onChange={(event) => {}}
                          className="form-group has-float-label map-attribute-select"
                          errors={form.errors}
                          touched={form.touched}
                          dataTestId="userID"
                        />

                        <FormGroupCoustom
                          identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.DATA_TYPE"
                          placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.DATA_TYPE"
                          identifier=""
                          type="select"
                          value={form.values.userID}
                          options={datatypeList}
                          onChange={(event) => {}}
                          className="form-group has-float-label map-attribute-select"
                          errors={form.errors}
                          touched={form.touched}
                          dataTestId="userID"
                        />
                      </div>
                    </td>
                    <td>
                      <p className="attribute-row">Marked as user identifier</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <b>Name</b>
                      </p>
                      <span>testuser</span>
                    </td>
                    <td>
                      <div className="attribute-row">
                        <FormGroupCoustom
                          identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.ATTRIBUTE"
                          placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.ATTRIBUTE"
                          identifier=""
                          type="select"
                          value={form.values.userID}
                          options={columnList}
                          onChange={(event) =>
                            form.setFieldValue('userID', event.target.value)
                          }
                          className="form-group has-float-label map-attribute-select"
                          errors={form.errors}
                          touched={form.touched}
                          dataTestId="userID"
                        />

                        <FormGroupCoustom
                          identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.DATA_TYPE"
                          placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.DATA_TYPE"
                          identifier=""
                          type="select"
                          value={form.values.userID}
                          options={datatypeList}
                          onChange={(event) =>
                            form.setFieldValue('userID', event.target.value)
                          }
                          className="form-group has-float-label  map-attribute-select"
                          errors={form.errors}
                          touched={form.touched}
                          dataTestId="userID"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="p-2 attribute-row">
                        <p>
                          <span
                            className="plus-button-style  pl-2"
                            role="button"
                            tabIndex={0}
                            data-testid="addBtnIcon"
                            onClick={() => {}}
                            onKeyDown={() => false}
                          >
                            <i className="simple-icon-control-end btn-group-icon" />
                            <span className="add-attribute pl-2">
                              <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.SKIP_COLUMN" />
                            </span>
                          </span>
                        </p>

                        <p>
                          <span
                            className="plus-button-style  pl-5"
                            role="button"
                            tabIndex={0}
                            data-testid="addBtnIcon"
                            onClick={() => {
                              openModal();
                            }}
                            onKeyDown={() => false}
                          >
                            <i className="simple-icon-plus btn-group-icon" />
                            <span className="add-attribute pl-2">
                              <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.ADD_ATTRIBUTE" />
                            </span>
                          </span>
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="">
                      <p>
                        <b>First Name</b>
                      </p>
                      <span>Test name</span>
                    </td>
                    <td>
                      <div className="attribute-row">
                        <FormGroupCoustom
                          identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.ATTRIBUTE"
                          placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.ATTRIBUTE"
                          identifier=""
                          type="select"
                          value={form.values.userID}
                          options={columnList}
                          onChange={(event) =>
                            form.setFieldValue('userID', event.target.value)
                          }
                          className="form-group has-float-label map-attribute-select"
                          errors={form.errors}
                          touched={form.touched}
                          dataTestId="userID"
                        />

                        <FormGroupCoustom
                          identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.DATA_TYPE"
                          placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.DATA_TYPE"
                          identifier=""
                          type="select"
                          value={form.values.userID}
                          options={datatypeList}
                          onChange={(event) =>
                            form.setFieldValue('userID', event.target.value)
                          }
                          className="form-group has-float-label map-attribute-select"
                          errors={form.errors}
                          touched={form.touched}
                          dataTestId="userID"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="p-2 attribute-row">
                        <p>
                          <span
                            className="plus-button-style  pl-2"
                            role="button"
                            tabIndex={0}
                            data-testid="addBtnIcon"
                            onClick={() => {}}
                            onKeyDown={() => false}
                          >
                            <i className="simple-icon-control-end btn-group-icon" />
                            <span className="add-attribute pl-2">
                              <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.SKIP_COLUMN" />
                            </span>
                          </span>
                        </p>

                        <p>
                          <span
                            className="plus-button-style  pl-5"
                            role="button"
                            tabIndex={0}
                            data-testid="addBtnIcon"
                            onClick={() => {
                              openModal();
                            }}
                            onKeyDown={() => false}
                          >
                            <i className="simple-icon-plus btn-group-icon" />
                            <span className="add-attribute pl-2">
                              <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.ADD_ATTRIBUTE" />
                            </span>
                          </span>
                        </p>
                      </div>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>

            <p>
              <b>
                <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.ACTIONS" />
              </b>
            </p>

            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.SELECT_EMAIL_ID"
                  placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.SELECT_EMAIL_ID"
                  identifier="emailID"
                  type="select"
                  value={form.values.emailID}
                  options={emailList}
                  onChange={(event) =>
                    form.setFieldValue('emailID', event.target.value)
                  }
                  className="form-group has-float-label"
                  errors={form.errors}
                  touched={form.touched}
                  dataTestId="emailID"
                  required={true}
                />
              </Colxx>
            </Row>

            <div className="d-flex p-2">
              <h6 className="message-popup font-weight-bold">
                <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.EMAIL_NOTE" />
              </h6>
            </div>

            <StepperNavigationButtons
              className="m-2"
              rightBtnLabel={<IntlMessages id="S3SFTP.BUTTONS.NEXT" />}
              leftBtnLabel={<IntlMessages id="S3SFTP.BUTTONS.PREVIOUS" />}
              handleLeftBtnClick={handlePreviousBtnClick}
              handleRightBtnClick={handleSubmit}
              rightBtnLabelDisable={
                !form.isValid && !(Object.keys(form.errors) > 0)
              }
            />
          </Form>
        )}
      </Formik>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <Formik onSubmit={() => {}} initialValues={{}}>
          {({ handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <ModalHeader toggle={() => setIsModalOpen(false)}>
                <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.CREATE_NEW_ATTRIBUTE" />
              </ModalHeader>
              <ModalBody>
                <FormGroupCoustom
                  identifier="templateName"
                  identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.ATTRIBUTE_NAME"
                  placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.ATTRIBUTE_NAME"
                />

                <FormGroupCoustom
                  identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.DATA_TYPE"
                  placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.DATA_TYPE"
                  identifier=""
                  type="select"
                  value={''}
                  options={datatypeList}
                  onChange={() => {}}
                  className="form-group has-float-label"
                  errors={errors}
                  touched={touched}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => setIsModalOpen(false)}>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.SAVE" />
                </Button>{' '}
                <Button color="secondary" onClick={() => setIsModalOpen(false)}>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CANCEL" />
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
      <br />
    </div>
  );
}

export default injectIntl(ImportConfiguration);
