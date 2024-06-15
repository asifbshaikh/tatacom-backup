import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React from 'react';
import { CustomInput, Row } from 'reactstrap';

const TragetPlatforms = (channelType) => {
  return (
    <>
      <Row className="pl-3 pr-3 mt-3">
        <Colxx xxs="12">
          <h2 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.TARGET_PLATFORMS" />
          </h2>
        </Colxx>
      </Row>
      <Row className="pl-4 pr-4 mb-5">
        <Colxx xxs="12" md="1">
          <CustomInput
            type="checkbox"
            id="targetPlatformAndriod"
            data-testid="targetPlatformAndriod"
            label={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ANDROID" />
            }
          />
        </Colxx>
        <Colxx xxs="12" md="1">
          <CustomInput
            type="checkbox"
            id="targetPlatformIOS"
            data-testid="targetPlatformIOS"
            label={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.IOS" />
            }
          />
        </Colxx>
        {channelType.channelType !== 'inApp' && (
          <>
            <Colxx xxs="12" md="2">
              <CustomInput
                type="checkbox"
                id="targetPlatformWeb"
                data-testid="targetPlatformWeb"
                label={
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.WEB" />
                }
              />
            </Colxx>
          </>
        )}
      </Row>
    </>
  );
};

export default TragetPlatforms;
