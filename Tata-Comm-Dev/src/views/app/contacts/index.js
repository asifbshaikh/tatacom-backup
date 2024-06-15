import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { getContactsList } from 'redux/actions';

const ContactsList = React.lazy(() =>
  import(/* webpackChunkName: "contacts-list" */ './list')
);
const ContactsDetails = React.lazy(() =>
  import(/* webpackChunkName: "contacts-list-details" */ './details')
);

const PagesContacts = ({ match, getContactsListAction }) => {
  const [reloadList, setReloadList] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(8);
  const [listingFilter, setListingFilter] = useState({ labels: 'all' });
  const [selectedOrderOption, setSelectedOrderOption] = useState({
    column: 'name',
    label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.NAME',
  });
  const [selectedOrderOptionDir, setSelectedOrderOptionDir] = useState({
    column: '',
    label: 'Ascending',
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedPageSize,
    selectedOrderOption,
    selectedOrderOptionDir,
    listingFilter,
  ]);

  return (
    <>
      <div className="row">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route
              path={`${match.url}/details/:surveyid`}
              render={(props) => {
                return (
                  <>
                    <div className="tagged-with col-2">
                      <ContactApplicationMenu
                        match={match}
                        listingFilter={listingFilter}
                        setListingFilter={setListingFilter}
                      />
                    </div>
                    <div className="col-10">
                      <ContactsDetails {...props} />
                    </div>
                  </>
                );
              }}
              isExact
            />
            <Route
              path={[
                `${match.url}/list/custom_view/:filterId`,
                `${match.url}/list`,
              ]}
              render={(props) => {
                return (
                  <>
                    <div className="tagged-with col-2">
                      <ContactApplicationMenu
                        match={match}
                        listingFilter={listingFilter}
                        setListingFilter={setListingFilter}
                      />
                    </div>
                    <div className="col-10">
                      <ContactsList
                        {...props}
                        reloadList={reloadList}
                        setReloadList={setReloadList}
                        search={search}
                        setSearch={setSearch}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        selectedPageSize={selectedPageSize}
                        setSelectedPageSize={setSelectedPageSize}
                        listingFilter={listingFilter}
                        setListingFilter={setListingFilter}
                        selectedOrderOption={selectedOrderOption}
                        setSelectedOrderOption={setSelectedOrderOption}
                        selectedOrderOptionDir={selectedOrderOptionDir}
                        setSelectedOrderOptionDir={setSelectedOrderOptionDir}
                      />
                    </div>
                  </>
                );
              }}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </>
  );
};
const mapStateToProps = ({ contactsApp }) => {
  const { loadedContactsList, contactsList } = contactsApp;
  return {
    loadedContactsList,
    contactsList,
  };
};
export default connect(mapStateToProps, {
  getContactsListAction: getContactsList,
})(PagesContacts);
