import { Colxx } from 'components/common/CustomBootstrap';
import { Form } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import { Button, Row } from 'reactstrap';
const IconUpload = React.lazy(() => import('./mobile-push/iconUpload'));

const WebPushListing = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    // file will be handled here
  };

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h2 className="mb-4 font-weight-bold">
            <IntlMessages id="settings-channel.web.title" />
          </h2>
          <p>
            <IntlMessages id="settings-channel.web.desc" />
          </p>
        </Colxx>
      </Row>
      <IconUpload setFile={setFile} file={file} />
      <Button
        color="primary"
        disabled={!file}
        type="submit"
        className="float-right"
        onClick={handleSubmit}
      >
        <IntlMessages id="pages.submit" />
      </Button>
    </>
  );
};
export default WebPushListing;
