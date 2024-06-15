import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';
import React from 'react';
import { Row } from 'reactstrap';

const HelpCenterFormHeading = ({ match }) => {
  const heading = 'HELP_CENTER.HEADING';
  return (
    <Row className="align-items-center">
      <Colxx xxs="12" md="10">
        <div className="mb-2">
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <Breadcrumb match={match} />
        </div>
      </Colxx>
    </Row>
  );
};

export default HelpCenterFormHeading;
