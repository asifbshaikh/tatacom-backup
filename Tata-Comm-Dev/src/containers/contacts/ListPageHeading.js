/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Button,
  // ButtonDropdown,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  // CustomInput,
  Collapse,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import ContactFilterModal from './ContactFilterModal';
// import { DataListIcon, ThumbListIcon, ImageListIcon } from 'components/svg';
import Breadcrumb from '../navs/Breadcrumb';
import { connect } from 'react-redux';
import {
  contactFilterCleanUp,
  deleteContactFilters,
  saveContactsFilters,
} from 'redux/contacts/actions';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import SaveAndDeleteModal from 'containers/inbox/SaveAndDeleteModal';
import { adminRoot } from 'constants/defaultValues';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { removeEmptyPropertyFilterJson } from 'helpers/ConversationFiltersHelper';
import {
  useHistory,
  useParams,
} from 'react-router-dom/cjs/react-router-dom.min';
import ContactsEnums from 'enums/contacts/contactsEnums';

const ListPageHeading = ({
  intl,
  //   displayMode,
  //   changeDisplayMode,
  // handleChangeSelectAll,
  changeOrderBy,
  changeOrderByDir,
  changePageSize,
  selectedPageSize,
  totalItemCount,
  selectedOrderOption,
  selectedOrderOptionDir,
  match,
  startIndex,
  endIndex,
  // selectedItemsLength,
  // itemsLength,
  orderOptions,
  orderOptionsDir,
  pageSizes,
  toggleModal,
  toggleModalImport,
  heading,
  handleSearch,
  contactsFilters,
  contactFilterSegment,
  savedCustomFilters,
  errorCustomFilter,
  saveContactsFiltersAction,
  contactFilterCleanUpAction,
  deleteContactFiltersSuccess,
  deleteContactFiltersError,
  deleteContactFiltersAction,
}) => {
  // const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deleteFilterModal, setDeleteFilterModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { messages } = intl;
  const history = useHistory();
  const queryParams = useParams();
  const selectedContactFilter = contactFilterSegment?.filter((data) => {
    if (data?.id == queryParams?.filterId) {
      return data;
    }
  });

  const isCustomViewRoute = history.location.pathname.includes(
    ContactsEnums.CUSTOM_VIEW
  );

  useEffect(() => {
    if (savedCustomFilters) {
      const id = contactsFilters.id;
      history.push(`${adminRoot}/contacts/list/custom_view/${id}`);
    }
  }, [savedCustomFilters]);

  const handleSaveFilter = (values) => {
    const payload = removeEmptyPropertyFilterJson(
      JSON.parse(JSON.stringify(contactsFilters.filters))
    );
    saveContactsFiltersAction({ ...values, query: { payload } });
  };

  const saveFilterSchema = Yup.object().shape({
    name: Yup.string().required(),
  });

  const toggleSaveModal = (form) => {
    contactFilterCleanUpAction();
    setSaveFilterModal(!saveFilterModal);
    form.setFieldValue('name', '');
  };

  const toggleDeleteModal = () => {
    contactFilterCleanUpAction();
    setDeleteFilterModal(!deleteFilterModal);
    if (contactFilterSegment.length) {
      const { id } = contactFilterSegment[contactFilterSegment.length - 1];
      history.push(`${adminRoot}/contacts/list/custom_view/${id}`);
    } else {
      history.push(`${adminRoot}/contacts/list`);
    }
  };

  const handleOnConfirmDeleteBtn = () => {
    deleteContactFiltersAction({
      id: queryParams?.filterId,
      filter_type: ContactsEnums.CONTACT,
    });
  };

  const isSaveFilterActive =
    contactsFilters?.filters?.length > 0 && isFilterApplied;

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id={heading} />
            </h1>

            <div className="text-zero top-right-button-container">
              <Button
                color="primary"
                size="lg"
                className="top-right-button"
                onClick={() => toggleModal()}
              >
                <IntlMessages id="CREATE_CONTACT.BUTTON_LABEL" />
              </Button>{' '}
              <Button
                color="secondary"
                size="lg"
                className="top-right-button"
                onClick={() => toggleModalImport()}
              >
                <IntlMessages id="IMPORT_CONTACTS.BUTTON_LABEL" />
              </Button>
              {/* {'  '}
            <ButtonDropdown
              isOpen={dropdownSplitOpen}
              toggle={() => setDropdownSplitOpen(!dropdownSplitOpen)}
            >
              <div className="btn btn-primary btn-lg pl-4 pr-0 check-button check-all">
                <CustomInput
                  className="custom-checkbox mb-0 d-inline-block"
                  type="checkbox"
                  id="checkAll"
                  checked={selectedItemsLength >= itemsLength}
                  onChange={() => handleChangeSelectAll(true)}
                  label={
                    <span
                      className={`custom-control-label ${
                        selectedItemsLength > 0 &&
                        selectedItemsLength < itemsLength
                          ? 'indeterminate'
                          : ''
                      }`}
                    />
                  }
                />
              </div>
              <DropdownToggle
                caret
                color="primary"
                className="dropdown-toggle-split btn-lg"
              />
              <DropdownMenu right>
                <DropdownItem>
                  <IntlMessages id="pages.delete" />
                </DropdownItem>
                <DropdownItem>
                  <IntlMessages id="pages.another-action" />
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown> */}
            </div>
            <Breadcrumb match={match} />
          </div>

          <div className="mb-2">
            <Button
              color="empty"
              className="pt-0 pl-0 d-inline-block d-md-none"
              onClick={() => setDisplayOptionsIsOpen(!displayOptionsIsOpen)}
            >
              <IntlMessages id="pages.display-options" />{' '}
              <i className="simple-icon-arrow-down align-middle" />
            </Button>
            <Collapse
              isOpen={displayOptionsIsOpen}
              className="d-md-block"
              id="displayOptions"
            >
              <div className="d-block d-md-inline-block pt-1 filters-row">
                <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                  <DropdownToggle
                    caret
                    color="outline-dark"
                    size="xs"
                    className="font-weight-normal"
                  >
                    <IntlMessages id="pages.orderby" />
                    <IntlMessages id={selectedOrderOption.label} />
                  </DropdownToggle>
                  <DropdownMenu>
                    {orderOptions.map((order, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => changeOrderBy(order.column)}
                        >
                          <IntlMessages id={order.label} />
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                  <DropdownToggle
                    caret
                    color="outline-dark"
                    size="xs"
                    className="font-weight-normal"
                  >
                    <IntlMessages id="pages.orderbydir" />
                    {selectedOrderOptionDir.label}
                  </DropdownToggle>
                  <DropdownMenu>
                    {orderOptionsDir.map((order, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => changeOrderByDir(order.column)}
                        >
                          {order.label}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                  <input
                    type="text"
                    name="keyword"
                    id="search"
                    placeholder={messages['menu.search']}
                    onChange={(e) => handleSearch(e)}
                  />
                </div>
                {isCustomViewRoute ? (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setDeleteFilterModal(true);
                    }}
                    className="d-inline-block float-md-left pl-2 pt-1 pb-1 align-top filter-btn font-weight-bold clickable-text user-pointer"
                  >
                    <i className="simple-icon-trash pl-1 pr-1" />
                    <IntlMessages id="CONTACTS_PAGE.FILTER_CONTACTS_DELETE" />
                  </span>
                ) : (
                  <>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setFilterIsOpen(!filterIsOpen);
                      }}
                      className="d-inline-block float-md-left pl-2 pt-1 pb-1 align-top filter-btn font-weight-bold clickable-text user-pointer"
                    >
                      <i className="iconsminds-filter-2 pl-1 pr-1" />
                      <IntlMessages id="CONTACTS_PAGE.FILTERS" />
                    </span>
                    {isSaveFilterActive && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSaveFilterModal(true);
                        }}
                        className="d-inline-block float-md-left pl-2 pt-1 pb-1 align-top filter-btn font-weight-bold clickable-text user-pointer"
                      >
                        <i className="iconsminds-disk pl-1 pr-1" />
                        <IntlMessages id="CONTACTS_PAGE.FILTER_CONTACTS_SAVE" />
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="float-md-right pt-1">
                <span className="text-muted text-small mr-1">
                  <IntlMessages id="pages.viewing" />
                  {startIndex + 1}-
                  {totalItemCount >= endIndex ? endIndex : totalItemCount}
                  {` | `}
                  <IntlMessages id="pages.total" />
                  {totalItemCount}
                </span>
                <UncontrolledDropdown className="d-inline-block">
                  <DropdownToggle caret color="outline-dark" size="xs">
                    {selectedPageSize}
                  </DropdownToggle>
                  <DropdownMenu right>
                    {pageSizes.map((size, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => changePageSize(size)}
                        >
                          {size}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </Collapse>
          </div>
        </Colxx>
      </Row>
      <Formik
        validateOnMount
        validateOnBlur
        validateOnChange
        onSubmit={handleSaveFilter}
        initialValues={{ name: '', filter_type: 1 }}
        validationSchema={saveFilterSchema}
      >
        {(form) => (
          <SaveAndDeleteModal
            filterIsOpen={saveFilterModal}
            header={
              <IntlMessages id="CONTACTS_PAGE.CONTACT_FILTERS.HEADERS.SAVE_FILTER" />
            }
            disableLeftBtn={!form.isValid}
            inputToggle={() => toggleSaveModal(form)}
            leftHandleOnClick={form.handleSubmit}
            rightHandleOnClick={() => toggleSaveModal(form)}
            formSuccess={savedCustomFilters}
            formError={errorCustomFilter}
            successMsg={
              'CONTACTS_PAGE.CONTACT_FILTERS.MESSAGES.FITLER_SAVED_SUCCESSFULLY'
            }
          >
            <Form>
              <FormGroupCoustom
                dataTestId="contactFilterName"
                identifierLabel={
                  'CONTACTS_PAGE.CONTACT_FILTERS.LABELS.NAME_THIS_FILTER'
                }
                identifier={'name'}
                errors={form.errors}
                touched={form.touched}
              />
            </Form>
          </SaveAndDeleteModal>
        )}
      </Formik>
      <SaveAndDeleteModal
        filterIsOpen={deleteFilterModal}
        header={
          <IntlMessages id="CONTACTS_PAGE.CONTACT_FILTERS.HEADERS.CONFIRM_DELETION" />
        }
        inputToggle={toggleDeleteModal}
        leftHandleOnClick={handleOnConfirmDeleteBtn}
        leftBtnLabel={'CONTACTS_PAGE.CONTACT_FILTERS.BUTTONS.YES_DELETE'}
        rightHandleOnClick={() => setDeleteFilterModal(!deleteFilterModal)}
        rightBtnLabel={'CONTACTS_PAGE.CONTACT_FILTERS.BUTTONS.NO_KEEP_IT'}
        formSuccess={deleteContactFiltersSuccess}
        formError={deleteContactFiltersError}
        successMsg={
          'CONTACTS_PAGE.CONTACT_FILTERS.MESSAGES.FILTER_DELTED_SUCCESSFULLY'
        }
      >
        <div className="d-flex align-items center">
          <IntlMessages
            id={'CONTACTS_PAGE.CONTACT_FILTERS.LABELS.DELETE_MODAL_LABEL'}
          />
          <span className="ml-1">
            <strong>{selectedContactFilter[0]?.name || ''}</strong> ?
          </span>
        </div>
      </SaveAndDeleteModal>
      <Separator className="mb-5" />
      {filterIsOpen && (
        <>
          <Row noGutters>
            <ContactFilterModal
              setIsFilterApplied={setIsFilterApplied}
              filterIsOpen={filterIsOpen}
              setFilterIsOpen={setFilterIsOpen}
            />
          </Row>
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ contactsApp }) => {
  const {
    contactsFilters,
    deleteContactFiltersSuccess,
    deleteContactFiltersError,
    savedCustomFilters,
    errorCustomFilter,
    contactFilterSegment,
  } = contactsApp;
  return {
    contactsFilters,
    deleteContactFiltersSuccess,
    deleteContactFiltersError,
    savedCustomFilters,
    errorCustomFilter,
    contactFilterSegment,
  };
};

export default connect(mapStateToProps, {
  saveContactsFiltersAction: saveContactsFilters,
  contactFilterCleanUpAction: contactFilterCleanUp,
  deleteContactFiltersAction: deleteContactFilters,
})(injectIntl(ListPageHeading));
