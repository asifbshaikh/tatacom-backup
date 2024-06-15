import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Input,
} from 'reactstrap';

import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import IntlMessages from 'helpers/IntlMessages';
import {
  menuHiddenBreakpoint,
  searchPath,
  localeOptions,
  isDarkSwitchActive,
  // buyUrl,
  adminRoot,
  loginPageURL,
} from 'constants/defaultValues';
import { MobileMenuIcon, MenuIcon } from 'components/svg';
import {
  getCurrentUser,
  getCurrentUserAccount,
  getDirection,
  setDirection,
} from 'helpers/Utils';
import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale,
} from 'redux/actions';

import Thumbnail from 'components/common/Thumbnail';

import TopnavEasyAccess from './Topnav.EasyAccess';
import NeedHelp from './NeedHelp';
import TopnavNotifications from './Topnav.Notifications';
import TopnavDarkSwitch from './Topnav.DarkSwitch';
import ToggleAccount from './ToggleAccount';
import AvailabilityStatus from './AvailabilityStatus';
import { NotificationManager } from 'components/common/react-notifications';

const TopNav = ({
  intl,
  history,
  containerClassnames,
  menuClickCount,
  selectedMenuHasSubItems,
  locale,
  setContainerClassnamesAction,
  clickOnMobileMenuAction,
  logoutUserAction,
  changeLocaleAction,
  error,
  logoutSuccess,
}) => {
  const [isInFullScreen, setIsInFullScreen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [modalOpenToggleAccounts, setModalOpenToggleAccounts] = useState(false);

  useEffect(() => {
    if (!logoutSuccess && error) {
      NotificationManager.error(error, 'Error', 6000, null, null, '');
    }
  }, [logoutSuccess, error]);

  const search = () => {
    history.push(`${searchPath}?key=${searchKeyword}`);
    setSearchKeyword('');
  };

  const handleChangeLocale = (_locale, direction) => {
    changeLocaleAction(_locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const isInFullScreenFn = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  };

  const handleSearchIconClick = (e) => {
    if (window.innerWidth < menuHiddenBreakpoint) {
      let elem = e.target;
      if (!e.target.classList.contains('search')) {
        if (e.target.parentElement.classList.contains('search')) {
          elem = e.target.parentElement;
        } else if (
          e.target.parentElement.parentElement.classList.contains('search')
        ) {
          elem = e.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains('mobile-view')) {
        search();
        elem.classList.remove('mobile-view');
        removeEventsSearch();
      } else {
        elem.classList.add('mobile-view');
        addEventsSearch();
      }
    } else {
      search();
    }
    e.stopPropagation();
  };

  const handleDocumentClickSearch = (e) => {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('navbar') ||
        e.target.classList.contains('simple-icon-magnifier'))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains('simple-icon-magnifier')) {
        search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains('search')
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector('.mobile-view');
      if (input && input.classList) input.classList.remove('mobile-view');
      removeEventsSearch();
      setSearchKeyword('');
    }
  };

  const removeEventsSearch = () => {
    document.removeEventListener('click', handleDocumentClickSearch, true);
  };

  const addEventsSearch = () => {
    document.addEventListener('click', handleDocumentClickSearch, true);
  };

  const handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  const toggleFullScreen = () => {
    const isFS = isInFullScreenFn();

    const docElm = document.documentElement;
    if (!isFS) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsInFullScreen(!isFS);
  };

  const handleLogout = () => {
    logoutUserAction(history);
  };

  const menuButtonClick = (e, _clickCount, _conClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);
    setContainerClassnamesAction(
      _clickCount + 1,
      _conClassnames,
      selectedMenuHasSubItems
    );
  };

  const mobileMenuButtonClick = (e, _containerClassnames) => {
    e.preventDefault();
    clickOnMobileMenuAction(_containerClassnames);
  };

  const { messages } = intl;
  const user = getCurrentUser();
  if (!user) {
    window.location.href = loginPageURL;
    return false;
  }
  const { accounts = [] } = user;

  const showChangeAccountOption = () => {
    // if (this.globalConfig.createNewAccountFromDashboard) {
    //   return true;
    // }
    return accounts.length > 1;
  };
  return (
    <nav className="navbar fixed-top">
      <div className="d-flex align-items-center navbar-left">
        <NavLink
          to="#"
          location={{}}
          className="menu-button d-none d-md-block"
          onClick={(e) =>
            menuButtonClick(e, menuClickCount, containerClassnames)
          }
        >
          <MenuIcon />
        </NavLink>
        <NavLink
          to="#"
          location={{}}
          className="menu-button-mobile d-xs-block d-sm-block d-md-none"
          onClick={(e) => mobileMenuButtonClick(e, containerClassnames)}
        >
          <MobileMenuIcon />
        </NavLink>

        <div className="search d-none">
          <Input
            name="searchKeyword"
            id="searchKeyword"
            placeholder={messages['menu.search']}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => handleSearchInputKeyPress(e)}
          />
          <span
            className="search-icon"
            onClick={(e) => handleSearchIconClick(e)}
            tabIndex="0"
            role="button"
          >
            <i className="simple-icon-magnifier" />
          </span>
        </div>
        {showChangeAccountOption() && (
          <div className="current-viewing-style">
            <div>
              <IntlMessages id="SIDEBAR.CURRENTLY_VIEWING_ACCOUNT" />
            </div>
            <div>
              <b>
                {getCurrentUserAccount().name} ({user.role})
              </b>
            </div>
          </div>
        )}

        <div className="d-inline-block">
          <UncontrolledDropdown className="ml-2">
            <DropdownToggle
              caret
              color="light"
              size="sm"
              className="language-button"
            >
              <span className="name">{locale.toUpperCase()}</span>
            </DropdownToggle>
            <DropdownMenu className="mt-3 lang-dropdown" right>
              {localeOptions.map((l) => {
                return (
                  <DropdownItem
                    onClick={() => handleChangeLocale(l.id, l.direction)}
                    key={l.id}
                  >
                    {l.name}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        {/* <div className="position-relative d-none d-none d-lg-inline-block">
          <a
            className="btn btn-outline-primary btn-sm ml-2"
            target="_top"
            href={buyUrl}
          >
            <IntlMessages id="user.buy" />
          </a>
        </div> */}
      </div>
      <NavLink className="navbar-logo" to={adminRoot}>
        {/* <img
        alt="Tata Communications"
        src="/assets/img/tatacomm.png"
        /> */}
        <span className="logo d-none d-xs-block" />
        <span className="logo-mobile d-block d-xs-none" />
      </NavLink>

      <div className="navbar-right">
        {isDarkSwitchActive && <TopnavDarkSwitch />}
        <div className="header-icons d-inline-block align-middle">
          <NeedHelp />
          <TopnavEasyAccess />
          <TopnavNotifications />
          <button
            className="header-icon btn btn-empty d-sm-inline-block d-none"
            type="button"
            id="fullScreenButton"
            onClick={toggleFullScreen}
          >
            {isInFullScreen ? (
              <i className="simple-icon-size-actual d-block" />
            ) : (
              <i className="simple-icon-size-fullscreen d-block" />
            )}
          </button>
        </div>
        <div className="user d-inline-block">
          <UncontrolledDropdown className="dropdown-menu-right">
            <DropdownToggle className="p-0 d-inline-block" color="empty">
              <span className="name mr-1">{user.name}</span>
              <span>
                {/* <img alt="Profile" src={user.avatar_url} /> */}
                <Thumbnail source={user.avatar_url} name={user.name} />
              </span>
            </DropdownToggle>
            <DropdownMenu className="mt-3" right>
              {showChangeAccountOption() && (
                <DropdownItem
                  onClick={() => {
                    setModalOpenToggleAccounts(!modalOpenToggleAccounts);
                  }}
                >
                  <IntlMessages id="SIDEBAR_ITEMS.CHANGE_ACCOUNTS" />
                </DropdownItem>
              )}

              <DropdownItem>
                <NavLink to={`${adminRoot}/profile/settings`}>
                  <IntlMessages id="PROFILE_SETTINGS.LINK" />
                </NavLink>
              </DropdownItem>
              <AvailabilityStatus />
              {/* <DropdownItem>History</DropdownItem>
              <DropdownItem>Support</DropdownItem> */}
              <DropdownItem divider />
              <DropdownItem onClick={() => handleLogout()}>
                Sign out
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
      <ToggleAccount
        modalOpen={modalOpenToggleAccounts}
        toggleModal={() => {
          setModalOpenToggleAccounts(!modalOpenToggleAccounts);
        }}
        accounts={accounts}
        user={user}
      />
    </nav>
  );
};

const mapStateToProps = ({ authUser, menu, settings }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { error, logoutSuccess } = authUser;
  const { locale } = settings;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    error,
    logoutSuccess,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    setContainerClassnamesAction: setContainerClassnames,
    clickOnMobileMenuAction: clickOnMobileMenu,
    logoutUserAction: logoutUser,
    changeLocaleAction: changeLocale,
  })(TopNav)
);
