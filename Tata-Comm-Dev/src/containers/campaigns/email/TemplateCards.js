import React, { useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import { Button } from 'reactstrap';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';

export default function TemplateCards({ title, setIsChoose }) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleChooseButton = () => {
    setIsChoose(true);
  };

  return (
    <>
      <div
        className={`template-card-content ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        tabIndex="0"
        role="button"
      >
        {title === 'blankTemplate' ? (
          <div>
            <Button
              className={`template-card-button ${isHovered ? 'hovered' : ''}`}
              onClick={handleChooseButton}
            >
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CHOOSE" />
            </Button>
            <p className="template-text">
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.BLANK" />
            </p>
          </div>
        ) : (
          ''
        )}

        {title === ContentConfigurationEnums.TWO_COLUMNS ||
        title === ContentConfigurationEnums.THREE_COLUMNS ||
        title === ContentConfigurationEnums.FOUR_COLUMNS ? (
          <div>
            <Button
              className={`template-card-button ${isHovered ? 'hovered' : ''}`}
              onClick={handleChooseButton}
            >
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CHOOSE" />
            </Button>
            <p className="template-text">
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.COLUMN_LAYOUT" />
            </p>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
