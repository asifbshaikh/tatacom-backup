import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React from 'react';
import { Row } from 'reactstrap';

const SheduleConversionGoals = () => {
  return (
    <Row className="p-2 mt-2 mb-4">
      <Colxx xxs="12">
        <h4 className="font-weight-bold">
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.CONVERSION_GOALS" />
        </h4>
      </Colxx>
      <Colxx xxs="12">
        <div className="d-inline-flex mt-2 ml-2" role="button" tabIndex={0}>
          <i className="iconsminds-add" />
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.NEW_GOALS" />
        </div>
      </Colxx>
    </Row>
  );
};

export default SheduleConversionGoals;
