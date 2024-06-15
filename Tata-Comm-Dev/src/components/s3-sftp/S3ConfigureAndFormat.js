import React from 'react';
import { Label, FormGroup, Row } from 'reactstrap';
import { Form, Field, Formik } from 'formik';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import * as Yup from 'yup';
import FileNameConfigure from './FileNameConfigure';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';

function s3ConfigureAndFormat({
  formRef,
  s3bucketname,
  accessKey,
  secretKey,
  region,
  folderPath,
  importName,
  next,
  previous,
  intl,
}) {
  const initialValues = {
    s3bucketname: s3bucketname ?? '',
    accessKey: accessKey ?? '',
    secretKey: secretKey ?? '',
    region: region ?? '',
    folderPath: folderPath ?? '',
    importName: importName ?? '',
  };

  const regionList = [
    { value: '', id: '' },
    { value: 'Mumbai', id: '1' },
    { value: 'Delhi', id: '2' },
    { value: 'Chennai', id: '3' },
    { value: 'Bangalore', id: '4' },
  ];

  const handleSubmit = (values) => {
    next();
  };

  const handlePreviousBtnClick = () => {
    previous();
  };

  const makeSchema = Yup.object({
    s3bucketname: Yup.string().required(),
    accessKey: Yup.string().required(),
    secretKey: Yup.string().required(),
    folderPath: Yup.string().required(),
    region: Yup.string().required(),
    importName: Yup.string().required(),
  });

  return (
    <div>
      <p>
        <b>
          <IntlMessages id="S3SFTP.CONFIGURE_S3.LABEL.SELECT_FILE" />
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
                  identifier="s3bucketname"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_S3.LABEL.S3_BUCKET_NAME"
                  value={form.values.s3bucketname}
                  onChange={(event) =>
                    form.setFieldValue('s3bucketname', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_S3.PLACEHOLDER.S3_BUCKET_NAME'}
                  dataTestId="s3bucketname"
                  required={true}
                />
              </Colxx>
            </Row>
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifier="accessKey"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_S3.LABEL.S3_ACCESS_KEY"
                  value={form.values.accessKey}
                  onChange={(event) =>
                    form.setFieldValue('accessKey', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_S3.PLACEHOLDER.S3_ACCESS_KEY'}
                  dataTestId="accessKey"
                  required={true}
                />
              </Colxx>
            </Row>
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifier="secretKey"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_S3.LABEL.S3_SECRET_KEY"
                  value={form.values.secretKey}
                  onChange={(event) =>
                    form.setFieldValue('secretKey', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_S3.PLACEHOLDER.S3_SECRET_KEY'}
                  type="password"
                  dataTestId="secretKey"
                  required={true}
                />
              </Colxx>
            </Row>
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifierLabel="S3SFTP.CONFIGURE_S3.LABEL.REGION"
                  placeholder="S3SFTP.CONFIGURE_S3.PLACEHOLDER.REGION"
                  identifier="region"
                  type="select"
                  value={form.values.region}
                  options={regionList}
                  onChange={(event) =>
                    form.setFieldValue('region', event.target.value)
                  }
                  className="form-group has-float-label"
                  errors={form.errors}
                  touched={form.touched}
                  dataTestId="region"
                  required={true}
                />
              </Colxx>
            </Row>
            <Row className="p-2">
              <Colxx xxs="12" md="4">
                <FormGroupCoustom
                  identifier="folderPath"
                  errors={form.errors}
                  touched={form.touched}
                  identifierLabel="S3SFTP.CONFIGURE_S3.LABEL.FOLDER_PATH"
                  value={form.values.folderPath}
                  onChange={(event) =>
                    form.setFieldValue('folderPath', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_S3.PLACEHOLDER.FOLDER_PATH'}
                  dataTestId="folderPath"
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
                  identifierLabel="S3SFTP.CONFIGURE_S3.LABEL.IMPORT_NAME"
                  value={form.values.importName}
                  onChange={(event) =>
                    form.setFieldValue('importName', event.target.value)
                  }
                  className="form-group has-float-label"
                  placeholder={'S3SFTP.CONFIGURE_S3.PLACEHOLDER.IMPORT_NAME'}
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
}

export default injectIntl(s3ConfigureAndFormat);
