/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Row, Button } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { adminRoot } from 'constants/defaultValues';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

const DripCampaignHeading = ({ match, heading, addLabel }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <div className="mb-2">
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <div className="text-zero top-right-button-container">
            <NavLink
              className="ml-2 text-primary1 active1"
              to={`${adminRoot}/campaigns/flows/create-flow`}
            >
              <Button color="primary" size="lg" className="top-right-button">
                <IntlMessages id={addLabel} />
              </Button>
            </NavLink>
          </div>
          <Breadcrumb match={match} />
        </div>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default DripCampaignHeading;
