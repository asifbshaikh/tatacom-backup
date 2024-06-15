/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';

const ViewSegmentDetailsHeading = ({
  match,
  heading,
  segmentName
}) => {
  return (
    <Row className="segmentHeader">
      <Colxx xxs="12">
        <div>
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <Breadcrumb match={match} />
        </div>
        <div className='ml-4'>
          <h2>
            {segmentName}
          </h2>
        </div>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default ViewSegmentDetailsHeading;
