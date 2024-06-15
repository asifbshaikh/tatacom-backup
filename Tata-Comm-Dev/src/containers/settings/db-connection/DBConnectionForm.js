import React, { useEffect, useState } from 'react';
import {
  Row,
  Button,
  Card,
  CardBody,
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Form, Field, Formik } from 'formik';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import * as Yup from 'yup';
import { Wizard } from 'react-albus';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { connect } from 'react-redux';
import {
  saveDBConfig,
  saveDBConfigSuccess,
  testDBConfig,
  testDBConfigSuccess,
  dbMessageClean,
  showDBConfig,
  dBConfigClearTestError,
  dBConfigClearShowError,
  editDBConfig,
  editDBConfigClearError,
} from 'redux/s3-sftp/actions';
import { NotificationManager } from 'components/common/react-notifications';
import { adminRoot } from 'constants/defaultValues';
import CommonEnums from 'enums/commonEnums';
import { UncontrolledTooltip } from 'reactstrap';

function DBConnectionForm({
  formRef,
  connectionName,
  username,
  password,
  host,
  database,
  port,
  adapter,
  encoding,
  saveDBConfigAction,
  dbMessageCleanAction,
  formSuccess,
  formError,
  next,
  previous,
  intl,
  testDBConfigAction,
  tableName,
  formTestSuccess,
  formTestError,
  showDBConfigAction,
  errorShowAdd,
  successShowAdd,
  formShowError,
  formShowSuccess,
  editFormData,
  dBConfigClearShowErrorAction,
  dBConfigClearTestErrorAction,
  editDBConfigAction,
  formEditSuccess,
  formEditError,
  editDBConfigClearErrorAction,
}) {
  const history = useHistory();
  const search = history.location;
  const params = search.state;
  const fromPage = params?.from;
  const id = params?.id;
  const editData = editFormData?.response?.db_configuration;

  const initialValues = {
    connectionName: editData?.name ?? '',
    username: editData?.username ?? '',
    password: editData?.password ?? '',
    host: editData?.host ?? '',
    database: editData?.database ?? '',
    port: editData?.port ?? '',
    adapter: editData?.adapter ?? '',
    encoding: editData?.encoding ?? '',
  };

  const initialValuesTest = {
    tableName: tableName ?? '',
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitValue, setSubmitValue] = useState('');
  const [payload, setPayload] = useState({});
  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    if (fromPage === CommonEnums.EDIT) {
      showDBConfigAction(id);
    }
    dBConfigClearTestErrorAction();
    dBConfigClearShowErrorAction();
    editDBConfigClearErrorAction();
  }, []);

  const handleSubmit = (values) => {
    if (submitValue === CommonEnums.TEST) {
      handleTestSubmit(values);
    } else if (submitValue === CommonEnums.EDIT) {
      handleEdit(values);
    } else {
      handleSave(values);
    }
  };

  const handleSave = (values) => {
    const payload = {
      db_configuration: {
        name: values?.connectionName,
        adapter: values?.adapter,
        encoding: values?.encoding,
        host: values?.host,
        username: values?.username,
        database: values?.database,
        password: values?.password,
        port: values?.port,
      },
    };
    saveDBConfigAction(payload);
  };

  const handleTestSave = (values) => {
    const data = {
      db_configuration: {
        name: payload.db_configuration.name,
        adapter: payload.db_configuration.adapter,
        encoding: payload.db_configuration.encoding,
        host: payload.db_configuration.host,
        username: payload.db_configuration.username,
        database: payload.db_configuration.database,
        password: payload.db_configuration.password,
        port: payload.db_configuration.port,
        table_name: values?.tableName,
      },
    };

    testDBConfigAction(data);
  };

  const handleTestSubmit = (values) => {
    setIsModalOpen(true);

    const payload = {
      db_configuration: {
        name: values?.connectionName,
        adapter: values?.adapter,
        encoding: values?.encoding,
        host: values?.host,
        username: values?.username,
        database: values?.database,
        password: values?.password,
        port: values?.port,
        table_name: values?.tableName,
      },
    };

    setPayload(payload);
  };

  const handleEdit = (values) => {
    const payload = {
      edit_payload: {
        db_configuration: {
          name: values?.connectionName,
          adapter: values?.adapter,
          encoding: values?.encoding,
          host: values?.host,
          username: values?.username,
          database: values?.database,
          password: values?.password,
          port: values?.port,
        },
      },
      id: id,
    };
    editDBConfigAction(payload);
  };

  const getValidationMessage = (text) => {
    return <IntlMessages id={text} />;
  };

  const makeSchema = Yup.object({
    connectionName: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    username: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    password: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    host: Yup.string().required(getValidationMessage('forms.required-message')),
    database: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    port: Yup.string().required(getValidationMessage('forms.required-message')),
    adapter: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    encoding: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
  });

  const makeTestSchema = Yup.object({
    tableName: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
  });

  useEffect(() => {
    if (formSuccess) {
      const successMsg = 'S3SFTP.DB_SETTING.MESSAGES.SUCCESS_DB_SAVE';
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        ''
      );
      dbMessageCleanAction({});
      history.push(`${adminRoot}/settings/db-connection-setup/list`);
    }
  }, [formSuccess]);

  useEffect(() => {
    if (formTestSuccess) {
      const successMsg = 'S3SFTP.DB_SETTING.MESSAGES.SUCCESS_DB_TEST';
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        ''
      );

      setIsModalOpen(false);
      dBConfigClearTestErrorAction();
      setDisabled(false);
    }
  }, [formTestSuccess]);

  useEffect(() => {
    if (formError && formError.errors) {
      NotificationManager.error(
        formError.errors,
        'Error',
        6000,
        null,
        null,
        ''
      );
      dbMessageCleanAction({});
    }
  }, [formError]);

  useEffect(() => {
    if (
      (formTestError && formTestError.error) ||
      (formTestError && formTestError.errors) ||
      (formTestError && formTestError.errorMsg)
    ) {
      const error =
        formTestError.error || formTestError.errorMsg || formTestError.errors;
      NotificationManager.error(error, 'Error', 6000, null, null, '');
      setIsModalOpen(false);
      dBConfigClearTestErrorAction();
      setDisabled(true);
    }
  }, [formTestError]);

  useEffect(() => {
    if (
      (formShowError && formShowError.error) ||
      (formShowError && formShowError.errorMsg)
    ) {
      const error = formShowError.error || formShowError.errorMsg;
      NotificationManager.error(error, 'Error', 6000, null, null, '');
      setIsModalOpen(false);
      dBConfigClearShowErrorAction();
    }
  }, [formShowError]);

  useEffect(() => {
    if (formEditSuccess) {
      const successMsg = 'S3SFTP.DB_SETTING.MESSAGES.SUCCESS_DB_SAVE';
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        ''
      );
      setIsModalOpen(false);
      history.push(`${adminRoot}/settings/db-connection-setup/list`);
      editDBConfigClearErrorAction();
    }
  }, [formEditSuccess]);

  useEffect(() => {
    if (formEditError && formEditError.errors) {
      NotificationManager.error(
        formEditError.errors,
        'Error',
        6000,
        null,
        null,
        ''
      );
      editDBConfigClearErrorAction();
      ({});
    }
  }, [formEditError]);

  return (
    <div>
      <Card>
        <CardBody className="wizard wizard-default">
          <Wizard>
            <div className="p-2">
              <h2>
                <b>
                  {fromPage === CommonEnums.NEW ? (
                    <IntlMessages id="S3SFTP.DB_SETTING.DATABASE_CONNECTION" />
                  ) : (
                    <IntlMessages id="S3SFTP.DB_SETTING.EDIT_CONNECTION" />
                  )}
                </b>
              </h2>
              <p className="mb-0">
                <IntlMessages id="S3SFTP.DB_SETTING.MANAGE" />
              </p>
              <div>
                <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.SAMPLE_DB_STRUCTURE_FOR" />
                <a
                  id="UserTootTip"
                  className="csv-file-link"
                  href="/assets/sample/AudienceDBSchemaStructureFormat.csv"
                  download
                >
                  <IntlMessages id="S3SFTP.DB_SETTING.LABEL.AUDIENCE_IMPORTS" />
                </a>
                <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.AND" />
                <a
                  id="EventToolTip"
                  className="csv-file-link"
                  href="/assets/sample/EventsDBSchemaStructureFormat.csv"
                  download
                >
                  <IntlMessages id="S3SFTP.DB_SETTING.LABEL.EVENT_IMPORTS" />
                </a>
              </div>
              <br />

              <Formik
                innerRef={formRef}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={makeSchema}
                validateOnBlur
                validateOnChange
                validateOnMount
                enableReinitialize
              >
                {(form) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Row>
                      <Colxx xxs="12" md="4" className="folder-label">
                        <IntlMessages id="S3SFTP.DB_SETTING.CONNECTION_DETAILS" />
                      </Colxx>
                    </Row>

                    <Row className="pl-2 pr-2 pb-2">
                      <Colxx xxs="12" md="4" className="text-box">
                        <FormGroupCoustom
                          identifier="connectionName"
                          errors={form.errors}
                          touched={form.touched}
                          identifierLabel="S3SFTP.DB_SETTING.LABEL.CONNECTION_NAME"
                          value={form.values.connectionName}
                          onChange={(event) =>
                            form.setFieldValue(
                              'connectionName',
                              event.target.value
                            )
                          }
                          className="form-group has-float-label"
                          placeholder={
                            'S3SFTP.DB_SETTING.PLACEHOLDER.CONNECTION_NAME'
                          }
                          dataTestId="connectionName"
                          required={true}
                        />
                      </Colxx>
                      <>
                        <i
                          id={'tooltip-connectionName'}
                          className="ml-2 info-icon iconsminds-information"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={'tooltip-connectionName'}
                        >
                          <small>
                            <IntlMessages id="S3SFTP.DB_SETTING.LABEL.CONNECTION_NAME_TOOLTIP" />
                          </small>
                        </UncontrolledTooltip>
                      </>

                      <Colxx xxs="12" md="4" className="text-box">
                        <FormGroupCoustom
                          identifier="host"
                          errors={form.errors}
                          touched={form.touched}
                          identifierLabel="S3SFTP.DB_SETTING.LABEL.HOST"
                          value={form.values.host}
                          onChange={(event) =>
                            form.setFieldValue('host', event.target.value)
                          }
                          className="form-group has-float-label"
                          placeholder={'S3SFTP.DB_SETTING.PLACEHOLDER.HOST'}
                          dataTestId="host"
                          required={true}
                        />
                      </Colxx>
                      <>
                        <i
                          id={'tooltip-host'}
                          className="ml-2 info-icon iconsminds-information"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={'tooltip-host'}
                        >
                          <small>
                            <IntlMessages id="S3SFTP.DB_SETTING.LABEL.HOST_TOOLTIP" />
                          </small>
                        </UncontrolledTooltip>
                      </>
                    </Row>

                    <Row className="p-2">
                      <Colxx xxs="12" md="4" className="text-box">
                        <FormGroupCoustom
                          identifier="database"
                          errors={form.errors}
                          touched={form.touched}
                          identifierLabel="S3SFTP.DB_SETTING.LABEL.DATABASE"
                          value={form.values.database}
                          onChange={(event) =>
                            form.setFieldValue('database', event.target.value)
                          }
                          className="form-group has-float-label"
                          placeholder={'S3SFTP.DB_SETTING.PLACEHOLDER.DATABASE'}
                          dataTestId="database"
                          required={true}
                        />
                      </Colxx>
                      <>
                        <i
                          id={'tooltip-database'}
                          className="ml-2 info-icon iconsminds-information"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={'tooltip-database'}
                        >
                          <small>
                            <IntlMessages id="S3SFTP.DB_SETTING.LABEL.DATABASE_TOOLTIP" />
                          </small>
                        </UncontrolledTooltip>
                      </>

                      <Colxx xxs="12" md="4" className="text-box">
                        <FormGroupCoustom
                          identifier="port"
                          errors={form.errors}
                          touched={form.touched}
                          identifierLabel="S3SFTP.DB_SETTING.LABEL.PORT"
                          value={form.values.port}
                          onChange={(event) =>
                            form.setFieldValue('port', event.target.value)
                          }
                          className="form-group has-float-label"
                          placeholder={'S3SFTP.DB_SETTING.PLACEHOLDER.PORT'}
                          dataTestId="port"
                          required={true}
                        />
                      </Colxx>
                      <>
                        <i
                          id={'tooltip-port'}
                          className="ml-2 info-icon iconsminds-information"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={'tooltip-port'}
                        >
                          <small>
                            <IntlMessages id="S3SFTP.DB_SETTING.LABEL.PORT_TOOLTIP" />
                          </small>
                        </UncontrolledTooltip>
                      </>
                    </Row>

                    <Row className="p-2">
                      <Colxx xxs="12" md="4" className="text-box">
                        <FormGroupCoustom
                          identifier="adapter"
                          errors={form.errors}
                          touched={form.touched}
                          identifierLabel="S3SFTP.DB_SETTING.LABEL.ADAPTER"
                          value={form.values.adapter}
                          onChange={(event) =>
                            form.setFieldValue('adapter', event.target.value)
                          }
                          className="form-group has-float-label"
                          placeholder={'S3SFTP.DB_SETTING.PLACEHOLDER.ADAPTER'}
                          dataTestId="adapter"
                          required={true}
                        />
                      </Colxx>
                      <>
                        <i
                          id={'tooltip-adapter'}
                          className="ml-2 info-icon iconsminds-information"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={'tooltip-adapter'}
                        >
                          <small>
                            <IntlMessages id="S3SFTP.DB_SETTING.LABEL.ADAPTER_TOOLTIP" />
                          </small>
                        </UncontrolledTooltip>
                      </>
                      <Colxx xxs="12" md="4" className="text-box">
                        <FormGroupCoustom
                          identifier="encoding"
                          errors={form.errors}
                          touched={form.touched}
                          identifierLabel="S3SFTP.DB_SETTING.LABEL.ENCODING"
                          value={form.values.encoding}
                          onChange={(event) =>
                            form.setFieldValue('encoding', event.target.value)
                          }
                          className="form-group has-float-label"
                          placeholder={'S3SFTP.DB_SETTING.PLACEHOLDER.ENCODING'}
                          dataTestId="encoding"
                          required={true}
                        />
                      </Colxx>
                      <>
                        <i
                          id={'tooltip-encoding'}
                          className="ml-2 info-icon iconsminds-information"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={'tooltip-encoding'}
                        >
                          <small>
                            <IntlMessages id="S3SFTP.DB_SETTING.LABEL.ENCODING_TOOLTIP" />
                          </small>
                        </UncontrolledTooltip>
                      </>
                    </Row>

                    <Row className="pr-2 pl-2 pt-2">
                      <Colxx xxs="12" md="2" className="folder-label">
                        <IntlMessages id="S3SFTP.DB_SETTING.LABEL.LOGIN_CREDENTIALS" />
                      </Colxx>
                    </Row>

                    <Row className="pr-2 pl-2 pb-2">
                      <Colxx xxs="12" md="4" className="text-box">
                        <FormGroupCoustom
                          identifier="username"
                          errors={form.errors}
                          touched={form.touched}
                          identifierLabel="S3SFTP.DB_SETTING.LABEL.USERNAME"
                          value={form.values.username}
                          onChange={(event) =>
                            form.setFieldValue('username', event.target.value)
                          }
                          className="form-group has-float-label"
                          placeholder={'S3SFTP.DB_SETTING.PLACEHOLDER.USERNAME'}
                          dataTestId="username"
                          required={true}
                        />
                      </Colxx>
                      <>
                        <i
                          id={'tooltip-username'}
                          className="ml-2 info-icon iconsminds-information"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={'tooltip-username'}
                        >
                          <small>
                            <IntlMessages id="S3SFTP.DB_SETTING.LABEL.USERNAME_TOOLTIP" />
                          </small>
                        </UncontrolledTooltip>
                      </>
                      <Colxx xxs="12" md="4" className="text-box">
                        <FormGroupCoustom
                          identifier="password"
                          errors={form.errors}
                          type="password"
                          touched={form.touched}
                          identifierLabel="S3SFTP.DB_SETTING.LABEL.PASSWORD"
                          value={form.values.password}
                          onChange={(event) =>
                            form.setFieldValue('password', event.target.value)
                          }
                          className="form-group has-float-label"
                          placeholder={'S3SFTP.DB_SETTING.PLACEHOLDER.PASSWORD'}
                          dataTestId="password"
                          required={true}
                        />
                      </Colxx>
                      <>
                        <i
                          id={'tooltip-password'}
                          className="ml-2 info-icon iconsminds-information"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={'tooltip-password'}
                        >
                          <small>
                            <IntlMessages id="S3SFTP.DB_SETTING.LABEL.PASSWORD_TOOLTIP" />
                          </small>
                        </UncontrolledTooltip>
                      </>
                    </Row>

                    <div className="p-2 bottom-buttons">
                      <Button
                        color="secondary"
                        outline
                        type="submit"
                        onClick={() => {
                          setSubmitValue('test');
                        }}
                        className="mr-2"
                      >
                        <IntlMessages id="S3SFTP.DB_SETTING.LABEL.TEST_CONNECTION" />
                      </Button>

                      {fromPage === CommonEnums.NEW ? (
                        <Button
                          color="primary"
                          onClick={() => {
                            setSubmitValue('new');
                          }}
                          type="submit"
                          className="ml-2"
                          disabled={isDisabled}
                        >
                          <IntlMessages id="S3SFTP.DB_SETTING.LABEL.SAVE_CONNECTION" />
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          type="submit"
                          onClick={() => {
                            setSubmitValue('edit');
                          }}
                          className="ml-2"
                          disabled={isDisabled}
                        >
                          <IntlMessages id="S3SFTP.DB_SETTING.LABEL.EDIT_CONNECTION" />
                        </Button>
                      )}

                      <Button
                        color="tertiary"
                        onClick={() => {
                          form.resetForm();
                          dBConfigClearShowErrorAction();
                        }}
                        className="ml-2 reset-btn"
                      >
                        <IntlMessages id="S3SFTP.DB_SETTING.LABEL.RESET" />
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <br />
            </div>
          </Wizard>
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <Formik
          onSubmit={handleTestSave}
          initialValues={initialValuesTest}
          validationSchema={makeTestSchema}
        >
          {(form) => (
            <Form>
              <ModalHeader toggle={() => setIsModalOpen(false)}>
                <IntlMessages id="S3SFTP.DB_SETTING.LABEL.TEST_CONNECTION" />
              </ModalHeader>
              <ModalBody>
                <FormGroupCoustom
                  identifier="tableName"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.DB_SETTING.LABEL.TABLE_NAME"
                  value={form.values.tableName}
                  onChange={(event) =>
                    form.setFieldValue('tableName', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.DB_SETTING.PLACEHOLDER.TABLE_NAME'}
                  dataTestId="tableName"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={form.handleSubmit}>
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
    </div>
  );
}
const mapStateToProps = ({ s3sftpApp }) => {
  const {
    selectSource: { sourceType, audienceType },
    successSaveAdd,
    errorAdd,
    loadingAdd,
    successTestAdd,
    errorTestAdd,
    loadingTestAdd,
    errorShowAdd,
    successShowAdd,
    dbConfigData,
    successEditAdd,
    errorEditAdd,
    loadingEditAdd,
  } = s3sftpApp;

  return {
    formSuccess: successSaveAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    formTestSuccess: successTestAdd,
    formTestError: errorTestAdd,
    formTestLoading: loadingTestAdd,
    formShowError: errorShowAdd,
    formShowSuccess: successShowAdd,
    editFormData: dbConfigData,
    formEditSuccess: successEditAdd,
    formEditError: errorEditAdd,
    formEditLoading: loadingEditAdd,
  };
};

export default connect(mapStateToProps, {
  saveDBConfigAction: saveDBConfig,
  dbMessageCleanAction: dbMessageClean,
  testDBConfigAction: testDBConfig,
  showDBConfigAction: showDBConfig,
  dBConfigClearShowErrorAction: dBConfigClearShowError,
  dBConfigClearTestErrorAction: dBConfigClearTestError,
  editDBConfigAction: editDBConfig,
  editDBConfigClearErrorAction: editDBConfigClearError,
})(injectIntl(DBConnectionForm));
