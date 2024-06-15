import React from 'react';
import { injectIntl } from 'react-intl';

import { DropdownItem } from 'reactstrap';

import { connect } from 'react-redux';

// import IntlMessages from 'helpers/IntlMessages';
import { getCurrentUserAccount } from 'helpers/Utils';
import { updateAvailability, updateAvailabilityClean } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';

const AVAILABILITY_STATUS_KEYS = ['online', 'busy', 'offline'];

const TopNav = ({
  intl,
  updateAvailabilityAction,
  updateAvailabilityCleanAction,
  formSuccess,
}) => {
  const { messages } = intl;

  const handleLogout = (availability) => {
    updateAvailabilityAction({
      profile: { availability, account_id: getCurrentUserAccount().id },
    });
  };
  if (formSuccess) {
    NotificationManager.success(
      'Updated successfully',
      'Success',
      6000,
      null,
      null,
      '' // className
    );
    updateAvailabilityCleanAction({});
  }

  const availabilityStatuses = () => {
    return AVAILABILITY_STATUS_KEYS.map((statusLabel, index) => ({
      label:
        messages[`PROFILE_SETTINGS.FORM.AVAILABILITY.STATUSES_LIST.${index}`],
      value: statusLabel,
    }));
  };

  return (
    <>
      <DropdownItem divider />
      {availabilityStatuses().map(({ label, value }) => {
        return (
          <DropdownItem
            key={value}
            onClick={() => handleLogout(value)}
            active={value === getCurrentUserAccount().availability}
            disabled={value === getCurrentUserAccount().availability}
          >
            {label}
            {/* <IntlMessages id={`PROFILE_SETTINGS.FORM.AVAILABILITY.STATUSES_LIST.${value}`} /> */}
          </DropdownItem>
        );
      })}
    </>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { successUpdateAvailibility } = authUser;
  return {
    formSuccess: successUpdateAvailibility,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    updateAvailabilityAction: updateAvailability,
    updateAvailabilityCleanAction: updateAvailabilityClean,
  })(TopNav)
);
