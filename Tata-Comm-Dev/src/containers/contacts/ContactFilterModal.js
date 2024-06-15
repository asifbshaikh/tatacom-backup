import React, { useState, useEffect } from 'react';
import { Formik, FieldArray, Form } from 'formik';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
} from 'reactstrap';
import Select from 'react-select';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import { Colxx } from 'components/common/CustomBootstrap';
import {
  getContactsList,
  getCountryDropdownList,
  contactFilterSuccess,
  contactFilterFailure,
  ContactFilter,
  getAttributes,
} from 'redux/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import { DATE_FORMAT_WITHOUT_TIME } from 'constants/appConstant';
import {
  customStyles,
  operationDropDownCustomStyles,
} from 'data/contactFilterData';
import moment from 'moment';
import Datetime from 'react-datetime';
import ContactsEnums from 'enums/contacts/contactsEnums';

const ContactFilterModal = ({
  filterIsOpen,
  setFilterIsOpen,
  intl,
  getContactsListAction,
  errorMsg,
  getCountryList,
  countryListData,
  contactFilterSuccessState,
  contactFilterFailureState,
  contactFilterSuccessAction,
  contactFilterFailureAction,
  getContactsFiltersAction,
  contactsFiltersValues,
  getAttributesAction,
  attributesValues,
  setIsFilterApplied,
}) => {
  const { messages } = intl;
  const inputToggle = () => setFilterIsOpen(!filterIsOpen);
  let countryListOptions = [];
  let payload = [];
  useEffect(() => {
    getCountryList();
    getAttributesAction();
  }, []);
  const filterTypes = [
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.STANDARD_FILTERS'],
      options: [
        {
          label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.NAME'],
          value: ContactsEnums.NAME,
        },
        {
          label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.EMAIL'],
          value: ContactsEnums.EMAIL,
        },
        {
          label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.PHONE_NUMBER'],
          value: ContactsEnums.PHONE_NUMBER,
        },
        {
          label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.IDENTIFIER'],
          value: ContactsEnums.IDENTIFIER,
        },
        {
          label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.COUNTRY'],
          value: ContactsEnums.COUNTRY,
        },
        {
          label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.CITY'],
          value: ContactsEnums.CITY,
        },
        {
          label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.LAST_ACTIVITY'],
          value: ContactsEnums.LAST_ACTIVITY,
        },
        {
          label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.CREATED_AT'],
          value: ContactsEnums.CREATED_AT,
        },
      ],
    },
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.CUSTOM_ATTRIBUTES'],
      options: [],
    },
  ];
  if (attributesValues.length > 0 && filterTypes[1].options.length === 0) {
    for (let i = 0; i < attributesValues.length; i++) {
      if (
        attributesValues[i].attribute_model === ContactsEnums.ATTRIBUTE_CONTACT
      ) {
        filterTypes[1].options.push({
          label: attributesValues[i].attribute_display_name,
          value: attributesValues[i].attribute_display_name.toLowerCase(),
          type: attributesValues[i].attribute_display_type,
          key: attributesValues[i].attribute_key,
        });
      }
    }
  }
  const equalTypes = [
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.EQUAL_TO'],
      value: ContactsEnums.EQUAL_TO,
    },
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.NOT_EQUAL_TO'],
      value: ContactsEnums.NOT_EQUAL_TO,
    },
  ];
  const containsTypes = [
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.CONTAINS'],
      value: ContactsEnums.CONTAINS,
    },
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.DOES_NOT_CONTAIN'],
      value: ContactsEnums.DOES_NOT_CONTAIN,
    },
  ];
  const presentTypes = [
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.PRESENT'],
      value: ContactsEnums.PRESENT,
    },
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.NOT_PRESENT'],
      value: ContactsEnums.NOT_PRESENT,
    },
  ];
  const rangeTypes = [
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.GREATER_THAN'],
      value: ContactsEnums.GREATER_THAN,
    },
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.LESSER_THAN'],
      value: ContactsEnums.LESSER_THAN,
    },
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.IS_X_DAYS'],
      value: ContactsEnums.IS_X_DAYS,
    },
  ];
  const operationTypes = [
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.AND'],
      value: ContactsEnums.AND,
    },
    {
      label: messages['CONTACTS_PAGE.FILTERS_OPTIONS.OR'],
      value: ContactsEnums.OR,
    },
  ];
  const initialValues = {
    filters: [
      {
        filter1: filterTypes[0].options[0],
        filter2: equalTypes[0],
        text: '',
      },
    ],
  };
  if (countryListData && countryListData.length > 0) {
    countryListOptions = countryListData.map((item) => {
      return {
        label: `${item.name} (${item.phone_code})`,
        value: item.country_code,
      };
    });
    countryListOptions.unshift({ id: '', value: '' });
  }
  if (contactFilterSuccessState) {
    NotificationManager.success(
      <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.FILTER_SUCCESS" />,
      'Success',
      6000,
      null,
      null,
      ''
    );
    inputToggle();
    contactFilterSuccessAction(false);
    contactFilterFailureAction(false);
  }
  if (contactFilterFailureState) {
    NotificationManager.error(errorMsg.errorMsg, 'failure', 5000, null, null);
    contactFilterSuccessAction(false);
    contactFilterFailureAction(false);
  }
  const [search, setSearch] = useState('');
  const [listingFilter, setListingFilter] = useState({ labels: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderOption, setSelectedOrderOption] = useState({
    column: 'name',
    label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.NAME',
  });
  const [selectedOrderOptionDir, setSelectedOrderOptionDir] = useState({
    column: '',
    label: 'Ascending',
  });
  const handleSubmit = (values) => {
    const params = {
      search,
      listingFilter,
      currentPage,
      selectedOrderOptionDir,
      selectedOrderOption,
    };
    getContactsFiltersAction(values.filters);
    for (let i = 0; i < values.filters.length; i++) {
      if (i > 0) {
        payload[i - 1].query_operator = values.filters[i].separators.value;
      }
      payload.push({
        attribute_key: values.filters[i].filter1.value,
        filter_operator: values.filters[i].filter2.value,
        values:
          values.filters[i].filter1.value === ContactsEnums.COUNTRY
            ? [values.filters[i].text.value]
            : values.filters[i].filter1.value === ContactsEnums.LAST_ACTIVITY &&
              values.filters[i].filter2.value === ContactsEnums.IS_X_DAYS
            ? values.filters[i].text
            : [values.filters[i].text],
        ...(i === 0 && {
          attribute_model: ContactsEnums.STANDARD,
        }),
      });
    }
    params.payload = payload;
    getContactsListAction(params);
    setIsFilterApplied(true);
  };
  const handleOperationTypes = (index, selectedOption, setFieldValue) => {
    setFieldValue(`filters.${index}.separators`, selectedOption);
  };
  const handleFilterTypes = (index, selectedOption, setFieldValue) => {
    setFieldValue(`filters.${index}.filter1`, selectedOption);
    if (
      selectedOption.value === ContactsEnums.CREATED_AT ||
      selectedOption.value === ContactsEnums.LAST_ACTIVITY
    ) {
      setFieldValue(`filters.${index}.filter2`, rangeTypes[0]);
      setFieldValue(
        `filters.${index}.text`,
        moment().format(DATE_FORMAT_WITHOUT_TIME)
      );
    } else if (selectedOption.type === ContactsEnums.DATE) {
      setFieldValue(
        `filters.${index}.text`,
        moment().format(DATE_FORMAT_WITHOUT_TIME)
      );
    } else if (
      selectedOption.value !== ContactsEnums.COUNTRY &&
      selectedOption.value !== ContactsEnums.CREATED_AT &&
      selectedOption.value !== ContactsEnums.LAST_ACTIVITY
    ) {
      setFieldValue(`filters.${index}.filter2`, equalTypes[0]);
      setFieldValue(`filters.${index}.text`, '');
    }
  };
  const handleEqualTypes = (index, selectedOption, setFieldValue) => {
    setFieldValue(`filters.${index}.filter2`, selectedOption);
    if (selectedOption.value === ContactsEnums.IS_X_DAYS) {
      setFieldValue(`filters.${index}.text`, '');
    }
  };
  const handleDateTime = (index, e, setFieldValue) => {
    const date = moment(e).format(DATE_FORMAT_WITHOUT_TIME);
    setFieldValue(`filters.${index}.text`, date);
  };
  const handleCountryChange = (index, selectedOption, setFieldValue) => {
    setFieldValue(`filters.${index}.text`, selectedOption);
  };
  const handleTexthange = (index, e, setFieldValue) => {
    setFieldValue(`filters.${index}.text`, e.target.value);
  };
  const handleRemove = (values, index, remove) => {
    if (values.filters.length === 1) {
      NotificationManager.error(
        <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.WARNING" />,
        'Warning!',
        2000,
        null,
        null
      );
    } else {
      remove(index);
    }
  };
  const handleAddFilters = (push) => {
    push({
      filter1: filterTypes[0].options[0],
      filter2: equalTypes[0],
      text: '',
      separators: operationTypes[0],
    });
  };
  const handleClearFilters = () => {
    getContactsFiltersAction(initialValues.filters);
    payload = [];
    const params = {
      search,
      listingFilter,
      currentPage,
      selectedOrderOptionDir,
      selectedOrderOption,
    };
    getContactsListAction(params);
    inputToggle();
    setIsFilterApplied(false);
  };
  const handleFilterTwoOptions = (values, index) => {
    let filterTwoType = equalTypes;
    switch (values?.filters[index]?.filter1?.value) {
      case ContactsEnums.CREATED_AT:
      case ContactsEnums.LAST_ACTIVITY:
        filterTwoType = rangeTypes;
        break;
      case ContactsEnums.CITY:
      case ContactsEnums.EMAIL:
      case ContactsEnums.PHONE_NUMBER:
        filterTwoType = [...equalTypes, ...containsTypes];
        break;
      default:
        break;
    }

    switch (values?.filters[index]?.filter1?.type) {
      case ContactsEnums.TEXT:
      case ContactsEnums.NUMBER:
        filterTwoType = [...equalTypes, ...containsTypes];
        break;
      case ContactsEnums.DATE:
        filterTwoType = [...equalTypes, ...presentTypes, ...rangeTypes];
        break;
      default:
        break;
    }
    return filterTwoType;
  };

  const savedFiltersData =
    contactsFiltersValues?.filters?.length > 0 ? contactsFiltersValues : {};

  return (
    <Modal isOpen={filterIsOpen} toggle={inputToggle} size="lg">
      <ModalHeader
        toggle={() => {
          setFilterIsOpen(false);
        }}
      >
        <div className="heading">
          <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.FILTER_CONTACTS" />
        </div>
        <div>
          <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.SUBHEADING" />
        </div>
      </ModalHeader>
      <Formik
        initialValues={{
          filters: [
            {
              attribute_key: ContactsEnums.FILTER_KEYS.STATUS,
              filter_operator: ContactsEnums.FILTER_KEYS.EQUALS_TO,
              values: '',
              attribute_model: ContactsEnums.FILTER_KEYS.STANDARD,
              filter1: filterTypes[0].options[0],
              filter2: equalTypes[0],
            },
          ],
          ...savedFiltersData,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <ModalBody>
                <FieldArray name="filters">
                  {({ push, remove }) => (
                    <>
                      {values?.filters?.map((_, index) => (
                        <div key={index}>
                          {index > 0 && (
                            <FormGroup className="operation-form-group">
                              <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                name={`filters.${index}.separators`}
                                id={`separators-${index}`}
                                onChange={(selectedOption) => {
                                  handleOperationTypes(
                                    index,
                                    selectedOption,
                                    setFieldValue
                                  );
                                }}
                                value={values?.filters[index]?.separators}
                                options={operationTypes}
                                isSearchable
                                styles={operationDropDownCustomStyles}
                              />
                            </FormGroup>
                          )}
                          <FormGroup className="pt-2 pb-2 filter-type-form-group">
                            <Colxx md="4">
                              <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                name={`filters.${index}.filter1`}
                                id={`filter1-${index}`}
                                onChange={(selectedOption) => {
                                  handleFilterTypes(
                                    index,
                                    selectedOption,
                                    setFieldValue
                                  );
                                }}
                                defaultValue={filterTypes[0].options[0]}
                                value={values.filters[index].filter1}
                                options={filterTypes}
                                styles={customStyles}
                              />
                            </Colxx>
                            <Colxx xs="4">
                              <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                name={`filters.${index}.filter2`}
                                id={`filter2-${index}`}
                                onChange={(selectedOption) => {
                                  handleEqualTypes(
                                    index,
                                    selectedOption,
                                    setFieldValue
                                  );
                                }}
                                defaultValue={equalTypes[0]}
                                value={
                                  (values?.filters[index]?.filter1?.value ===
                                    ContactsEnums.CREATED_AT ||
                                    values?.filters[index]?.filter1?.value ===
                                      ContactsEnums.LAST_ACTIVITY) &&
                                  values?.filters[index]?.filter2?.value ===
                                    equalTypes[0].value
                                    ? rangeTypes[0]
                                    : values?.filters[index]?.filter2
                                }
                                options={handleFilterTwoOptions(values, index)}
                              />
                            </Colxx>
                            <Colxx md="3">
                              <div>
                                {(values?.filters[index]?.filter1?.value ===
                                  ContactsEnums.CREATED_AT ||
                                  values?.filters[index]?.filter1?.value ===
                                    ContactsEnums.LAST_ACTIVITY ||
                                  values?.filters[index]?.filter1?.type ===
                                    ContactsEnums.DATE) &&
                                values?.filters[index]?.filter2?.value !==
                                  ContactsEnums.IS_X_DAYS &&
                                values?.filters[index]?.filter2?.value !==
                                  ContactsEnums.PRESENT &&
                                values?.filters[index]?.filter2?.value !==
                                  ContactsEnums.NOT_PRESENT ? (
                                  <Datetime
                                    className="send-date"
                                    name={`filters.${index}.text`}
                                    input
                                    dateFormat
                                    initialValue={moment().format(
                                      DATE_FORMAT_WITHOUT_TIME
                                    )}
                                    timeFormat={false}
                                    value={values.filters[index].text}
                                    placeholder={
                                      <IntlMessages id="custom campaign date" />
                                    }
                                    onChange={(e) => {
                                      handleDateTime(index, e, setFieldValue);
                                    }}
                                  />
                                ) : values?.filters[index]?.filter1?.value ===
                                  ContactsEnums.COUNTRY ? (
                                  <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    name={`filters.${index}.filter2`}
                                    id={`filter2-${index}`}
                                    onChange={(selectedOption) => {
                                      handleCountryChange(
                                        index,
                                        selectedOption,
                                        setFieldValue
                                      );
                                    }}
                                    value={values?.filters[index]?.text}
                                    options={countryListOptions}
                                  />
                                ) : values?.filters[index]?.filter2?.value !==
                                    ContactsEnums.PRESENT &&
                                  values?.filters[index]?.filter2?.value !==
                                    ContactsEnums.NOT_PRESENT ? (
                                  <Input
                                    className="dashboard-search-value"
                                    placeholder={
                                      messages[
                                        'CONTACTS_PAGE.FILTERS_OPTIONS.ENTER_VALUE'
                                      ]
                                    }
                                    type="text"
                                    name={`filters.${index}.text`}
                                    id={`text-${index}`}
                                    value={values.filters[index].text}
                                    onChange={(e) => {
                                      handleTexthange(index, e, setFieldValue);
                                    }}
                                  />
                                ) : (
                                  <></>
                                )}
                              </div>
                            </Colxx>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                handleRemove(values, index, remove);
                              }}
                              className="font-weight-bold clickable-text user-pointer pt-2 pl-4 close-btn"
                            >
                              <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.CLOSE" />
                            </span>
                          </FormGroup>
                        </div>
                      ))}
                      <Button
                        color="secondary"
                        onClick={() => {
                          handleAddFilters(push);
                        }}
                      >
                        <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.EXTRA_FILTER" />
                      </Button>
                      {contactsFiltersValues && (
                        <Button
                          color="secondary"
                          onClick={() => {
                            handleClearFilters();
                          }}
                          className="clear-filters"
                        >
                          <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.CLEAR_FILTERS" />
                        </Button>
                      )}
                    </>
                  )}
                </FieldArray>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => {
                    setFilterIsOpen(false);
                  }}
                >
                  <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.CANCEL" />
                </Button>
                <Button type="submit" color="primary">
                  <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.APPLY_FILTERS" />
                </Button>
              </ModalFooter>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { contactsApp, settingsChannels, attributesApp } = state;
  const {
    errorAdd,
    contactFilterSuccess,
    contactFilterFailure,
    contactsFilters,
  } = contactsApp;
  const { countryList } = settingsChannels;
  const { attributes } = attributesApp;
  return {
    errorMsg: errorAdd,
    countryListData: countryList,
    contactFilterSuccessState: contactFilterSuccess,
    contactFilterFailureState: contactFilterFailure,
    contactsFiltersValues: contactsFilters,
    attributesValues: attributes,
  };
};
export default connect(mapStateToProps, {
  getContactsListAction: getContactsList,
  getCountryList: getCountryDropdownList,
  contactFilterSuccessAction: contactFilterSuccess,
  contactFilterFailureAction: contactFilterFailure,
  getContactsFiltersAction: ContactFilter,
  getAttributesAction: getAttributes,
})(injectIntl(ContactFilterModal));
