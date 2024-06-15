/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  Row,
  Button,
} from 'reactstrap';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
// import { NavLink } from 'react-router-dom';

// import { adminRoot } from 'constants/defaultValues';

// import { DataListIcon, ThumbListIcon, ImageListIcon } from 'components/svg';
import Breadcrumb from 'containers/navs/Breadcrumb';

const ListIntegrationsHeading = ({
  match,
  toggleModal,
  heading,
}) => {
  // const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);

  return (
    <Row>
      <Colxx xxs="12">
        <div className="mb-2">
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <div className="text-zero top-right-button-container">
            {/* <NavLink className='ml-2 text-primary1 active1' to={`${adminRoot}/settings/inboxes/new`}> */}
            <Button
              color="primary"
              size="lg"
              className="top-right-button"
              onClick={() => toggleModal()}
            >
              <IntlMessages id="INTEGRATION_SETTINGS.WEBHOOK.CONFIGURE" />
            </Button>
            {/* </NavLink> */}
          </div>
          <Breadcrumb match={match} />
        </div>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default ListIntegrationsHeading;
