/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  Row
} from 'reactstrap';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';

const ChannelsHeading = ({
  match,
  heading,
}) => {

  return (
    <Row>
      <Colxx xxs="12">
        <div className="mb-2">
          <h1>
            <IntlMessages id={heading} />
          </h1>

          <Breadcrumb match={match} />
        </div>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default ChannelsHeading;
