import React, { useState } from 'react';
import { Formik, FieldArray, Form } from 'formik';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Alert,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';
import GroupedOptionsSelect from 'components/create-segment/GroupedOptionsSelect';
import {
  getAttributeOptions,
  getFilterOpertorOptions,
  queryOperatorList,
  removeEmptyPropertyFilterJson,
} from 'helpers/ConversationFiltersHelper';
import Select from 'react-select';
import ValueFieldBasedOnDataType from './ValueFieldBasedOnDataType';
import { reactSelectStyles } from 'data/segments/createSegmentFilterData';
import { connect } from 'react-redux';
import {
  applyAdvancedConversationFilters,
  applyAdvancedConversationFiltersCleanUp,
  getConversationFilters,
  messageClean,
} from 'redux/inbox/actions';
import { NotificationManager } from 'components/common/react-notifications';
import ConversationEnums from 'enums/conversations/conversationEnums';
import * as Yup from 'yup';
import { adminRoot } from 'constants/defaultValues';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ConversationNestedFilterModal = ({
  filterIsOpen,
  setFilterIsOpen,
  converstaionFiltersOptions,
  labels,
  inboxes,
  teams,
  agents,
  campaigns,
  countryList,
  getConversationFiltersActions,
  conversationFilters,
  advancedFiltersConversationFiltersAction,
  successAppliedFilters,
  errorAppliedFilters,
  applyAdvancedFiltersCleanUp,
  messageCleanAction,
}) => {
  const history = useHistory();
  const [alertPopUp, setAlertPopUp] = useState(false);

  const cleanUpAndCloseModal = () => {
    setFilterIsOpen(false);
    applyAdvancedFiltersCleanUp();
  };

  const getErrorMessage = (errors, touched) => {
    return (
      errors &&
      touched && <div className="invalid-feedback d-block">{errors}</div>
    );
  };

  const filterSchema = Yup.object().shape({
    filters: Yup.array()
      .of(
        Yup.object().shape({
          attribute_key: Yup.string().required(
            ConversationEnums.IDENTIFIERS.REQUIRED_FIELD
          ),
          filter_operator: Yup.string().required(
            ConversationEnums.IDENTIFIERS.REQUIRED_FIELD
          ),
          values: Yup.mixed().test({
            name: 'testvalue',
            test: function (value, schema) {
              const { filter_operator } = schema.parent;
              if (schema.parent.input_type === 'number') {
                if (!value) {
                  return this.createError({
                    message: ConversationEnums.IDENTIFIERS.REQUIRED_FIELD,
                    path: schema.path,
                  });
                } else if (value < 0) {
                  return this.createError({
                    message:
                      ConversationEnums.IDENTIFIERS.NO_NEGATIVE_VALUE_FIELD,
                    path: schema.path,
                  });
                } else {
                  return true;
                }
              } else if (filter_operator === 'days_before') {
                if (value) {
                  if (value <= 0) {
                    return this.createError({
                      message:
                        ConversationEnums.IDENTIFIERS.NO_NEGATIVE_VALUE_FIELD,
                      path: schema.path,
                    });
                  } else {
                    return true;
                  }
                } else {
                  return this.createError({
                    message: ConversationEnums.IDENTIFIERS.REQUIRED_FIELD,
                    path: schema.path,
                  });
                }
              } else {
                if (value && value.toString().trim()) {
                  return true;
                } else {
                  if (
                    filter_operator !== 'present' &&
                    filter_operator !== 'is_present' &&
                    filter_operator !== 'is_not_present'
                  ) {
                    return this.createError({
                      message: ConversationEnums.IDENTIFIERS.REQUIRED_FIELD,
                      path: schema.path,
                    });
                  } else {
                    return true;
                  }
                }
              }
            },
          }),

          attribute_model: Yup.string(),
          data_type: Yup.string(),
          input_type: Yup.string(),
        })
      )
      .min(1),
  });

  const handleOnAttributeKeyChange = (selectedOption, index, form) => {
    const filteredData = converstaionFiltersOptions?.find((data) => {
      return data.attribute_key === selectedOption.value;
    });
    form.setFieldValue(`filters.${index}.attribute_key`, selectedOption.value);
    form.setFieldValue(
      `filters.${index}.attribute_model`,
      selectedOption.category
    );
    form.setFieldValue(`filters.${index}.input_type`, filteredData?.input_type);
    form.setFieldValue(`filters.${index}.data_type`, filteredData?.data_type);
    form.setFieldValue(`filters.${index}.filter_operator`, '');
    form.setFieldValue(`filters.${index}.values`, ['']);
    form.setFieldTouched(`filters.${index}.filter_operator`, false);
    form.setFieldTouched(`filters.${index}.values`, false);
  };

  const handleOnFilterOperatorChange = (option, index, form) => {
    form.setFieldValue(`filters.${index}.filter_operator`, option.value);
    form.setFieldValue(`filters.${index}.values`, ['']);
    form.setFieldTouched(`filters.${index}.values`, false);
  };
  const handleOnChangeQueryOperator = (option, index, form) => {
    form.setFieldValue(`filters.${index}.query_operator`, option.value);
  };

  const getFilterOpertorValue = (filterObject) => {
    return getFilterOpertorOptions(
      filterObject.attribute_key,
      converstaionFiltersOptions
    )?.filter((data) => data.value === filterObject?.filter_operator);
  };

  const getQueryOpertorValue = (filterObject) => {
    return queryOperatorList.filter((data) => {
      return data.value === filterObject?.query_operator;
    });
  };

  if (successAppliedFilters) {
    const successMsg = 'CONVERSATION_FILTERS.MESSAGES.FILTERS_APPLIED_SUCCESS';
    cleanUpAndCloseModal();
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      'Success',
      6000,
      null,
      null
    );
  }
  if (errorAppliedFilters && errorAppliedFilters.errorMsg) {
    cleanUpAndCloseModal();
    NotificationManager.error(
      errorAppliedFilters?.errorMsg,
      'Error',
      6000,
      null,
      null
    );
  }

  const handleSubmit = (values) => {
    getConversationFiltersActions(values);
    const clonedPayload = JSON.parse(JSON.stringify(values));
    const payload = removeEmptyPropertyFilterJson(clonedPayload);
    advancedFiltersConversationFiltersAction(payload);
    history.push(`${adminRoot}/inbox/list/conversations`);
    messageCleanAction();
  };

  const savedFiltersData =
    conversationFilters?.filters?.length > 0 ? conversationFilters : {};

  return (
    <Modal
      isOpen={filterIsOpen}
      toggle={cleanUpAndCloseModal}
      size="lg"
      centered={true}
      style={{ boxShadow: 'none' }}
    >
      <ModalHeader
        toggle={() => {
          setFilterIsOpen(false);
        }}
      >
        <div>
          <IntlMessages id="CONVERSATION.FILTER_CONVERSATION" />
        </div>
        <div>
          <IntlMessages id="CONVERSATION.FILTER_CONVERSATION_NOTE" />
        </div>
      </ModalHeader>
      <Formik
        initialValues={{
          filters: [
            {
              attribute_key: ConversationEnums.FILTER_KEYS.STATUS,
              filter_operator: ConversationEnums.FILTER_KEYS.EQUALS_TO,
              values: [],
              attribute_model: ConversationEnums.FILTER_KEYS.STANDARD,
              data_type: ConversationEnums.FILTER_KEYS.TEXT,
              input_type: ConversationEnums.FILTER_KEYS.MULTI_SELECT,
            },
          ],
          ...savedFiltersData,
        }}
        onSubmit={handleSubmit}
        validationSchema={filterSchema}
        validateOnMount
        validateOnChange
        validateOnBlur
      >
        {(form) => (
          <Form>
            <ModalBody>
              <Alert
                color="danger"
                isOpen={alertPopUp}
                className="rounded"
                toggle={() => setAlertPopUp(false)}
              >
                <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.FILTER_WARNING" />
              </Alert>
              <FieldArray name="filters">
                {({ push, remove }) => (
                  <>
                    {form.values?.filters?.map((filter, index) => (
                      <React.Fragment key={index.toString()}>
                        <Row
                          key={index.toString()}
                          className="conversation-filters-list"
                        >
                          <Colxx xxs="12" md="4">
                            <GroupedOptionsSelect
                              ariaLabel="attributeName"
                              data={getAttributeOptions(
                                converstaionFiltersOptions
                              )}
                              optionIdentifier={{
                                label: 'attribute_name',
                                value: 'attribute_model',
                              }}
                              fieldLabel="attribute_key"
                              fieldGroupedLabel="attribute_model"
                              groupedOptionsValue={filter}
                              handleOnChangeDropDown={(option) =>
                                handleOnAttributeKeyChange(option, index, form)
                              }
                              handleOnBlur={() =>
                                form.setFieldTouched(
                                  `filters.${index}.attribute_key`,
                                  true,
                                  false
                                )
                              }
                            />
                            {getErrorMessage(
                              form.errors?.filters?.[index]?.attribute_key,
                              form.touched?.filters?.[index]?.attribute_key
                            )}
                          </Colxx>
                          <Colxx xxs="12" md="3">
                            <Select
                              aria-label="filterOperator"
                              options={getFilterOpertorOptions(
                                filter.attribute_key,
                                converstaionFiltersOptions
                              )}
                              onChange={(option) =>
                                handleOnFilterOperatorChange(
                                  option,
                                  index,
                                  form
                                )
                              }
                              onBlur={() =>
                                form.setFieldTouched(
                                  `filters.${index}.filter_operator`
                                )
                              }
                              value={getFilterOpertorValue(filter)}
                              styles={reactSelectStyles}
                            />
                            {getErrorMessage(
                              form.errors?.filters?.[index]?.filter_operator,
                              form.touched?.filters?.[index]?.filter_operator
                            )}
                          </Colxx>

                          <ValueFieldBasedOnDataType
                            form={form}
                            filterValues={filter}
                            index={index}
                            labels={labels}
                            inboxes={inboxes}
                            teams={teams}
                            agents={agents}
                            campaigns={campaigns}
                            countryList={countryList}
                            getErrorMessage={getErrorMessage}
                          />

                          <Colxx xxs="12" md="1">
                            <Button
                              color="primary"
                              close
                              data-testid={`closeBtn_${index}`}
                              type="button"
                              className="border-0 mt-0 pt-0 conversation-filter-close-btn"
                              onClick={() => {
                                if (form.values.filters.length === 1) {
                                  setAlertPopUp(true);
                                } else {
                                  if (index !== 0) {
                                    form.setFieldValue(
                                      `filters.${index - 1}.query_operator`,
                                      ''
                                    );
                                  }
                                  remove(index);
                                }
                              }}
                            />
                          </Colxx>
                        </Row>
                        {form.values.filters[index + 1] && (
                          <Row className="mb-3 mt-3">
                            <Colxx xxs="12" md="4" />
                            <Colxx xxs="12" md="3">
                              <Select
                                aria-label="queryOperator"
                                options={queryOperatorList}
                                onChange={(option) =>
                                  handleOnChangeQueryOperator(
                                    option,
                                    index,
                                    form
                                  )
                                }
                                value={getQueryOpertorValue(filter)}
                                styles={reactSelectStyles}
                                onBlur={() =>
                                  form.setFieldTouched(
                                    `filters.${index}.query_operator`
                                  )
                                }
                              />
                              {getErrorMessage(
                                form.errors?.filters?.[index]?.query_operator,
                                form.touched?.filters?.[index]?.query_operator
                              )}
                            </Colxx>
                            <Colxx xxs="12" md="6" />
                          </Row>
                        )}
                      </React.Fragment>
                    ))}
                    <Row>
                      <Colxx xxs="12" md="3">
                        <Button
                          color="primary"
                          className="mt-3"
                          onClick={() => {
                            form.setFieldValue(
                              `filters.${
                                form.values?.filters?.length - 1
                              }.query_operator`,
                              'and'
                            );
                            push({
                              attribute_key:
                                ConversationEnums.FILTER_KEYS.STATUS,
                              filter_operator:
                                ConversationEnums.FILTER_KEYS.EQUALS_TO,
                              values: [],
                              attribute_model:
                                ConversationEnums.FILTER_KEYS.STANDARD,
                              data_type: ConversationEnums.FILTER_KEYS.TEXT,
                              input_type:
                                ConversationEnums.FILTER_KEYS.MULTI_SELECT,
                            });
                          }}
                        >
                          <IntlMessages id="CONVERSATION_FILTERS.BUTTONS.ADD_FILTERS" />
                        </Button>
                      </Colxx>
                    </Row>
                  </>
                )}
              </FieldArray>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => cleanUpAndCloseModal()}>
                <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.CANCEL" />
              </Button>
              <Button type="submit" color="primary" disabled={!form.isValid}>
                <IntlMessages id="CONTACTS_PAGE.FILTERS_OPTIONS.SUBMIT" />
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({
  inboxApp,
  labelsApp,
  teamsApp,
  agentsApp,
  campaignsApp,
  settingsChannels,
}) => {
  const { labels } = labelsApp;
  const {
    inboxes,
    conversationFilters,
    successAppliedFilters,
    errorAppliedFilters,
  } = inboxApp;
  const { teams } = teamsApp;
  const { agents } = agentsApp;
  const { campaigns } = campaignsApp;
  const { countryList } = settingsChannels;
  return {
    labels,
    inboxes,
    teams,
    agents,
    campaigns,
    countryList,
    conversationFilters,
    successAppliedFilters,
    errorAppliedFilters,
  };
};

export default connect(mapStateToProps, {
  getConversationFiltersActions: getConversationFilters,
  advancedFiltersConversationFiltersAction: applyAdvancedConversationFilters,
  applyAdvancedFiltersCleanUp: applyAdvancedConversationFiltersCleanUp,
  messageCleanAction: messageClean,
})(ConversationNestedFilterModal);
