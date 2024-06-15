import React from 'react';
import { Button, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';

const StepperNavigationButtons = ({
  className,
  leftBtnLabel = '',
  rightBtnLabel = '',
  leftBtnLabelDisable,
  rightBtnLabelDisable,
  handleLeftBtnClick,
  handleRightBtnClick,
}) => {
  const getBtnPostion = () => {
    let btnposition = '';
    if (leftBtnLabel && rightBtnLabel) {
      btnposition = 'justify-content-between';
    } else if (leftBtnLabel && !rightBtnLabel) {
      btnposition = 'justify-content-start';
    } else {
      btnposition = 'justify-content-end';
    }
    return btnposition;
  };
  return (
    <Row className={className}>
      <Colxx xxs="12">
        <div className={`d-flex align-items-center ${getBtnPostion()}`}>
          {leftBtnLabel && (
            <Button
              type="button"
              disabled={leftBtnLabelDisable}
              color="secondary"
              onClick={handleLeftBtnClick}
            >
              {leftBtnLabel}
            </Button>
          )}
          {rightBtnLabel && (
            <Button
              type="button"
              disabled={rightBtnLabelDisable}
              color="primary"
              onClick={handleRightBtnClick}
            >
              {rightBtnLabel}
            </Button>
          )}
        </div>
      </Colxx>
    </Row>
  );
};

export default StepperNavigationButtons;
