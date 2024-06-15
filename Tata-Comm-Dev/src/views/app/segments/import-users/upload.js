import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import ProgressBar from 'components/import-user/ProgressBar';

const ImportUserUploads = ({ match }) => {
  return (
    <div>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.import-users" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12">
          <ProgressBar />
        </Colxx>
      </Row>

    </div>
  );
};
export default ImportUserUploads;
