import { Colxx } from 'components/common/CustomBootstrap';
import React from 'react';
import { Card, Row } from 'reactstrap';

import IntlMessages from 'helpers/IntlMessages';

const UserProfile = () => {
  const segMentData = {
    id: 1,
    customSegmentType: 'test',
    segmentType: 'file',
    createdOn: Date.now(),
    lastRunTime: 54545,
    action: <i className="simple-icon-options-vertical mr-2" />,
  };
  return (
    <Row className="userProfile">
      <Colxx
        xxs="12"
        md="2"
        className="mb-5 profile text-center"
      >
        <p>{segMentData.segmentType}</p>
      </Colxx>
      <Colxx xxs="12" md="10" className="mb-5">
        <Card body>
          <div className="userProfileBody">
            <div>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.FIRST_NAME" />
                <span>{segMentData.customSegmentType}</span>
              </p>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.LAST_NAME" />
                <span>{segMentData.segmentType}</span>
              </p>
            </div>
            <div>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.EMAIL" />
                <span>{segMentData.createdOn}</span>
              </p>

              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.MOBILE_NUMBER" />
                <span>{segMentData.customSegmentType}</span>
              </p>
            </div>
            <div>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.DIGOENGAGE_ID" />
                <span>{segMentData.lastRunTime}</span>
              </p>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.ID:" />
                <span>{segMentData.id}</span>
              </p>
            </div>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};

export default UserProfile;
