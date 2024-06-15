/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  // NavLink,
} from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import notifications from 'data/notifications';
import { adminRoot } from 'constants/defaultValues';
import { NavLink } from 'react-router-dom';
import { getNotificationUnReadCount } from 'redux/notifications/actions';
import { useDispatch, useSelector } from 'react-redux';

const NotificationItem = ({ img, title, date }) => {
  return (
    <div className="d-flex flex-row mb-3 pb-3 border-bottom">
      <NavLink to={`${adminRoot}/pages/product/details`}>
        <img
          src={img}
          alt={title}
          className="img-thumbnail list-thumbnail xsmall border-0 rounded-circle"
        />
      </NavLink>
      <div className="pl-3 pr-2">
        <NavLink to={`${adminRoot}/pages/product/details`}>
          <p className="font-weight-medium mb-1">{title}</p>
          <p className="text-muted mb-0 text-small">{date}</p>
        </NavLink>
      </div>
    </div>
  );
};

const TopnavNotifications = () => {
  const { unreadCount } = useSelector((state) => state.notificationsApp);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotificationUnReadCount());
  }, []);

  return (
    <div className="position-relative d-inline-block">
      <NavLink
        className="header-icon notificationButton"
        to={`${adminRoot}/notifications/list`}
        onClick={() => {
          dispatch(getNotificationUnReadCount());
        }}
      >
        <i className="simple-icon-bell" />
        {unreadCount > 0 && (
          <span className="count">
            {unreadCount < 100 ? unreadCount : '99+'}
          </span>
        )}
      </NavLink>
      <UncontrolledDropdown className="dropdown-menu-right d-none">
        <DropdownToggle
          className="header-icon notificationButton"
          color="empty"
        >
          <i className="simple-icon-bell" />
          <span className="count">3</span>
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3 scroll"
          right
          id="notificationDropdown"
        >
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            {notifications.map((notification, index) => {
              return <NotificationItem key={index} {...notification} />;
            })}
          </PerfectScrollbar>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavNotifications;
