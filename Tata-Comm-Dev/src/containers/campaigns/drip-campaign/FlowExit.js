import React from 'react';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import EventTriggerCriteria from '../EventTriggerCriteria';

const FlowExit = ({ form }) => {
  return (
    <Row>
      <Colxx xxs="12">
        <EventTriggerCriteria
          form={form}
          triggerRootIdentifier="triggerCriteria"
          triggerFilterIdentifier="included_filters"
          flowMsg={true}
          flowExit={true}
        />
      </Colxx>
    </Row>
  );
};

export default FlowExit;
