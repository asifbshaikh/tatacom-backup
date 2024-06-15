/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  Row,
} from 'reactstrap';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';

// import { adminRoot } from 'constants/defaultValues';

// import { DataListIcon, ThumbListIcon, ImageListIcon } from 'components/svg';
import Breadcrumb from 'containers/navs/Breadcrumb';

const ListApplicationsHeading = ({
  match,
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
          <Breadcrumb match={match} />
        </div>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default ListApplicationsHeading;
