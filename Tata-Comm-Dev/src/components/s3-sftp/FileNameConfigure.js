import React from 'react';
import { Label, FormGroup, Row, Button, Table } from 'reactstrap';
import { Field } from 'formik';
import { Colxx } from 'components/common/CustomBootstrap';
import DataTableView from 'containers/contacts/DataTableView';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';

function filenameConfigure({ intl }) {
  const { messages } = intl;

  const items = [
    {
      id: 1,
      name: 'ABC',
      email: 'abc@test.com',
      mobile: '9878767873',
    },
    {
      id: 2,
      name: 'DEF',
      email: 'def@test.com',
      mobile: '9878767874',
    },
    {
      id: 3,
      name: 'XYZ',
      email: 'xyz@test.com',
      mobile: '9878767875',
    },
    {
      id: 4,
      name: 'LMN',
      email: 'lmnf@test.com',
      mobile: '9878767876',
    },
  ];

  const tableCols = [
    {
      Header: 'ID', // Dynamic title will come
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Mobile No',
      accessor: 'mobile',
    },
  ];

  return (
    <div>
      <p>
        <b>
          <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.FILE_CONFIGURE" />
        </b>
      </p>

      <Row className="p-2">
        <Colxx xxs="12" md="4">
          <FormGroup className="form-group has-float-label">
            <Label>
              <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.PREFIX" />
            </Label>
            <Field
              className="form-control"
              name="prefix"
              placeholder={messages['S3SFTP.CONFIGURE_SFTP.PLACEHOLDER.PREFIX']}
            />
          </FormGroup>
        </Colxx>

        <FormGroup className="form-group has-float-label">
          <Label>
            <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.DATE_TIME_FORMAT" />
          </Label>
          <Field
            className="form-control"
            name="prefix"
            placeholder={
              messages['S3SFTP.CONFIGURE_SFTP.PLACEHOLDER.DATE_TIME_FORMAT']
            }
            value={'{ddmmyyyy}'}
            disabled
          />
        </FormGroup>

        <Colxx xxs="12" md="4">
          <Button className="count-button" onClick={() => {}} type="button">
            <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.FETCH_FILE" />
          </Button>
        </Colxx>
      </Row>

      <div className="d-flex p-2">
        <h6 className="message-popup font-weight-bold">
          <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.REGISTER_VALID_FILE_DESCRIPTION" />
        </h6>
      </div>

      <Row className="p-2">
        <Colxx xxs="12" md="4">
          <b>
            <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.FILE_PREVIEW" />
          </b>
        </Colxx>
      </Row>

      <Row className="p-2">
        <Colxx xxs="12" md="4">
          <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.SAMPLE_FILE_NAME" />
        </Colxx>
      </Row>

      <Row className="p-2 mt-4">
        <Colxx xxs="12" md="4">
          <IntlMessages id="S3SFTP.CONFIGURE_SFTP.LABEL.PREVIEW" />
        </Colxx>
      </Row>

      <DataTableView
        colxxs="12"
        cols={tableCols}
        items={items}
        key="ReactTblSFTPFileList"
      />
    </div>
  );
}

export default injectIntl(filenameConfigure);
