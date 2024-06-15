import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import IntlMessages from 'helpers/IntlMessages';

import data from 'constants/menu';
import { useState } from 'react';

const TopnavEasyAccess = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLinkClick = () => {
    setDropdownOpen(false);
  };
  return (
    <div className="position-relative d-none d-sm-inline-block">
      <UncontrolledDropdown
        className="dropdown-menu-right"
        isOpen={dropdownOpen}
        toggle={toggleDropdown}
      >
        <DropdownToggle className="header-icon" color="empty">
          <i className="simple-icon-grid" />
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3"
          right
          id="iconMenuDropdown"
        >
          {data.map((menu) => {
            return (
              <NavLink
                to={`${menu.to}`}
                className="icon-menu-item"
                key={menu.id}
                onClick={handleLinkClick}
              >
                <i className={`${menu.icon} d-block`} />{' '}
                <IntlMessages id={menu.label} />
              </NavLink>
            );
          })}
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavEasyAccess;
