import React from 'react';
import { Row, Label } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Switch from 'rc-switch';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

const Settings = ({ form }) => {
  const { values } = form;

  return (
    <>
      <Separator />

      <Row className="mt-2 pl-4 mb-4">
        <Colxx xxs="12" md="10">
          <h2 className="font-weight-bold mt-3">
            <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.SETTINGS" />
          </h2>
        </Colxx>
        <Colxx xxs="12" className="mt-3">
          <Colxx xxs="12" className="d-flex">
            <Switch
              identifier="toggleSettings"
              data-testid="toggleSettings"
              errors={form.errors}
              touched={form.touched}
              className="custom-switch custom-switch-primary-inverse"
              onChange={(e) => form.setFieldValue('toggleSettings', e)}
              checked={values.toggleSettings}
            />
            <Label className="switch-btn-lable">
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.LIMIT_ENTRY" />
            </Label>
          </Colxx>
        </Colxx>
      </Row>

      {values.toggleSettings === true ? (
        <>
          <Colxx xxs="12" className="mt-4 d-flex align-items-center">
            <span className="pl-2 pr-2 pl-4 limitDays">
              <FormGroupCoustom
                type="number"
                className="mr-2"
                noLable
                minNumberValue="1"
                identifier="limit_days"
              />
            </span>
            <Label>
              <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.FC_CRIETERIA_3" />
            </Label>
          </Colxx>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Settings;
