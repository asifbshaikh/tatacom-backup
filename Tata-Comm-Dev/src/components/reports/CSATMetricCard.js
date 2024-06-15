import { Colxx } from 'components/common/CustomBootstrap';
import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const CSATMetricCard = ({ label, labelText, toolTipInfo, position, value }) => {
  const [toolTipOpen, setToolTipOpen] = useState(false);
  return (
    <Colxx md="2" sm="6" className="csat--metric-card">
      <span className="heading-tooltip">
        <h3 className="heading">
          <span>{labelText}</span>
        </h3>
        <span>
          <i className="simple-icon-info mt-2 ml-2" id={label} />
        </span>
      </span>
      <h3 className="text-muted text-sm metric">{value}</h3>
      <Tooltip
        placement={position}
        isOpen={toolTipOpen}
        target={label}
        toggle={() => setToolTipOpen(!toolTipOpen)}
      >
        {toolTipInfo}
      </Tooltip>
    </Colxx>
  );
};

export default CSATMetricCard;
