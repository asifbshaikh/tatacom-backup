import React from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { getSendCampaignTimeValue } from 'helpers/campaignHelper';
import { Row } from 'reactstrap';
import {
  sendMessageBestTimeRadioOptions,
  userBestTimeNotAvailableRadioOptions,
} from '../../../data/createCampaignData';

const ScheduleAndGoalsBestTimeForUser = ({ form, campaignType }) => {
  return (
    <Row className="pl-3">
      <Colxx xxs="12">
        <h2 className="font-weight-bold">
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_MESSAGE_BASED_ON_BEST_TIME" />
        </h2>
      </Colxx>
      <Colxx xxs="12">
        <FormGroupCoustom
          type="radioMulti"
          noLable
          radioMultiOptions={sendMessageBestTimeRadioOptions}
          className="one-time-radio-btns"
          value={
            form.values[campaignType][
              getSendCampaignTimeValue(form, campaignType)
            ].userBestTimeOutsideTimeWindow
          }
          identifier={`${campaignType}.${getSendCampaignTimeValue(
            form,
            campaignType
          )}.userBestTimeOutsideTimeWindow`}
          onChange={(event) =>
            form.setFieldValue(
              `${campaignType}.${getSendCampaignTimeValue(
                form,
                campaignType
              )}.userBestTimeOutsideTimeWindow`,
              event.target.value
            )
          }
        />
      </Colxx>
      <Colxx xxs="12">
        <h2 className="font-weight-bold">
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.IF_USER_BEST_TIME_NOT_AVAILABLE" />
        </h2>
      </Colxx>
      <Colxx xxs="12">
        <FormGroupCoustom
          type="radioMulti"
          noLable
          radioMultiOptions={userBestTimeNotAvailableRadioOptions}
          className="one-time-radio-btns"
          value={
            form.values[campaignType][
              getSendCampaignTimeValue(form, campaignType)
            ].userBestTimeNotAvailable
          }
          identifier={`${campaignType}.${getSendCampaignTimeValue(
            form,
            campaignType
          )}.userBestTimeNotAvailable`}
          onChange={(event) =>
            form.setFieldValue(
              `${campaignType}.${getSendCampaignTimeValue(
                form,
                campaignType
              )}.userBestTimeNotAvailable`,
              event.target.value
            )
          }
        />
      </Colxx>
    </Row>
  );
};

export default ScheduleAndGoalsBestTimeForUser;
