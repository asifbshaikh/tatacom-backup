import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  dataOfTime,
  selectTriggereRadioOptions,
} from 'data/createCampaignData';
import React, { useContext } from 'react';
import { Alert, Row } from 'reactstrap';
import './../../assets/css/sass/views/campaign.scss';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import IntlMessages from 'helpers/IntlMessages';

const EventTriggerMessageFields = ({
  form,
  filterFormErrors,
  filterFormTouched,
  triggerRootIdentifier,
  flowMsg,
}) => {
  const { getErrorMessageOfField } = useContext(CleanFieldValuesProvider);
  const handleOnTriggerMessageTypeChange = (event) => {
    if (event.target.value === TargetAudienceEnums.IMMEDIATELY) {
      form.setFieldValue(
        `${triggerRootIdentifier}.time_value"`,
        TargetAudienceEnums.TIME_VALUE
      );
      form.setFieldValue(
        `${triggerRootIdentifier}.time_multiplier`,
        TargetAudienceEnums.TIME_MULTIPLIER
      );
    }
    form.setFieldValue(
      `${triggerRootIdentifier}.trigger_message_type`,
      event.target.value
    );
  };
  return (
    <div className="pl-4 pr-4 pt-2 pb-2">
      <Row>
        <Colxx xxs="12">
          {!flowMsg && (
            <h5>
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.TRIGGER_MESSAGE" />
            </h5>
          )}

          {flowMsg && (
            <h5>
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.ENTER_USER" />
            </h5>
          )}
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12">
          <FormGroupCoustom
            dataTestId="trigger_message_type"
            identifier={`${triggerRootIdentifier}.trigger_message_type`}
            type="radioMulti"
            noLable
            radioMultiOptions={selectTriggereRadioOptions}
            className="select-audience"
            onChange={handleOnTriggerMessageTypeChange}
            value={form.values[triggerRootIdentifier].trigger_message_type}
            disabled
          />
        </Colxx>
      </Row>
      {form.values[triggerRootIdentifier].trigger_message_type ===
        TargetAudienceEnums.WITH_DELAY && (
        <Row>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              noLable
              identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.NUMBER"
              placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.PLACEHOLDER.NUMBER"
              identifier={`${triggerRootIdentifier}.time_value`}
              type="number"
              minNumberValue="0"
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'time_value'
            )}
          </Colxx>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.PLACEHOLDER.TIME"
              options={dataOfTime}
              identifier={`${triggerRootIdentifier}.time_multiplier`}
              type="select"
              noLable
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'time_multiplier'
            )}
          </Colxx>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              noLable
              placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.PLACEHOLDER.PERIOD"
              identifier="triggerCriteria.trigger_relation"
              type="text"
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'trigger_relation'
            )}
          </Colxx>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              noLable
              type="text"
              placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.PLACEHOLDER.ACTION"
              identifier={`${triggerRootIdentifier}.trigger_attr`}
              className="mr-1"
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'trigger_attr'
            )}
          </Colxx>
        </Row>
      )}

      {form.values[triggerRootIdentifier].trigger_message_type ===
        TargetAudienceEnums.IMMEDIATELY &&
        !flowMsg && (
          <Alert color="primary">
            <span>
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.IMMEDIATELY_ALERT" />
            </span>
          </Alert>
        )}
      {form.values[triggerRootIdentifier].trigger_message_type ===
        TargetAudienceEnums.IMMEDIATELY &&
        flowMsg && (
          <Alert color="primary">
            <span>
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.ENTER_IMMEDIATELY" />
            </span>
          </Alert>
        )}

      {form.values[triggerRootIdentifier].trigger_message_type ===
        TargetAudienceEnums.WITH_DELAY &&
        !flowMsg && (
          <Alert color="primary">
            <span>
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.WITH_DELAY_ALERT" />
            </span>
          </Alert>
        )}

      {form.values[triggerRootIdentifier].trigger_message_type ===
        TargetAudienceEnums.WITH_DELAY &&
        flowMsg && (
          <Alert color="primary">
            <span>
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.ENTER_WITH_DELAY" />
            </span>
          </Alert>
        )}
    </div>
  );
};

export default EventTriggerMessageFields;
