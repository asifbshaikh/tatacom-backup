import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import S3SFTPProgressBar from 'components/s3-sftp/S3SFTPProgressBar';

const S3SFTPUploads = ({ match }) => {
  return (
    <div>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.db-imports" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12">
          <S3SFTPProgressBar />
        </Colxx>
      </Row>
    </div>
  );
};
export default S3SFTPUploads;
