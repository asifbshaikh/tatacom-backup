import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Switch from 'rc-switch';
import React from 'react';
import { Label, Row } from 'reactstrap';
import '../../../assets/css/sass/views/campaign.scss';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';

const ScheduleAndGoalsDeliveryControl = ({ form }) => {
  return (
    <>
      <Row className="p-2 mt-2 mb-2">
        <Colxx xxs="12">
          <h4 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.DELIVERY_CONTROL" />
          </h4>
        </Colxx>
        <Colxx xxs="12">
          <div className="d-flex align-items-center ml-2 mt-2">
            <Switch
            data-testid="ignoreFrequencyCapping"
              className="custom-switch custom-switch-primary-inverse"
              checked={form.values.deliveryControl.ignoreFrequencyCapping}
              onClick={(checked) => {
                form.setFieldValue(
                  'deliveryControl.ignoreFrequencyCapping',
                  checked
                );
              }}
            />
            <Label className="ml-2 mb-0">
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.IGNORE_FREQUENCY_CAPPING" />
            </Label>
          </div>
        </Colxx>
        <Colxx xxs="12" className="mt-2">
          <div className="d-flex align-items-center ml-4">
            <Switch
             data-testid="countFrequencyCapping"
              className="custom-switch custom-switch-primary-inverse"
              checked={form.values.deliveryControl.countFrequencyCapping}
              onClick={(checked) => {
                form.setFieldValue(
                  'deliveryControl.countFrequencyCapping',
                  checked
                );
              }}
            />
            <Label className="ml-2 mb-0">
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.COUNT_FREQUENCY_CAPPING" />
            </Label>
          </div>
        </Colxx>
      </Row>
      <Row className="p-2 mb-2 schedule-delivery-control">
        <Colxx xxs="12">
          <h4 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.REQUEST_LIMIT" />
          </h4>
        </Colxx>
        <Colxx xxs="12">
          <div className="d-flex align-items-center ml-2">
            <span>
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.LIMIT_REQUEST_TO" />
            </span>
            <FormGroupCoustom dataTestId="requestLimit" fieldWithoutGroup placeholder={ScheduleAndGoalsEnums.REQUEST_LIMIT_PLACEHOLDER} className="ml-1 mr-1 schedule-request-limit" noLable name="requestLimit" onChange={(event)=>form.setFieldValue(event.target.value)} value={form.values.requestLimit}/>
            <span>
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.REQUEST_PER_MINUTE" />
            </span>
          </div>
        </Colxx>
      </Row>
    </>
  );
};

export default ScheduleAndGoalsDeliveryControl;
