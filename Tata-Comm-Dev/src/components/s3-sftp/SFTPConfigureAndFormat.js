import React, { useState } from 'react';
import { Label, FormGroup, Row, Button, Table } from 'reactstrap';
import { Form, Field, Formik } from 'formik';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import FileNameConfigure from './FileNameConfigure';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';
import * as Yup from 'yup';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

const ConfigureAndFormat = ({
  formRef,
  sourceType,
  audienceType,
  next,
  previous,
  intl,
  username,
  password,
  folderUrl,
  importName,
}) => {
  const { messages } = intl;

  const initialValues = {
    username: username ?? '',
    password: password ?? '',
    folderUrl: folderUrl ?? '',
    importName: importName ?? '',
  };

  const handleSubmit = (values) => {
    next();
  };

  const handlePreviousBtnClick = () => {
    previous();
  };

  const makeSchema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
    importName: Yup.string().required(),
  });

  return (
    <div>
      <p>
        <b>
          <IntlMessages id="S3SFTP.CONFIGURE_SFTP.DESCRIPTION" />
        </b>
      </p>
      <br />
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        onSubmit={handleSubmit}
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
                  identifier="username"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_SFTP.LABEL.USERNAME"
                  value={form.values.username}
                  onChange={(event) =>
                    form.setFieldValue('username', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_SFTP.PLACEHOLDER.USERNAME'}
                  dataTestId="username"
                  required={true}
                />
              </Colxx>
            </Row>
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifier="password"
                  errors={form.errors}
                  type="password"
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_SFTP.LABEL.PASSWORD"
                  value={form.values.password}
                  onChange={(event) =>
                    form.setFieldValue('password', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_SFTP.PLACEHOLDER.PASSWORD'}
                  dataTestId="password"
                  required={true}
                />
              </Colxx>
            </Row>
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifier="folderUrl"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_SFTP.LABEL.FOLDER_URL"
                  value={form.values.folderUrl}
                  onChange={(event) =>
                    form.setFieldValue('folderUrl', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_SFTP.PLACEHOLDER.FOLDER_URL'}
                  dataTestId="folderUrl"
                />
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="12" md="4" className="folder-label">
                <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.FOLDER_DESCRIPTION" />
              </Colxx>
            </Row>

            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifier="importName"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_SFTP.LABEL.IMPORT_NAME"
                  value={form.values.importName}
                  onChange={(event) =>
                    form.setFieldValue('importName', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_SFTP.PLACEHOLDER.IMPORT_NAME'}
                  dataTestId="importName"
                  required={true}
                />
              </Colxx>
            </Row>

            <FileNameConfigure />
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
      <br />
    </div>
  );
};

export default injectIntl(ConfigureAndFormat);
