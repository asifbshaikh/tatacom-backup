import React from 'react';
import { injectIntl } from 'react-intl';
import { UncontrolledTooltip } from 'reactstrap';

const CustomUncontrolledToolTip = ({
  label,
  intl,
  target,
  placement = 'bottom',
}) => {
  const { messages } = intl;
  return (
    <UncontrolledTooltip
      placement={placement}
      target={target}
      popperClassName="border-1"
    >
      <small>
        {typeof messages[label] !== 'undefined' ? messages[label] : label}
      </small>
    </UncontrolledTooltip>
  );
};

export default injectIntl(CustomUncontrolledToolTip);
