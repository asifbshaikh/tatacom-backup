import { Colxx } from 'components/common/CustomBootstrap';
import {
  CleanFieldValuesProvider,
  getUserPropertyFieldList,
} from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import { FieldArray } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Row } from 'reactstrap';
import {
  getuserAttributesBasedOnUserEvents,
  getuserEventsList,
} from 'redux/segmentation/actions';
import EventTriggerMessageFields from './EventTriggerMessageFields';
import EventTriggerFieldArray from './EventTriggerFieldArray';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';

const EventTriggerCriteria = ({
  form,
  triggerRootIdentifier,
  triggerFilterIdentifier,
  getUserEventsDropDownList,
  userEventsList,
  flowMsg,
  flowExit,
}) => {
  useEffect(() => {
    getUserEventsDropDownList();
  }, []);

  const { values, setFieldValue } = form;

  const cleanFieldValues = (fieldIdentifier, fieldType) => {
    const filedArrayList = getUserPropertyFieldList(fieldType);
    if (filedArrayList.length > 0) {
      filedArrayList.forEach((list) => {
        form.setFieldValue(`${fieldIdentifier}.${list}`, '');
      });
    }
  };

  const handleAddFilterClick = () => {
    const arr = [
      ...values[triggerRootIdentifier][triggerFilterIdentifier].filters[0]
        .filters,
    ];
    arr.push({
      filter_type: createSegementEnums.CONDITION.USER_BEHAVIOR,
      executed: '',
      name: '',
      attributes: {
        filter_operator: createSegementEnums.INITIALVALUES.AND,
        filters: [],
      },
    });

    setFieldValue(
      `${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.0.filters`,
      arr
    );
  };
  const getErrorMessageOfField = (
    errorFilterObject,
    touchedFilteredObject,
    fieldName
  ) => {
    return (
      errorFilterObject?.[fieldName] &&
      touchedFilteredObject?.[fieldName] && (
        <div className="invalid-feedback d-block">
          {errorFilterObject?.[fieldName].includes(
            createSegementEnums.LABEL.DATE_SHOULD_BE_GREATER
          ) ? (
            <IntlMessages id="CREATE_SEGMENT.THIS_FIELD_SHOULD_BE_GREATER_THAN_PREVIOUS_FILED" />
          ) : (
            <IntlMessages id="CREATE_SEGMENT.THIS_FIELD_IS_REQUIRED" />
          )}
        </div>
      )
    );
  };

  const handleResetFilters = () => {
    form.setFieldValue('triggerCriteria', {
      included_filters: {
        filter_operator: createSegementEnums.CONDITION.AND,
        filters: [
          {
            filter_operator: createSegementEnums.CONDITION.AND,
            filters: [
              {
                filter_type: createSegementEnums.CONDITION.USER_BEHAVIOR,
                executed: createSegementEnums.CONDITION.TRUE,
                name: '',
                operator: TargetAudienceEnums.AT_LEAST,
                value: TargetAudienceEnums.TIME_VALUE,
                attributes: {
                  filter_operator: createSegementEnums.CONDITION.AND,
                  filters: [],
                },
              },
            ],
          },
        ],
      },
      trigger_relation: TargetAudienceEnums.AFTER,
      trigger_attr: TargetAudienceEnums.IF_ACTION,
      time_value: TargetAudienceEnums.TIME_VALUE,
      time_multiplier: TargetAudienceEnums.TIME_MULTIPLIER,
      trigger_message_type: TargetAudienceEnums.IMMEDIATELY,
    });
    form.setTouched({}, false, true);
  };

  return (
    <CleanFieldValuesProvider.Provider
      value={{ cleanFieldValues, getErrorMessageOfField }}
    >
      <div className="pl-4 pr-4 mt-2 mb-3 pb-3">
        <Row>
          {!flowExit && (
            <>
              <Colxx xxs="12">
                <br />

                <h4 className="font-weight-bold">
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.TRIGGER_CRITERIA" />
                </h4>
              </Colxx>
              <Colxx xxs="12" md="10">
                <p>If Audience</p>
              </Colxx>
            </>
          )}

          {flowExit && (
            <Colxx xxs="12" md="10">
              <p>When Audience</p>
            </Colxx>
          )}

          <Colxx xxs="2" className="text-right">
            <Button
              className="filter-by-list-close mr-2 mt-0 bg-transparent border-0 p-0"
              onClick={handleResetFilters}
              data-testid="resetBtn"
            >
              <IntlMessages id="CREATE_SEGMENT.BUTTONS.RESET_FILTER" />
            </Button>
          </Colxx>
        </Row>

        <FieldArray>
          {() => {
            return (
              values[triggerRootIdentifier][triggerFilterIdentifier].filters
                .length > 0 &&
              values[triggerRootIdentifier][
                triggerFilterIdentifier
              ].filters.map((triggerFilter, index) => {
                return (
                  <div
                    className="p-3"
                    style={{ background: 'white' }}
                    key={`${triggerFilter}_${index.toString()}`}
                  >
                    {values[triggerRootIdentifier][triggerFilterIdentifier]
                      .filters[index].filters.length > 0 &&
                      values[triggerRootIdentifier][
                        triggerFilterIdentifier
                      ].filters[index].filters.map(
                        (nestedCriteria, nestedIndex) => {
                          return (
                            <div
                              key={`${nestedCriteria}_${nestedIndex.toString()}`}
                            >
                              <EventTriggerFieldArray
                                index={index}
                                form={form}
                                nestedIndex={nestedIndex}
                                userEventsList={userEventsList}
                                triggerRootIdentifier={triggerRootIdentifier}
                                triggerFilterIdentifier={
                                  triggerFilterIdentifier
                                }
                                nestedCriteria={nestedCriteria}
                                filterFormErrors={
                                  form.errors[triggerRootIdentifier]?.[
                                    triggerFilterIdentifier
                                  ]?.filters?.[index]?.filters?.[nestedIndex]
                                }
                                filterFormTouched={
                                  form.touched[triggerRootIdentifier]?.[
                                    triggerFilterIdentifier
                                  ]?.filters?.[index]?.filters?.[nestedIndex]
                                }
                                flowExit={flowExit}
                              />

                              {values[triggerRootIdentifier][
                                triggerFilterIdentifier
                              ].filters[index].filters[nestedIndex + 1] && (
                                <Row className="mt-3 mb-3">
                                  <Colxx xxs="12">
                                    <h2 className="font-weight-bold mb-0">
                                      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.CONDITION" />
                                    </h2>
                                  </Colxx>
                                </Row>
                              )}
                            </div>
                          );
                        }
                      )}
                  </div>
                );
              })
            );
          }}
        </FieldArray>
        <Row>
          <Colxx xxs="12" className="mt-3">
            <Button
              type="button"
              color="primary"
              onClick={handleAddFilterClick}
            >
              <IntlMessages id="CREATE_SEGMENT.BUTTONS.ADD_FILTER" />
            </Button>
          </Colxx>
        </Row>
      </div>

      <EventTriggerMessageFields
        form={form}
        filterFormErrors={form.errors[triggerRootIdentifier]}
        triggerRootIdentifier={triggerRootIdentifier}
        filterFormTouched={form.touched[triggerRootIdentifier]}
        flowMsg={flowMsg}
      />
    </CleanFieldValuesProvider.Provider>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { userEventsList } = segmentationApp;
  return {
    userEventsList,
  };
};

export default connect(mapStateToProps, {
  getUserEventsDropDownList: getuserEventsList,
  getUserAttributesDropDownList: getuserAttributesBasedOnUserEvents,
})(EventTriggerCriteria);
