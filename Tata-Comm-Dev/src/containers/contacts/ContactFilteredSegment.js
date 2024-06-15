import { adminRoot } from 'constants/defaultValues';
import ContactsEnums from 'enums/contacts/contactsEnums';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { NavItem } from 'reactstrap';
import { getContactsFilters } from 'redux/contacts/actions';

const ContactFilteredSegment = ({
  contactFilterSegment,
  getContactsFiltersAction,
  setListingFilter,
}) => {
  const { filterId } = useParams();
  useEffect(() => {
    getContactsFiltersAction({
      filter_type: ContactsEnums.CONTACT,
    });
  }, []);

  return (
    <>
      {contactFilterSegment.length > 0 && (
        <>
          <p className="text-muted text-small mb-1">
            <IntlMessages id="CONTACTS_PAGE.CONTACT_FILTERS.LABELS.SEGMENT" />
          </p>
          <ul className="list-unstyled ml-2 mb-1 nav-effects-custom">
            {contactFilterSegment.map((item) => {
              return (
                <NavItem
                  className={`mb-1 ${
                    filterId === item.id.toString() ? ContactsEnums.ACTIVE : ''
                  }`}
                  key={item.id}
                >
                  <NavLink
                    data-testid={`contactSegment_${item.id}`}
                    to={`${adminRoot}/contacts/list/custom_view/${item?.id}`}
                    onClick={() => setListingFilter()}
                  >
                    {item.name}
                  </NavLink>
                </NavItem>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ contactsApp }) => {
  const { contactFilterSegment } = contactsApp;
  return {
    contactFilterSegment,
  };
};

export default connect(mapStateToProps, {
  getContactsFiltersAction: getContactsFilters,
})(injectIntl(ContactFilteredSegment));
