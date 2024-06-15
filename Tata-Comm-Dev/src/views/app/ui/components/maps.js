import React from 'react';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';

const MapsUi = ({ match }) => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.maps" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12">
          <Card className="mb-4">
            <CardBody>
              <CardTitle>
                <IntlMessages id="maps.google" />
              </CardTitle>
            </CardBody>
          </Card>

          <Card className="mb-4">
            <CardBody>
              <CardTitle>
                <IntlMessages id="maps.yandex" />
              </CardTitle>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};
export default MapsUi;
