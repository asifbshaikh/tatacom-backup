import { Colxx, Separator } from 'components/common/CustomBootstrap';
import BreadcrumbContainer from 'containers/navs/Breadcrumb';
import IntlMessages from 'helpers/IntlMessages';
import React from 'react';
import { Row } from 'reactstrap';

const SDKConfigurationHeading = ({ match, heading }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <div className="mb-2">
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <BreadcrumbContainer match={match} />
        </div>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default SDKConfigurationHeading;
