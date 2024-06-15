/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';

const ListCreateSegmentHeading = ({ match, heading, segmentName }) => {
  return (
    <Row className="segmentHeader">
      <Colxx xxs="12">
        <div className="mb-2">
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <Breadcrumb match={match} />
        </div>
      </Colxx>
      <Colxx xxs="12">
        <h2>{segmentName}</h2>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default ListCreateSegmentHeading;
