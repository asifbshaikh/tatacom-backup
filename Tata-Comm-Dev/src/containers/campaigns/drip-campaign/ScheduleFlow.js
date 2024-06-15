import React from 'react';
import { Row, Button, Label, FormGroup } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import ScheduleAndGoalsDateAndTime from '../schedule-campaigns/ScheduleAndGoalsDateAndTime';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';
import ScheduleAndGoalsCampaignBtnGroup from '../schedule-campaigns/ScheduleAndGoalsCampaignBtnGroup';
import FlowsEnums from 'enums/campaigns/flowsEnums';

const ScheduleFlow = ({ form }) => {
  const { values } = form;

  const scheduleEndsRadioLists = [
    {
      id: 'never',
      value: 'Never',
      label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.NEVER',
    },
    {
      id: 'on',
      value: 'On',
      label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.ON',
    },
  ];

  const scheduleCampaignOneTimeBtnList = [
    {
      value: 'Immediately',
      label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.IMMEDIATELY',
      id: 'schedule.sendCampaignType',
    },
    {
      value: 'at_specific_date_and_time',
      label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.AT_SPECIFIC_DATE_AND_TIME',
      id: 'schedule.sendCampaignType',
    },
  ];

  return (
    <>
      <Separator />

      <div className="pl-4 pr-4 mt-2 mb-1 pb-2 schedule-periodic">
        <Row>
          <Colxx xxs="12" md="10">
            <h2 className="font-weight-bold mt-3">
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.SCHEDULE_FLOW" />
            </h2>
          </Colxx>
          <Colxx xxs="2" className="text-right">
            <Button
              className="filter-by-list-close mr-2 mt-0 bg-transparent border-0 p-0"
              onClick={() => {}}
              data-testid="resetBtn"
            >
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.RESET" />
            </Button>
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <h3 className="font-weight-bold mt-3 ml-3">
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.STARTS" />
            </h3>

            <Row className="pl-3 pr-2 pt-1 pb-4">
              <>
                <Colxx xxs="12" md="4">
                  <ScheduleAndGoalsCampaignBtnGroup
                    activeBtn={values.schedule.sendCampaignType}
                    form={form}
                    btnLists={scheduleCampaignOneTimeBtnList}
                  />
                </Colxx>
                <Colxx xxs="12" md="2" />
              </>

              <Colxx xxs="12" md="2" />
              <Colxx xxs="12" md="4">
                <FormGroup className="has-float-label">
                  <Label htmlFor="campaignTimeZone">
                    <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.CAMPAIGN_TIME_ZONE" />
                  </Label>
                  <TimezoneSelect
                    className="has-float-label"
                    value={form.values.schedule.campaignTimeZone}
                    onChange={(value) =>
                      form.setFieldValue(
                        'schedule.campaignTimeZone',
                        value.value
                      )
                    }
                    timezones={{ ...allTimezones }}
                  />
                </FormGroup>
              </Colxx>
            </Row>

            {form.values.schedule.sendCampaignType ===
              FlowsEnums.AT_SPECIFIC_DATE_TIME && (
              <Row>
                <Colxx xxs="12">
                  <ScheduleAndGoalsDateAndTime
                    className="mb-3 pt-3 pb-3 ml-3"
                    form={form}
                    leftFieldID={'schedule.startDate'}
                    leftFieldLabel={
                      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.START_DATE" />
                    }
                    leftFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.START_DATE"
                    rightFieldId={'schedule.startTime'}
                    rightFieldLabel={
                      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_TIME" />
                    }
                    rightFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_TIME"
                  />
                </Colxx>
              </Row>
            )}

            <h3 className="font-weight-bold mt-1 ml-3">
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.ENDS" />
            </h3>

            <Colxx xxs="12">
              <FormGroupCoustom
                noLable
                className="periodic-radio-btns-list ml-3"
                type="radioMulti"
                radioMultiOptions={scheduleEndsRadioLists}
                value={values.schedule.ends}
                identifier={'schedule.ends'}
                onChange={(event) => {
                  form.setFieldValue('schedule.ends', event.target.value);
                }}
              />
            </Colxx>
          </Colxx>
        </Row>
        <Row>
          {form.values.schedule?.ends === ScheduleAndGoalsEnums.ON && (
            <Colxx xxs="12">
              <ScheduleAndGoalsDateAndTime
                className="mb-3 pt-3 pb-3 ml-3"
                form={form}
                leftFieldID={'schedule.endDate'}
                leftFieldLabel={
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_DATE" />
                }
                leftFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_DATE"
                rightFieldId={'schedule.endTime'}
                rightFieldLabel={
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_TIME" />
                }
                rightFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_TIME"
              />
            </Colxx>
          )}
        </Row>
      </div>
    </>
  );
};

export default ScheduleFlow;
