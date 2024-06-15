import { Colxx } from 'components/common/CustomBootstrap';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import IntlMessages from 'helpers/IntlMessages';
import React, { useContext, useEffect } from 'react';
import { Button, Card, Row } from 'reactstrap';
import useAttributeList from './useAttributeList';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { userBehaviorFilterOptions } from 'data/createCampaignData';
import GroupedOptionsSelect from 'components/create-segment/GroupedOptionsSelect';
import FilterAttributesFieldArray from 'components/create-segment/FilterAttributesFieldArray';
import { UncontrolledTooltip } from 'reactstrap/lib';
import {
  CleanFieldValuesProvider,
  userBehaviourOperatorList,
} from 'data/segments/createSegmentFilterData';

const EventTriggerFieldArray = ({
  form,
  userEventsList,
  triggerRootIdentifier,
  triggerFilterIdentifier,
  index,
  nestedIndex,
  nestedCriteria,
  filterFormErrors,
  filterFormTouched,
  flowExit,
}) => {
  const { values, setFieldValue } = form;
  const { attributeList, getUserAttributes } = useAttributeList();
  const { getErrorMessageOfField } = useContext(CleanFieldValuesProvider);

  useEffect(() => {
    if (
      values[triggerRootIdentifier][triggerFilterIdentifier].filters[index]
        .filters[nestedIndex].name
    ) {
      const userEvent = userEventsList.find((item) => {
        return (
          item.name ===
          values[triggerRootIdentifier][triggerFilterIdentifier].filters[index]
            .filters[nestedIndex].name
        );
      });
      if (userEvent) {
        getUserAttributes(userEvent.id);
      }
    }
  }, []);

  const handleOnNameChange = (option, index, nestedIndex) => {
    const userEvent = userEventsList.find((item) => {
      return item.name === option.value;
    });
    if (userEvent) {
      getUserAttributes(userEvent.id);
    }
    setFieldValue(
      `${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}.name`,
      option.value
    );
    setFieldValue(
      `${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}.category`,
      option.category
    );
    setFieldValue(
      `${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}.attributes`,
      {
        filter_operator: createSegementEnums.INITIALVALUES.AND,
        filters: [],
      }
    );
  };

  const handleOnNestedFilterCloseBtn = () => {
    const arr = [
      ...values[triggerRootIdentifier][triggerFilterIdentifier].filters,
    ];
    arr[index].filters.splice(nestedIndex, 1);
    setFieldValue(
      `${triggerRootIdentifier}.${triggerFilterIdentifier}.filters`,
      arr
    );
  };

  return (
    <Card key={`${nestedCriteria}_${nestedIndex.toString()}`} className="p-4">
      <Row>
        <Colxx xxs="12" md="2">
          {nestedIndex === 0 ? (
            <FormGroupCoustom
              disabled={true}
              type="text"
              noLable
              value={
                flowExit
                  ? createSegementEnums.CONDITION.HAS_EXITED
                  : createSegementEnums.CONDITION.HAS_EXECUTED
              }
              identifier={`${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}.executed`}
              identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.USER_PROPERTY_EXECUTED"
            />
          ) : (
            <FormGroupCoustom
              dataTestId="executedDropdown"
              type="select"
              noLable
              identifier={`${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}.executed`}
              identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.USER_PROPERTY_EXECUTED"
              options={userBehaviorFilterOptions}
            />
          )}

          {getErrorMessageOfField(
            filterFormErrors,
            filterFormTouched,
            'executed'
          )}
        </Colxx>
        <Colxx xxs="12" md="2">
          <GroupedOptionsSelect
            ariaLabel="eventTriggerCriteriaField"
            data={userEventsList}
            form={form}
            groupedOptionsValue={
              values[triggerRootIdentifier][triggerFilterIdentifier].filters[
                index
              ].filters[nestedIndex]
            }
            optionIdentifier={{
              label: createSegementEnums.IDENTIFIERS.DISPLAYED_NAME,
              value: createSegementEnums.IDENTIFIERS.NAME,
            }}
            handleOnChangeDropDown={(option) =>
              handleOnNameChange(option, index, nestedIndex)
            }
            handleOnBlur={() =>
              form.setFieldTouched(
                `${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}.name`,
                true,
                true
              )
            }
          />
          {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'name')}
        </Colxx>
        {nestedIndex !== 0 &&
          values[triggerRootIdentifier][triggerFilterIdentifier].filters[
            index
          ].filters[nestedIndex].executed?.toString() ===
            createSegementEnums.CONDITION.TRUE && (
            <>
              <Colxx xxs="12" md="2">
                <FormGroupCoustom
                  type="select"
                  noLable
                  identifier={`${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}.operator`}
                  options={userBehaviourOperatorList}
                />
                {getErrorMessageOfField(
                  filterFormErrors,
                  filterFormTouched,
                  'operator'
                )}
              </Colxx>
              <Colxx xxs="12" md="2">
                <FormGroupCoustom
                  disabled={nestedIndex === 0}
                  type="number"
                  noLable
                  identifier={`${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}.value`}
                />
                {getErrorMessageOfField(
                  filterFormErrors,
                  filterFormTouched,
                  'value'
                )}
              </Colxx>
              <Colxx xxs="12" md="3">
                <span>Times</span>
              </Colxx>
            </>
          )}
        {nestedIndex !== 0 &&
          values[triggerRootIdentifier][triggerFilterIdentifier].filters[
            index
          ].filters[nestedIndex].executed?.toString() !==
            createSegementEnums.CONDITION.TRUE && <Colxx xxs="7" />}
        {nestedIndex !== 0 && (
          <Colxx className="float-right" md="1">
            <Button
              id={`button_${index}_${nestedIndex}`}
              type="button"
              className="close filter-by-list-close mt-0"
              style={{ color: 'red' }}
              onClick={handleOnNestedFilterCloseBtn}
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
      <Row>
        <Colxx xxs="12">
          <FilterAttributesFieldArray
            ConditionLabel={
              flowExit
                ? 'DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.FROM_EXIT'
                : 'CREATE_SEGMENT.FILTER_BY'
            }
            form={form}
            userAttributesList={attributeList}
            filterAttributeIdentifier={`${triggerRootIdentifier}.${triggerFilterIdentifier}.filters.${index}.filters.${nestedIndex}`}
            filterAttributeValue={nestedCriteria}
            isWithAttribute
            attributeIdentifier={createSegementEnums.IDENTIFIERS.ATTRIBUTES}
            dropDownType={createSegementEnums.IDENTIFIERS.UN_GROUPED}
            filterFormErrors={filterFormErrors}
            filterFormTouched={filterFormTouched}
            flowExit={flowExit}
          />
        </Colxx>
      </Row>
    </Card>
  );
};

export default EventTriggerFieldArray;
