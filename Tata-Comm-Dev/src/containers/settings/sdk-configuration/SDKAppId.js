import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { getCurrentUser } from 'helpers/Utils';
import React from 'react';
import { Card, CardBody, Row } from 'reactstrap';

function SDKAppId() {
  const user = getCurrentUser();
  const app_id = user?.app_id;
  return (
    <Row>
      <Colxx xs="12">
        <Card className="mb-4 white-card ">
          <CardBody className="filter-card">
            <IntlMessages id="SDK_CONFIGURATION.APP_ID" />: {app_id}
          </CardBody>
        </Card>
      </Colxx>
    </Row>
  );
}

export default SDKAppId;
