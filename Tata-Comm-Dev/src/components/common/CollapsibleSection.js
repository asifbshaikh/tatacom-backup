import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import { Collapse } from 'reactstrap';

const CollapsibleSection = ({
  title,
  children,
  toggleGroupCollapseClick,
  collapseSectionId,
  openCollapse,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSection = () => {
    if (toggleGroupCollapseClick && collapseSectionId) {
      toggleGroupCollapseClick(collapseSectionId);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="de-collapse-section">
      <div
        role="button"
        tabIndex="0"
        onClick={toggleSection}
        className="header"
      >
        <h6>
          <span className="title">
            <IntlMessages id={title} />
          </span>
          <span className="toggler-icon">
            {isOpen || openCollapse === collapseSectionId ? '-' : '+'}
          </span>
        </h6>
      </div>
      <Collapse isOpen={isOpen || openCollapse === collapseSectionId}>
        <div className="pb-2">{children}</div>
      </Collapse>
    </div>
  );
};

export default CollapsibleSection;
