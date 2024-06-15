import { Colxx } from 'components/common/CustomBootstrap';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import { Row } from 'reactstrap';

const TriggerCriteria = () => {
  const [selectedCard, setSelectedCard] = useState(
    TargetAudienceEnums.ON_APP_OPEN
  );

  const SelectableCard = ({ title, content, onSelect, selected }) => {
    const cardClasses = `selectable-card card ${selected ? 'selected' : ''}`;

    const handleCardClick = () => {
      onSelect(title);
    };

    return (
      <div
        className={cardClasses}
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      >
        <div className="card-body inapp-card-with-shadow">
          <div className="text-center">
            <h5 className="card-title mb-3">{title}</h5>
          </div>
          <h5 className="card-text">{content}</h5>
        </div>
      </div>
    );
  };

  const handleCardSelect = (cardTitle) => {
    setSelectedCard((prevSelectedCard) =>
      prevSelectedCard === cardTitle ? null : cardTitle
    );
  };

  return (
    <>
      <div className="separator mb-5" />
      <Row className="pl-3 pr-3 mt-3">
        <Colxx xxs="12">
          <h2 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.TRIGGER_CRITERIA_WITH_STAR" />
          </h2>
        </Colxx>
      </Row>
      <br />
      <div className="pl-5 pr-1 col-6">
        <div className="d-flex justify-content-between mb-4">
          <SelectableCard
            title={
              <div className="d-flex justify-content-center">
                <i className="simple-icon-login mr-2" />
                <h5 className="text-center">
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ON_APP_OPEN" />
                </h5>
              </div>
            }
            content={
              <h6 className="text-center">
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ON_APP_OPEN_LABEL" />
              </h6>
            }
            onSelect={() => handleCardSelect(TargetAudienceEnums.ON_APP_OPEN)}
            selected={selectedCard === TargetAudienceEnums.ON_APP_OPEN}
          />

          <SelectableCard
            title={
              <div className="d-flex justify-content-center">
                <i className="iconsminds-cursor-click-2" />
                <h5>
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ON_CUSTOM_EVENT" />
                </h5>
              </div>
            }
            content={
              <h6 className="text-center">
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ON_EVENT_LABEL" />
              </h6>
            }
            onSelect={() => handleCardSelect(TargetAudienceEnums.ON_EVENT)}
            selected={selectedCard === TargetAudienceEnums.ON_EVENT}
          />
        </div>
      </div>
      <div className="separator mb-5" />
    </>
  );
};

export default TriggerCriteria;
