import React from 'react';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { getSendCampaignTimeValue } from 'helpers/campaignHelper';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import '../../assets/css/sass/views/campaign.scss';
import { sendInUserTimeZoneRadioList } from '../../data/createCampaignData';

const SendInUserTimeZone = ({ form, campaignType }) => {
  return (
    <Row className="p-2">
      <Colxx xxs="12">
        <h2 className="font-weight-bold">
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_IF_THE_USER_TIME_ZONE_IS_PASSED" />
          <span className="required-star-mark">{`*`}</span>
        </h2>
      </Colxx>
      <Colxx xxs="12">
        <FormGroupCoustom
          dataTestId="sendinUserTimeZone"
          type="radioMulti"
          noLable
          radioMultiOptions={sendInUserTimeZoneRadioList}
          className="one-time-radio-btns"
          value={
            form.values[campaignType][
              getSendCampaignTimeValue(form, campaignType)
            ].sendUserTimeZonePassed
          }
          identifier={`${campaignType}.${getSendCampaignTimeValue(
            form,
            campaignType
          )}.sendUserTimeZonePassed`}
          onChange={(event) =>
            form.setFieldValue(
              `${campaignType}.${getSendCampaignTimeValue(
                form,
                campaignType
              )}.sendUserTimeZonePassed`,
              event.target.value
            )
          }
        />
      </Colxx>
    </Row>
  );
};

export default SendInUserTimeZone;
