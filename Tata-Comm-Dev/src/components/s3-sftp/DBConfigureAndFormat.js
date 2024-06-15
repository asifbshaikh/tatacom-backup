import React, { useEffect, useState } from 'react';
import { Row, Button } from 'reactstrap';
import { FieldArray, Form, Formik } from 'formik';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import * as Yup from 'yup';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';
import DataTableView from 'containers/contacts/DataTableView';
import { addDataBaseConfigureFormatSuccess } from 'redux/actions';
import { connect } from 'react-redux';
import {
  getDbConnectionDropdownList,
  getTablePreview,
  clearTablePreview,
} from 'redux/s3-sftp/actions';
import { NotificationManager } from 'components/common/react-notifications';
import CommonEnums from 'enums/commonEnums';

function dbConfigureAndFormat({
  formRef,
  dbConnection,
  tableName,
  importName,
  next,
  previous,
  emailID,
  addDatabaseFormat,
  dbConnectionListAction,
  dbConnectionDropdownList,
  intl,
  getTablePreviewAction,
  errorTableAdd,
  successTableAdd,
  clearTablePreviewAction,
  previewData,
  audienceType,
  eventSelect,
  importType,
}) {
  const initialValues = {
    dbConnection: dbConnection ?? '',
    tableName: tableName ?? '',
    importName: importName ?? '',
    emailID: emailID ?? [''],
  };

  const [tableCols, setTableCols] = useState([]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    dbConnectionListAction();
    clearTablePreviewAction({});
    setShowPreviewTable(false);
  }, []);

  useEffect(() => {
    if (JSON.stringify(previewData) === '{}') {
      setShowPreviewTable(false);
    }
  }, [previewData]);

  const getDropDownValueForDbConnection = () => {
    const list = [];
    if (dbConnectionDropdownList[0]?.length > 0) {
      list.unshift({
        id: '',
        value: '',
      });
      dbConnectionDropdownList[0].forEach((element) => {
        list.push({
          id: element.id,
          value: element.name,
        });
      });
    }
    return list;
  };

  const [submitValue, setSubmitValue] = useState(CommonEnums.SUBMIT);
  const handleSubmit = (values) => {
    if (submitValue === CommonEnums.SUBMIT) {
      const param = {
        dbConnection: values.dbConnection,
        emailID: values.emailID,
        importName: values.importName,
        tableName: values.tableName,
      };
      addDatabaseFormat(param);
      next();
    } else {
      handlePreviewBtnClick(values);
      setSubmitValue(CommonEnums.SUBMIT);
    }
  };

  const handlePreviousBtnClick = () => {
    previous();
  };

  const [showPreviewTable, setShowPreviewTable] = useState(false);
  const handlePreviewBtnClick = (values) => {
    const param = {
      db_preview: {
        import_name: values.importName,
        source_id: values.dbConnection,
        source_type: 'db',
        table_name: values.tableName,
        import_type: audienceType ? audienceType : importType,
        events_name: eventSelect,
      },
    };
    getTablePreviewAction(param);
  };

  const { messages } = intl;

  const getValidationMessage = (text) => {
    return <IntlMessages id={text} />;
  };

  const makeSubmitSchema = Yup.object({
    dbConnection: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    tableName: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    importName: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),

    emailID: Yup.array()
      .of(
        Yup.string()
          .required(getValidationMessage('forms.required-message'))
          .email(messages['S3SFTP.CONFIGURE_SFTP.VALIDATION.INVALID_EMAIL'])
      )
      .min(1, getValidationMessage('forms.required-message'))
      .max(
        10,
        messages['S3SFTP.CONFIGURE_SFTP.VALIDATION.EMAIL_COUNT_EXCEEDED']
      ),
  });

  const makePreviewSchema = Yup.object({
    dbConnection: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    tableName: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    importName: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
  });

  const schema =
    submitValue === CommonEnums.SUBMIT ? makeSubmitSchema : makePreviewSchema;

  useEffect(() => {
    if (successTableAdd) {
      const items = previewData.response.data.rows;
      const headerCols = previewData.response.data.headers;
      const headers = [];

      headerCols.forEach((element) => {
        headers.push({
          Header: element,
          accessor: element,
        });
      });

      items.forEach((row) => {
        Object.values(row).forEach((key, val) => {
          Object.keys(row).forEach((item) => {
            if (row[item] === null) {
              row[item] = 'null';
            }

            if (row[item] === false || row[item] === true) {
              row[item] = row[item].toString();
            }
            if (
              typeof row[item] == 'object' &&
              Object.keys(row[item]).length === 0
            ) {
              row[item] = '{}';
            }

            if (
              typeof row[item] == 'object' &&
              Object.keys(row[item]).length > 0
            ) {
              row[item] = JSON.stringify(row[item]);
            }
          });
        });
      });

      setTableCols(headers);
      setItems(items);
      setShowPreviewTable(true);
    }
  }, [successTableAdd]);

  useEffect(() => {
    if (
      (errorTableAdd && errorTableAdd.error) ||
      (errorTableAdd && errorTableAdd.errorMsg)
    ) {
      const error = errorTableAdd.error || errorTableAdd.errorMsg;
      NotificationManager.error(error, 'Error', 6000, null, null, '');
      clearTablePreviewAction({});
    }
  }, [errorTableAdd]);

  return (
    <div>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
        validateOnBlur
        validateOnChange
        validateOnMount
      >
        {(form) => (
          <Form className="av-tooltip tooltip-label-bottom">
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifier="importName"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_DB.LABEL.IMPORT_NAME"
                  value={form.values.importName}
                  onChange={(event) =>
                    form.setFieldValue('importName', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_DB.PLACEHOLDER.IMPORT_NAME'}
                  dataTestId="importName"
                  required={true}
                />
              </Colxx>
            </Row>
            <p>
              <b>
                <IntlMessages id="S3SFTP.CONFIGURE_DB.LABEL.IMPORT_SOURCE" />
              </b>
            </p>
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifierLabel="S3SFTP.CONFIGURE_DB.LABEL.DATABASE_CONNECTION"
                  placeholder="S3SFTP.CONFIGURE_DB.PLACEHOLDER.DATABASE_CONNECTION"
                  identifier="dbConnection"
                  type="select"
                  value={form.values.importSource}
                  options={getDropDownValueForDbConnection()}
                  onChange={(event) =>
                    form.setFieldValue('dbConnection', event.target.value)
                  }
                  className="form-group has-float-label"
                  errors={form.errors}
                  touched={form.touched}
                  dataTestId="dbConnection"
                  required={true}
                />
              </Colxx>
            </Row>
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifierLabel="S3SFTP.CONFIGURE_DB.LABEL.TABLE_NAME"
                  placeholder="S3SFTP.CONFIGURE_DB.PLACEHOLDER.TABLE_NAME"
                  identifier="tableName"
                  value={form.values.tableName}
                  onChange={(event) =>
                    form.setFieldValue('tableName', event.target.value)
                  }
                  className="form-group has-float-label"
                  errors={form.errors}
                  touched={form.touched}
                  dataTestId="tableName"
                  required={true}
                />
              </Colxx>
              <Colxx xxs="12" md="4">
                <Button
                  color="primary"
                  onClick={() => {
                    setSubmitValue('preview');
                  }}
                  type="submit"
                >
                  <IntlMessages id="S3SFTP.CONFIGURE_DB.LABEL.PREVIEW" />
                </Button>
              </Colxx>
            </Row>
            {showPreviewTable && (
              <>
                <Row className="p-2 mt-4">
                  <Colxx xxs="12" md="4">
                    <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.PREVIEW" />
                  </Colxx>
                </Row>

                <DataTableView
                  colxxs="12"
                  cols={tableCols}
                  items={items}
                  key="ReactTblDBFileList"
                  noIntl
                />
              </>
            )}
            <p>
              <b>
                <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.ACTIONS" />
              </b>
            </p>

            <FieldArray
              name="emailID"
              render={(arrayHelpers) => (
                <div className="ml-2">
                  {form?.values?.emailID.map((data, index) => (
                    <div key={index}>
                      <Row>
                        <Colxx xxs="4">
                          <FormGroupCoustom
                            identifier={`emailID.${index}`}
                            dataTestId="emailID"
                            name={`emailID.${index}`}
                            errors={form.errors}
                            touched={form.touched}
                            identifierLabel="S3SFTP.IMPORT_CONFIG.LABEL.SELECT_EMAIL_ID"
                            placeholder="S3SFTP.IMPORT_CONFIG.PLACEHOLDER.SELECT_EMAIL_ID"
                            required={true}
                          />

                          {form.errors?.emailID?.[index] &&
                            form.touched?.emailID?.[index] && (
                              <div className="invalid-feedback d-block mt-n4">
                                {form.errors?.emailID?.[index]}
                              </div>
                            )}
                        </Colxx>

                        <Colxx xxs="1" className="email-action-buttons">
                          <Button
                            type="button"
                            className="close filter-by-list-close mt-0 pt-1 mr-4 bg-transparent"
                            onClick={() =>
                              form.values.emailID.length > 1 &&
                              arrayHelpers.remove(index)
                            }
                          >
                            <i className="simple-icon-trash btn-group-icon" />
                          </Button>

                          <Button
                            type="button"
                            className="close filter-by-list-close mt-0 pt-1 mr-4 bg-transparent"
                            color="secondary"
                            onClick={() => {
                              arrayHelpers.insert(index + 1, '');
                            }}
                            disabled={form.values.emailID.length > 9}
                          >
                            <i className="simple-icon-plus btn-group-icon" />
                          </Button>
                        </Colxx>
                      </Row>
                    </div>
                  ))}
                </div>
              )}
            />

            <div className="d-flex p-2">
              <h6 className="alert-message font-weight-bold">
                <IntlMessages id="S3SFTP.IMPORT_CONFIG.LABEL.EMAIL_NOTE" />
              </h6>
            </div>
            <StepperNavigationButtons
              className="m-2"
              rightBtnLabel={<IntlMessages id="S3SFTP.BUTTONS.NEXT" />}
              leftBtnLabel={<IntlMessages id="S3SFTP.BUTTONS.PREVIOUS" />}
              handleLeftBtnClick={handlePreviousBtnClick}
              handleRightBtnClick={() => {
                form.handleSubmit();
                setSubmitValue(CommonEnums.SUBMIT);
              }}
              rightBtnLabelDisable={
                !form.isValid && !(Object.keys(form.errors) > 0)
              }
            />
          </Form>
        )}
      </Formik>
      <br />
    </div>
  );
}

const mapStateToProps = ({ s3sftpApp }) => {
  const {
    dataBaseFormat,
    dbConnectionDropdownList,
    errorTableAdd,
    successTableAdd,
    previewData,
    selectSource: { audienceType, eventSelect, importType },
  } = s3sftpApp;
  return {
    ...dataBaseFormat,
    dbConnectionDropdownList,
    errorTableAdd,
    successTableAdd,
    previewData,
    audienceType,
    eventSelect,
    importType,
  };
};

export default connect(mapStateToProps, {
  addDatabaseFormat: addDataBaseConfigureFormatSuccess,
  dbConnectionListAction: getDbConnectionDropdownList,
  getTablePreviewAction: getTablePreview,
  clearTablePreviewAction: clearTablePreview,
})(injectIntl(dbConfigureAndFormat));
