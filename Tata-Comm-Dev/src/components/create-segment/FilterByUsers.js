import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import {
  Button,
  ButtonGroup,
  Card,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import { connect } from 'react-redux';
import { getCategoryDropdownList } from 'redux/actions';
import '../../assets/css/sass/views/campaign.scss';
import {
  getCampaignChannelAndTypeList,
  getuserEventsList,
} from 'redux/segmentation/actions';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import {
  getInitialValuesOfFilterType,
  getAccordionHeaderTitleForFilter,
} from 'data/segments/createSegmentFilterData';
import CustomSegment from './CustomSegment';
import FilterByUserBehaviour from './FilterByUserBehaviour';
import FilterByUsersProperty from './FilterByUsersProperty';
import FilterByUserAffinity from './FilterByUserAffinity';
import CreateEventPopOver from 'views/app/segments/create-segment/widgets/CreateEventPopOver';
import CreateCampaignAccordion from 'containers/campaigns/CreateCampaignAccordion';
import {
  filterByUsersButtonLists,
  filterConditionOptions,
} from 'data/createCampaignData';

const FilterByUsers = ({
  form,
  filterIdentifier,
  filterRootIdentifier,
  getUserEventsDropDownList,
  userEventsList,
  getCampaignChannelAndTypeListAction,
}) => {
  const { values, setFieldValue } = form;
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  useEffect(() => {
    getUserEventsDropDownList();
    getCampaignChannelAndTypeListAction();
  }, []);

  const handleNestedFilterBtnClick = (index) => {
    const condition =
      values[filterRootIdentifier].filter_operator ===
      createSegementEnums.CONDITION.AND
        ? createSegementEnums.CONDITION.OR
        : createSegementEnums.CONDITION.AND;
    setFieldValue(
      `${filterRootIdentifier}.${filterIdentifier}.${index}.filters`,
      [
        ...values[filterRootIdentifier][filterIdentifier][index].filters,
        { filter_type: '' },
      ]
    );
    setFieldValue(
      `${filterRootIdentifier}.${filterIdentifier}.${index}.filter_type`,
      'nested_filters'
    );
    setFieldValue(
      `${filterRootIdentifier}.${filterIdentifier}.${index}.filter_operator`,
      condition
    );
  };

  const handleOnNestedFilterCloseBtn = (filterIndex, nestedFilterIndex) => {
    const arr = [...values[filterRootIdentifier][filterIdentifier]];
    arr[filterIndex].filters.splice(nestedFilterIndex, 1);
    setFieldValue(filterIdentifier, arr);
  };

  const handleOnFilterCloseBtn = (filterIndex) => {
    const arr = [...values[filterRootIdentifier][filterIdentifier]];
    arr.splice(filterIndex, 1);
    setFieldValue(`${filterRootIdentifier}.${filterIdentifier}`, arr);
  };

  const setFilterOperator = (value) => {
    values[filterRootIdentifier][filterIdentifier].forEach((item, index) => {
      if (item) {
        form.setFieldValue(
          `${filterRootIdentifier}.${filterIdentifier}.${index}.filter_operator`,
          value
        );
      }
    });
  };

  const handleOnChangeNestedFilterChangeCondition = (event) => {
    if (event.target.value === createSegementEnums.CONDITION.AND) {
      setFilterOperator(event.target.value);
      form.setFieldValue(
        `${filterRootIdentifier}.filter_operator`,
        createSegementEnums.INITIALVALUES.OR
      );
    } else {
      setFilterOperator(event.target.value);
      form.setFieldValue(
        `${filterRootIdentifier}.filter_operator`,
        createSegementEnums.INITIALVALUES.AND
      );
    }
  };

  const handleOnChangeFilterChangeCondition = (event) => {
    if (event.target.value === createSegementEnums.CONDITION.AND) {
      form.setFieldValue(
        `${filterRootIdentifier}.filter_operator`,
        event.target.value
      );
      setFilterOperator(createSegementEnums.INITIALVALUES.OR);
    } else {
      form.setFieldValue(
        `${filterRootIdentifier}.filter_operator`,
        event.target.value
      );
      setFilterOperator(createSegementEnums.INITIALVALUES.AND);
    }
  };

  const handleOnFilterBtnClick = () => {
    const arr = [...values[filterRootIdentifier][filterIdentifier]];
    const condition =
      values[filterRootIdentifier].filter_operator ===
      createSegementEnums.CONDITION.AND
        ? createSegementEnums.CONDITION.OR
        : createSegementEnums.CONDITION.AND;
    arr.push({
      filters: [
        { filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS },
      ],
      filter_operator: condition,
    });

    setFieldValue(`${filterRootIdentifier}.${filterIdentifier}`, arr);
  };

  const handleCreateEvent = () => {
    setShowCreateEvent(true);
  };

  const handleOnFilterTypeBtnClick = (event, index, nestedIndex) => {
    const initialObject = getInitialValuesOfFilterType(event.target.value);
    if (Object.keys(initialObject).length > 0) {
      setFieldValue(
        `${filterRootIdentifier}.${filterIdentifier}.${index}.filters.${nestedIndex}`,
        initialObject
      );
      form.setTouched({}, false, true);
    } else {
      setFieldValue(
        `${filterRootIdentifier}.${filterIdentifier}.${index}.filters.${nestedIndex}.filter_type`,
        ''
      );
    }
  };

  return (
    <>
      <FieldArray name={filterIdentifier} className="filter-by-users">
        {() =>
          values[filterRootIdentifier][filterIdentifier].length > 0 &&
          values[filterRootIdentifier][filterIdentifier].map(
            (filterUser, index) => {
              return (
                <div key={`${filterUser.filter_type}_${index.toString()}}`}>
                  <Card
                    key={`${filterUser.filter_type}_${index.toString()}}`}
                    className="pb-3 segmentation-filter"
                  >
                    {values[filterRootIdentifier][filterIdentifier].length >
                      1 && (
                      <div>
                        <Button
                          id={`button_${index}`}
                          type="button"
                          className="close filter-by-list-close mt-0 pt-1 mr-2"
                          onClick={() => handleOnFilterCloseBtn(index)}
                        >
                          x
                        </Button>
                        <UncontrolledTooltip
                          placement="left"
                          target={`button_${index}`}
                          popperClassName="border-1"
                        >
                          <small>
                            <IntlMessages id="CREATE_SEGMENT.DELETE_RULE_SET" />
                          </small>
                        </UncontrolledTooltip>
                      </div>
                    )}
                    {filterUser.filters.length > 0 &&
                      filterUser.filters.map((nestedFilter, nestedIndex) => {
                        return (
                          <div
                            key={`${nestedFilter}_${nestedIndex.toString()}`}
                          >
                            <CreateCampaignAccordion
                              heading={getAccordionHeaderTitleForFilter(
                                nestedFilter
                              )}
                            >
                              <Row
                                key={`${nestedFilter}_${nestedIndex.toString()}`}
                              >
                                <Colxx xxs="11" md="11" lg="11">
                                  <ButtonGroup className="mb-4 mt-3">
                                    {filterByUsersButtonLists.map(
                                      (buttonList) => {
                                        return (
                                          <Button
                                            color="primary"
                                            key={buttonList.label}
                                            outline
                                            active={
                                              values[filterRootIdentifier][
                                                filterIdentifier
                                              ][index].filters[nestedIndex]
                                                .filter_type ===
                                              buttonList.value
                                            }
                                            onClick={(event) => {
                                              handleOnFilterTypeBtnClick(
                                                event,
                                                index,
                                                nestedIndex
                                              );
                                            }}
                                            type="button"
                                            value={buttonList.value}
                                          >
                                            {buttonList.label}
                                          </Button>
                                        );
                                      }
                                    )}
                                  </ButtonGroup>
                                </Colxx>
                                {values[filterRootIdentifier][filterIdentifier][
                                  index
                                ].filters.length > 1 && (
                                  <Colxx xxs="1" md="1" lg="1">
                                    <Button
                                      id={`button_${index}_${nestedIndex}`}
                                      type="button"
                                      className="close filter-by-list-close"
                                      style={{ color: 'red' }}
                                      onClick={() =>
                                        handleOnNestedFilterCloseBtn(
                                          index,
                                          nestedIndex
                                        )
                                      }
                                    >
                                      x
                                    </Button>
                                    <UncontrolledTooltip
                                      placement="left"
                                      target={`button_${index}_${nestedIndex}`}
                                    >
                                      <small>
                                        <IntlMessages id="CREATE_SEGMENT.DELETE_RULE" />
                                      </small>
                                    </UncontrolledTooltip>
                                  </Colxx>
                                )}
                              </Row>

                              {values[filterRootIdentifier][filterIdentifier][
                                index
                              ].filters[nestedIndex].filter_type ===
                                createSegementEnums.CONDITION.USER_PROPERTY && (
                                <>
                                  <FilterByUsersProperty
                                    form={form}
                                    filteredUserPropertyValues={
                                      values[filterRootIdentifier][
                                        filterIdentifier
                                      ][index].filters[nestedIndex]
                                    }
                                    identifier={`${filterRootIdentifier}.${filterIdentifier}.${index}.filters.${nestedIndex}`}
                                    filterFormErrors={
                                      form.errors?.[filterRootIdentifier]?.[
                                        filterIdentifier
                                      ]?.[index]?.filters?.[nestedIndex]
                                    }
                                    filterFormTouched={
                                      form.touched?.[filterRootIdentifier]?.[
                                        filterIdentifier
                                      ]?.[index]?.filters?.[nestedIndex]
                                    }
                                  />

                                  <Row className="mt-2">
                                    <Colxx xxs="12" md="12">
                                      <span
                                        className="create-event"
                                        role="button"
                                        onClick={handleCreateEvent}
                                        tabIndex="0"
                                        onKeyDown={() => {}}
                                      >
                                        <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.ADD_EVENT" />
                                      </span>
                                    </Colxx>
                                  </Row>
                                </>
                              )}

                              {values[filterRootIdentifier][filterIdentifier][
                                index
                              ].filters[nestedIndex].filter_type ===
                                createSegementEnums.CONDITION
                                  .CUSTOM_SEGMENT && (
                                <Row className="pl-3 pr-3">
                                  <Colxx xxs="12" md="2" lg="3">
                                    <CustomSegment
                                      form={form}
                                      identifier={`${filterRootIdentifier}.${filterIdentifier}.${index}.filters.${nestedIndex}`}
                                      filterFormErrors={
                                        form.errors?.[filterRootIdentifier]?.[
                                          filterIdentifier
                                        ]?.[index]?.filters?.[nestedIndex]
                                      }
                                      filterFormTouched={
                                        form.touched?.[filterRootIdentifier]?.[
                                          filterIdentifier
                                        ]?.[index]?.filters?.[nestedIndex]
                                      }
                                      selectedCustomSegmentValues={
                                        values[filterRootIdentifier][
                                          filterIdentifier
                                        ][index].filters[nestedIndex]
                                      }
                                    />
                                  </Colxx>
                                </Row>
                              )}

                              {values[filterRootIdentifier][filterIdentifier][
                                index
                              ].filters[nestedIndex].filter_type ===
                                createSegementEnums.CONDITION.USER_BEHAVIOR && (
                                <FilterByUserBehaviour
                                  userEventsList={userEventsList}
                                  form={form}
                                  filterUserBehaviourValues={
                                    values[filterRootIdentifier][
                                      filterIdentifier
                                    ][index].filters[nestedIndex]
                                  }
                                  userBehaviorIdentifier={`${filterRootIdentifier}.${filterIdentifier}.${index}.filters.${nestedIndex}`}
                                  filterFormErrors={
                                    form.errors?.[filterRootIdentifier]?.[
                                      filterIdentifier
                                    ]?.[index]?.filters?.[nestedIndex]
                                  }
                                  filterFormTouched={
                                    form.touched?.[filterRootIdentifier]?.[
                                      filterIdentifier
                                    ]?.[index]?.filters?.[nestedIndex]
                                  }
                                />
                              )}

                              {showCreateEvent && (
                                <CreateEventPopOver
                                  showCreateEvent={showCreateEvent}
                                  setShowCreateEvent={setShowCreateEvent}
                                />
                              )}
                              {values[filterRootIdentifier][filterIdentifier][
                                index
                              ].filters[nestedIndex].filter_type ===
                                createSegementEnums.CONDITION.USER_AFFINITY && (
                                <FilterByUserAffinity
                                  userEventsList={userEventsList}
                                  form={form}
                                  filterUserAffinityValues={
                                    values[filterRootIdentifier][
                                      filterIdentifier
                                    ][index].filters[nestedIndex]
                                  }
                                  userAffinityIdentifier={`${filterRootIdentifier}.${filterIdentifier}.${index}.filters.${nestedIndex}`}
                                  filterFormErrors={
                                    form.errors?.[filterRootIdentifier]?.[
                                      filterIdentifier
                                    ]?.[index]?.filters?.[nestedIndex]
                                  }
                                  filterFormTouched={
                                    form.touched?.[filterRootIdentifier]?.[
                                      filterIdentifier
                                    ]?.[index]?.filters?.[nestedIndex]
                                  }
                                />
                              )}
                            </CreateCampaignAccordion>
                            <Row className="pl-5 pr-5">
                              <Colxx xxs="12" md="1" lg="2">
                                {filterUser.filters[nestedIndex + 1] && (
                                  <FormGroupCoustom
                                    dataTestId="nestedFilterCondition"
                                    identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.SELECT_AUDIENCE_FILTER_CONDITION"
                                    identifier={`${filterRootIdentifier}.${filterIdentifier}.${index}.filter_operator`}
                                    type="select"
                                    options={filterConditionOptions}
                                    className="rounded-3 mt-2"
                                    onChange={
                                      handleOnChangeNestedFilterChangeCondition
                                    }
                                    value={
                                      values[filterRootIdentifier][
                                        filterIdentifier
                                      ][index].filter_operator
                                    }
                                  />
                                )}
                              </Colxx>
                            </Row>
                          </div>
                        );
                      })}
                    <Colxx xxs="12" md="3">
                      <Button onClick={() => handleNestedFilterBtnClick(index)}>
                        <IntlMessages id="CREATE_SEGMENT.BUTTONS.NESTED_FILTER" />
                      </Button>
                    </Colxx>
                  </Card>
                  <Colxx xxs="12" md="2" lg="2" className="m-2 mt-3">
                    {values[filterRootIdentifier][filterIdentifier][
                      index + 1
                    ] && (
                      <FormGroupCoustom
                        dataTestId="filterCondition"
                        identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.SELECT_AUDIENCE_FILTER_CONDITION"
                        identifier={`${filterRootIdentifier}.${filterIdentifier}.filter_operator`}
                        type="select"
                        options={filterConditionOptions}
                        className="rounded-3"
                        onChange={handleOnChangeFilterChangeCondition}
                        value={values[filterRootIdentifier].filter_operator}
                      />
                    )}
                  </Colxx>
                </div>
              );
            }
          )
        }
      </FieldArray>
      <Colxx xxs="12" className="mt-3">
        <Button type="button" color="primary" onClick={handleOnFilterBtnClick}>
          <IntlMessages id="CREATE_SEGMENT.BUTTONS.FILTER" />
        </Button>
      </Colxx>
    </>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { userEventsList } = segmentationApp;
  return {
    userEventsList,
  };
};

export default connect(mapStateToProps, {
  getCategoryDropdownListAction: getCategoryDropdownList,
  getUserEventsDropDownList: getuserEventsList,
  getCampaignChannelAndTypeListAction: getCampaignChannelAndTypeList,
})(injectIntl(FilterByUsers));
