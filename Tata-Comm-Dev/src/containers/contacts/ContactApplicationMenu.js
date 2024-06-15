import React from 'react';
import LabelsFilter from 'containers/contacts/LabelsFilter';
import ContactFilteredSegment from './ContactFilteredSegment';
import { adminRoot } from 'constants/defaultValues';
import IntlMessages from 'helpers/IntlMessages';
import { NavLink } from 'react-router-dom';
import { NavItem } from 'reactstrap';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ContactsEnums from 'enums/contacts/contactsEnums';

const ContactApplicationMenu = ({ listingFilter, setListingFilter }) => {
  const queryParams = useParams();
  const filterId = queryParams?.filterId;

  const isActive =
    listingFilter &&
    !filterId &&
    (listingFilter.labels === ContactsEnums.ALL ||
      (typeof listingFilter.labels === ContactsEnums.OBJECT &&
        listingFilter.labels[0] === ContactsEnums.ALL));
  return (
    <>
      <div className="p-3">
        <div className="mb-1">
          <ul className="list-unstyled mb-1 nav-effects-custom">
            <NavItem className={`mb-1 ${isActive ? 'active' : ''}`}>
              <NavLink
                to={`${adminRoot}/contacts/list`}
                onClick={() => setListingFilter({ labels: ContactsEnums.ALL })}
              >
                <i className="iconsminds-address-book-2 mr-1" />
                <IntlMessages id="menu.all-contacts" />
              </NavLink>
            </NavItem>
          </ul>
        </div>
        <ContactFilteredSegment setListingFilter={setListingFilter} />
        <LabelsFilter
          listingFilter={listingFilter}
          setListingFilter={setListingFilter}
        />
      </div>
    </>
  );
};

export default ContactApplicationMenu;
/*
const mapStateToProps = ({ contactsApp }) => {
  const { loaded, labels } =
    contactsApp;

  return {
    loaded,
    labels,
  };
};
export default connect(mapStateToProps, {
  getLabelsContactItemAction: getLabelsContactItem,
  // getTodoListWithFilterAction: getTodoListWithFilter,
})(ContactApplicationMenu);
*/
