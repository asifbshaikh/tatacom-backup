import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Switch from 'rc-switch';
import React from 'react'
import { Label, Row } from 'reactstrap';

const EnableControlGroups = ({form}) => {
  return (
    <Row className='p-3'>
    <Colxx xxs="12">
      <h4 className="font-weight-bold">
        <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ENABLE_CONTROL_GROUPS" />
      </h4>
    </Colxx>
    <Colxx xxs="12">
      <div className="d-flex align-items-center ml-2 mt-3">
        <Switch
        data-testid="globalControlGroup"
          className="custom-switch custom-switch-primary-inverse"
          checked={form.values.globalControlGroup}
          onClick={(checked) => {
            form.setFieldValue('globalControlGroup', checked);
          }}
        />
        <Label className="ml-2 mb-0">
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.GLOBAL_CONTROL_GROUP" />
        </Label>
      </div>
    </Colxx>
    <Colxx xxs="12" className="mt-2">
      <div className="d-flex align-items-center ml-2">
        <Switch
        data-testid="campaignControlGroup"
          className="custom-switch custom-switch-primary-inverse e-small"
          checked={form.values.campaignControlGroup}
          onClick={(checked) => {
            form.setFieldValue('campaignControlGroup', checked);
          }}
        />
        <Label className="ml-2 mb-0">
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.CAMPAIGN_CONTROL_GROUP" />
        </Label>
      </div>
    </Colxx>
  </Row>
  )
}

export default EnableControlGroups