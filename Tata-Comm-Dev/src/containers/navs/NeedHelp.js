import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import IntlMessages from 'helpers/IntlMessages';
import helpData from 'constants/help';

const NeedHelp = () => {
  return (
    <div className="position-relative d-none d-sm-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle className="header-icon" color="empty">
          <div>
            <i className="simple-icon-question" /> <span>Need Help</span>{' '}
            <i className="iconsminds-arrow-down" />{' '}
          </div>
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3"
          right
          id="iconHelpMenuDropdown"
        >
          {helpData.map((menu) => {
            return (
              <NavLink
                to={`${menu.to}`}
                target="_blank"
                className="icon-help-item"
                key={menu.id}
              >
                <i className={`${menu.icon}`} />
                <div>
                  <IntlMessages id={menu.label} />
                </div>
              </NavLink>
            );
          })}
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default NeedHelp;
