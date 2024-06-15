import React, { useState, useEffect } from 'react';
import { Button, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import '../../assets/css/sass/views/campaign.scss';
import IntlMessages from 'helpers/IntlMessages';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import CommonEnums from 'enums/commonEnums';

const PreviewContent = ({
  channelType,
  defaultBtn,
  checkIfMsgPresent,
  setDefaultBtn,
  form,
  actionButtons,
  campaignInfo,
  previewMessage,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const currentdate = new Date();

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };
    updateTime();
  }, []);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h6>
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.PREVIEW" />
          </h6>
        </Colxx>
        <Colxx xxs="12">
          <div
            className={
              channelType === CommonEnums.WHATSAPP
                ? 'whatsappsmartphone'
                : 'smartphone'
            }
          >
            <div
              className={
                channelType === CommonEnums.WHATSAPP
                  ? 'whatsappheader'
                  : 'header'
              }
            >
              <span style={{ fontWeight: 'bold' }}>
                {form.values.smsSender}
              </span>
            </div>
            <div className="timecard">{currentdate.toDateString()}</div>
            <div className="scrollbar">
              <div className="smartphone-content">
                {form.values.category ===
                  ContentConfigurationEnums.WITH_MEDIA &&
                form.values.mediaLink.length ? (
                  <div>{ContentConfigurationEnums.MEDIA}</div>
                ) : null}
                {campaignInfo?.campaign
                  ? previewMessage
                  : checkIfMsgPresent(form)}
                <div style={{ textAlign: 'right' }}>{currentTime}</div>
                <div>
                  {actionButtons?.map((btn, index) => (
                    <Button
                      className="preview-btn"
                      key={index}
                      disabled
                      tabIndex="0"
                      role="button"
                    >
                      {btn.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Colxx>
        <Colxx xxs="12">
          <Button
            name="default"
            color="primary"
            className="m-2"
            type="button"
            data-testid="default"
            outline
            active={defaultBtn}
            onClick={() => {
              setDefaultBtn(true);
            }}
          >
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.BUTTON.DEFAULT" />
          </Button>
          <Button
            name="personalized"
            color="primary"
            active={!defaultBtn}
            className="m-2"
            type="button"
            data-testid="personalized"
            outline
            onClick={() => {
              setDefaultBtn(false);
            }}
          >
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.BUTTON.PERSONALIZED" />
          </Button>
        </Colxx>
      </Row>
    </>
  );
};

export default PreviewContent;
