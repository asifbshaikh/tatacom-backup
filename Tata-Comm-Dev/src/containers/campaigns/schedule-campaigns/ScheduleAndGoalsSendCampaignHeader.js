import { Colxx } from 'components/common/CustomBootstrap';
import React from 'react';
import { FormGroup, Label, Row } from 'reactstrap';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';
import IntlMessages from 'helpers/IntlMessages';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import ScheduleAndGoalsCampaignBtnGroup from './ScheduleAndGoalsCampaignBtnGroup';
import {
  scheduleCampaignOneTimeBtnList,
  scheduleCampaignPeriodicBtnList,
  scheduleCampaignEventTriggeredBtnList,
} from '../../../data/createCampaignData';

const ScheduleAndGoalsSendCampaignHeader = ({
  form,
  campaignType,
  showCampaignTimezone,
  moduleName,
}) => {
  const { values } = form;

  return (
    <>
      <Row className="p-2">
        <Colxx xxs="12">
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="font-weight-bold">
              {moduleName === S3SFTPImportEnums.MODULE_NAME ? (
                campaignType === 'one_time' ? (
                  <IntlMessages id="S3SFTP.SCHEDULE.SCHEDULE_ONE_TIME" />
                ) : (
                  <IntlMessages id="S3SFTP.SCHEDULE.SCHEDULE_PERIODIC" />
                )
              ) : (
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SCHEDULE_CAMPAIGN" />
              )}
            </h2>
            <div
              className="d-inline"
              tabIndex={0}
              onClick={() => form.handleReset()}
              onKeyDown={() => form.handleReset()}
              role="button"
            >
              <h6 className="font-weight-bold clickable-text user-pointer ">
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.RESET" />
              </h6>
            </div>
          </div>
        </Colxx>
        {moduleName === S3SFTPImportEnums.MODULE_NAME ? (
          ''
        ) : (
          <Colxx xxs="12" md="8" className="m-2 mb-0">
            <h2 className="font-weight-bold">
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_CAMPAIGN" />
            </h2>
          </Colxx>
        )}
      </Row>
      <Row className="pl-3 pr-2 pt-1 pb-4">
        {campaignType === ScheduleAndGoalsEnums.ONE_TIME && (
          <>
            <Colxx xxs="12" md="4">
              <ScheduleAndGoalsCampaignBtnGroup
                activeBtn={values[campaignType].sendCampaignType}
                form={form}
                btnLists={scheduleCampaignOneTimeBtnList}
              />
            </Colxx>
            <Colxx xxs="12" md="2" />
          </>
        )}
        {campaignType === ScheduleAndGoalsEnums.PERIODIC && (
          <Colxx xxs="12" md="6">
            <ScheduleAndGoalsCampaignBtnGroup
              activeBtn={values[campaignType].sendCampaignType}
              form={form}
              btnLists={scheduleCampaignPeriodicBtnList}
            />
          </Colxx>
        )}
        {campaignType === ScheduleAndGoalsEnums.EVENT_TRIGGERED && (
          <>
            <Colxx xxs="12" md="3">
              <ScheduleAndGoalsCampaignBtnGroup
                activeBtn={values[campaignType].sendCampaignType}
                form={form}
                btnLists={scheduleCampaignEventTriggeredBtnList}
              />
            </Colxx>
            <Colxx xxs="12" md="3" />
          </>
        )}
        {!showCampaignTimezone && (
          <>
            <Colxx xxs="12" md="2" />
            <Colxx xxs="12" md="4">
              <FormGroup className="has-float-label">
                <Label htmlFor="campaignTimeZone">
                  {moduleName === S3SFTPImportEnums.MODULE_NAME ? (
                    <IntlMessages id="S3SFTP.SCHEDULE.LABEL.TIME_ZONE" />
                  ) : (
                    <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.CAMPAIGN_TIME_ZONE" />
                  )}
                </Label>
                <TimezoneSelect
                  className="has-float-label"
                  value={form.values.campaignTimeZone}
                  onChange={(value) =>
                    form.setFieldValue('campaignTimeZone', value.value)
                  }
                  timezones={{ ...allTimezones }}
                />
              </FormGroup>
            </Colxx>
          </>
        )}
      </Row>
    </>
  );
};

export default ScheduleAndGoalsSendCampaignHeader;
