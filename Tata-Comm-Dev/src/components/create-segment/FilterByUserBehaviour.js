import React, { useContext } from 'react';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { userBehaviorFilterOptions } from 'data/createCampaignData';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { getuserAttributesBasedOnUserEvents } from 'redux/segmentation/actions';
import { connect } from 'react-redux';
import IntlMessages from 'helpers/IntlMessages';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import {
  userBehaviourOperatorList,
  CleanFieldValuesProvider,
} from 'data/segments/createSegmentFilterData';
import GroupedOptionsSelect from './GroupedOptionsSelect';
import FilterAttributesFieldArray from './FilterAttributesFieldArray';
import DurationFilterCriteria from './DurationFilterCriteria';

const FilterByUserBehaviour = ({
  userEventsList,
  getUserAttributesDropDownList,
  userAttributesList,
  form,
  userBehaviorIdentifier,
  filterUserBehaviourValues,
  filterFormErrors,
  filterFormTouched,
}) => {
  const { getErrorMessageOfField } = useContext(CleanFieldValuesProvider);

  const handleOnNameChange = (option) => {
    const userEvent = userEventsList.find((item) => {
      return item.name === option.value;
    });
    if (userEvent) {
      getUserAttributesDropDownList(userEvent.id);
    }
    form.setFieldValue(`${userBehaviorIdentifier}.attributes`, {
      filter_operator: createSegementEnums.INITIALVALUES.AND,
      filters: [],
    });

    form.setFieldValue(`${userBehaviorIdentifier}.name`, option.value);
    form.setFieldValue(`${userBehaviorIdentifier}.category`, option.category);
  };

  const handleOnExcecutedChange = (event) => {
    form.setFieldValue(
      `${userBehaviorIdentifier}.executed`,
      event.target.value
    );
    form.setFieldValue(`${userBehaviorIdentifier}.operator`, '');
    form.setFieldValue(`${userBehaviorIdentifier}.value`, '');
  };

  return (
    <>
      <Row>
        <Colxx xxs="12" md="2">
          <FormGroupCoustom
            dataTestId="userBehaviorExecuted"
            type="select"
            noLable
            identifier={`${userBehaviorIdentifier}.executed`}
            options={userBehaviorFilterOptions}
            onChange={handleOnExcecutedChange}
            value={filterUserBehaviourValues.executed}
            onBlur={() => {
              form.setFieldTouched(
                `${userBehaviorIdentifier}.executed`,
                true,
                true
              );
            }}
            onFocus={() => {
              form.setFieldTouched(
                `${userBehaviorIdentifier}.executed`,
                false,
                true
              );
            }}
          />
          {getErrorMessageOfField(
            filterFormErrors,
            filterFormTouched,
            'executed'
          )}
        </Colxx>
        <Colxx xxs="12" md="2">
          <GroupedOptionsSelect
            ariaLabel="userBehaviourNameField"
            data={userEventsList}
            form={form}
            groupedOptionsValue={filterUserBehaviourValues}
            optionIdentifier={{
              label: createSegementEnums.IDENTIFIERS.DISPLAYED_NAME,
              value: createSegementEnums.IDENTIFIERS.NAME,
            }}
            handleOnChangeDropDown={handleOnNameChange}
            handleOnBlur={() =>
              form.setFieldTouched(`${userBehaviorIdentifier}.name`, true, true)
            }
            handleOnFocus={() =>
              form.setFieldTouched(
                `${userBehaviorIdentifier}.name`,
                false,
                true
              )
            }
          />
          {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'name')}
        </Colxx>
        {filterUserBehaviourValues.name &&
          filterUserBehaviourValues.executed?.toString() ===
            createSegementEnums.CONDITION.TRUE && (
            <>
              <Colxx xxs="12" md="2">
                <FormGroupCoustom
                  type="select"
                  noLable
                  identifier={`${userBehaviorIdentifier}.operator`}
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
                  noLable
                  identifier={`${userBehaviorIdentifier}.value`}
                />
                {getErrorMessageOfField(
                  filterFormErrors,
                  filterFormTouched,
                  'value'
                )}
              </Colxx>
              <Colxx xxs="12" md="1">
                <div className="label-parent">
                  <IntlMessages id="CREATE_SEGMENT.TIMES" />
                </div>
              </Colxx>
            </>
          )}
      </Row>

      {filterUserBehaviourValues.name && (
        <Row className="align-items-center mt-4">
          <DurationFilterCriteria
            form={form}
            durationFilterCriteriaValues={filterUserBehaviourValues}
            durationFilterCriteriaIdentifier={userBehaviorIdentifier}
            durationFilterIdentifier={
              createSegementEnums.IDENTIFIERS.PRIMARY_TIME_RANGE
            }
            filterType={createSegementEnums.CONDITION.USER_BEHAVIOR_COND}
            filterFormErrors={filterFormErrors}
            filterFormTouched={filterFormTouched}
          />
        </Row>
      )}

      <Row>
        {filterUserBehaviourValues.name && (
          <Colxx xxs="12" md="12">
            <FilterAttributesFieldArray
              ConditionLabel="CREATE_SEGMENT.WITH_ATTRIBUTE"
              form={form}
              isFilterTypeDropDown
              isWithAttribute
              userAttributesList={userAttributesList}
              filterAttributeIdentifier={userBehaviorIdentifier}
              filterAttributeValue={filterUserBehaviourValues}
              attributeIdentifier={createSegementEnums.IDENTIFIERS.ATTRIBUTES}
              dropDownType={createSegementEnums.IDENTIFIERS.UN_GROUPED}
              filterFormErrors={filterFormErrors}
              filterFormTouched={filterFormTouched}
            />
          </Colxx>
        )}
      </Row>
    </>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { userAttributesBasedOnUserEventsList } = segmentationApp;
  return {
    userAttributesList: userAttributesBasedOnUserEventsList,
  };
};

export default connect(mapStateToProps, {
  getUserAttributesDropDownList: getuserAttributesBasedOnUserEvents,
})(FilterByUserBehaviour);
