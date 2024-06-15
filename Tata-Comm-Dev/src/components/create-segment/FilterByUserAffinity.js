import React, { useContext } from 'react';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { getuserAttributesBasedOnUserEvents } from 'redux/segmentation/actions';
import { connect } from 'react-redux';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import {
  CleanFieldValuesProvider,
  mostAndLeastNoOfTimes,
  predominantlyAndForMinOf,
  userAffinityWithSelectAttr,
} from 'data/segments/createSegmentFilterData';
import GroupedOptionsSelect from './GroupedOptionsSelect';
import DurationFilterCriteria from './DurationFilterCriteria';
import FilterAttributesFieldArray from './FilterAttributesFieldArray';

const FilterByUserAffinity = ({
  userEventsList,
  getUserAttributesDropDownList,
  userAttributesList,
  form,
  userAffinityIdentifier,
  filterUserAffinityValues,
  filterFormErrors,
  filterFormTouched,
}) => {
  const { getErrorMessageOfField } = useContext(CleanFieldValuesProvider);

  const handleOnNameChange = (option) => {
    form.setFieldValue(
      `${userAffinityIdentifier}.operator_type`,
      'predominantly'
    );
    form.setFieldValue(`${userAffinityIdentifier}.attributes`, {
      filter_operator: createSegementEnums.INITIALVALUES.AND,
      filters: [],
    });
    form.setFieldValue(`${userAffinityIdentifier}.user_affinity_attributes`, {
      filter_operator: createSegementEnums.INITIALVALUES.AND,
      filters: [
        {
          name: '',
          filter_type:
            createSegementEnums.INITIALVALUES.USER_AFFINITY_ATTRIBUTES,
        },
      ],
    });
    form.setFieldValue(`${userAffinityIdentifier}.name`, option.value);
    form.setFieldValue(`${userAffinityIdentifier}.category`, option.category);
    const userEvent = userEventsList.find((item) => {
      return item.name === option.value;
    });
    if (userEvent) {
      getUserAttributesDropDownList(userEvent.id);
    }
  };

  const handleOnOperatorTypeChange = (event) => {
    form.setFieldValue(
      `${userAffinityIdentifier}.operator_type`,
      event.target.value
    );
    form.setFieldValue(`${userAffinityIdentifier}.value`, '');
    if (mostAndLeastNoOfTimes.includes(event.target.value)) {
      form.setFieldValue(`${userAffinityIdentifier}.user_affinity_attributes`, {
        filter_operator: createSegementEnums.INITIALVALUES.AND,
        filters: [],
      });
    } else {
      form.setFieldValue(`${userAffinityIdentifier}.user_affinity_attributes`, {
        filter_operator: createSegementEnums.INITIALVALUES.AND,
        filters: [
          {
            name: '',
            filter_type:
              createSegementEnums.INITIALVALUES.USER_AFFINITY_ATTRIBUTES,
          },
        ],
      });
    }
  };
  return (
    <>
      <Row className="align-items-center pl-3 pr-3">
        <div>
          <IntlMessages id="CREATE_SEGMENT.HAS_EXECUTED" />
        </div>
        <Colxx xxs="12" md="3">
          <GroupedOptionsSelect
            ariaLabel="userAffinityNameField"
            data={userEventsList}
            form={form}
            groupedOptionsValue={filterUserAffinityValues}
            optionIdentifier={{
              label: createSegementEnums.IDENTIFIERS.DISPLAYED_NAME,
              value: createSegementEnums.IDENTIFIERS.NAME,
            }}
            handleOnChangeDropDown={handleOnNameChange}
            handleOnBlur={() =>
              form.setFieldTouched(
                `${userAffinityIdentifier}.name`,
                true,
                false
              )
            }
            handleOnFocus={() =>
              form.setFieldTouched(
                `${userAffinityIdentifier}.name`,
                false,
                false
              )
            }
          />
          {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'name')}
        </Colxx>
      </Row>

      {filterUserAffinityValues.name && (
        <>
          <Row className="align-items-start mt-4">
            <Colxx xxs="12" md="2">
              <FormGroupCoustom
                type="select"
                noLable
                identifier={`${userAffinityIdentifier}.operator_type`}
                options={userAffinityWithSelectAttr}
                value={filterUserAffinityValues.operator_type}
                onChange={handleOnOperatorTypeChange}
                dataTestId="operatorSelect"
              />
              {getErrorMessageOfField(
                filterFormErrors,
                filterFormTouched,
                'operator_type'
              )}
            </Colxx>

            {predominantlyAndForMinOf.includes(
              filterUserAffinityValues.operator_type
            ) && (
              <>
                {filterUserAffinityValues.operator_type ===
                  createSegementEnums.CONDITION.FOR_MIN_OF && (
                  <>
                    <Colxx xxs="12" md="2">
                      <FormGroupCoustom
                        identifier={`${userAffinityIdentifier}.value`}
                        type="number"
                        noLable
                      />
                      {getErrorMessageOfField(
                        filterFormErrors,
                        filterFormTouched,
                        'value'
                      )}
                    </Colxx>
                    <Colxx xxs="12" md="1">
                      <div className="label-parent">
                        <IntlMessages id="CREATE_SEGMENT.PERCENT_OF_TIMES" />
                      </div>
                    </Colxx>
                  </>
                )}

                <Colxx
                  className="user-affinity-with-attr"
                  xxs="12"
                  md={
                    filterUserAffinityValues.operator_type ===
                    createSegementEnums.CONDITION.FOR_MIN_OF
                      ? '7'
                      : '10'
                  }
                >
                  <FilterAttributesFieldArray
                    ConditionLabel="CREATE_SEGMENT.WITH"
                    form={form}
                    userAttributesList={userAttributesList}
                    filterAttributeIdentifier={userAffinityIdentifier}
                    filterAttributeValue={filterUserAffinityValues}
                    isWithAttribute={false}
                    attributeIdentifier={
                      createSegementEnums.INITIALVALUES.USER_AFFINITY_ATTRIBUTES
                    }
                    dropDownType={createSegementEnums.IDENTIFIERS.GROUPED}
                    filterFormErrors={filterFormErrors}
                    filterFormTouched={filterFormTouched}
                  />
                </Colxx>
              </>
            )}

            {mostAndLeastNoOfTimes.includes(
              filterUserAffinityValues.operator_type
            ) && (
              <>
                {filterUserAffinityValues.operator_type ===
                createSegementEnums.CONDITION.MOST_OF_TIMES ? (
                  <div className="ml-3">
                    <div className="label-parent">
                      <IntlMessages id="CREATE_SEGMENT.FILTER_TOP" />
                    </div>
                  </div>
                ) : (
                  <div className="ml-3">
                    <div className="label-parent">
                      <IntlMessages id="CREATE_SEGMENT.FILTER_BOTTOM" />
                    </div>
                  </div>
                )}

                <Colxx xxs="12" md="2">
                  <FormGroupCoustom
                    identifier={`${userAffinityIdentifier}.value`}
                    type="number"
                    noLable
                  />
                  {getErrorMessageOfField(
                    filterFormErrors,
                    filterFormTouched,
                    'value'
                  )}
                </Colxx>
                <div className="ml-3">
                  <div className="label-parent">
                    <IntlMessages id="CREATE_SEGMENT.OF_THE_USER" />
                  </div>
                </div>
              </>
            )}
          </Row>

          <Row className="align-items-center mt-4">
            <DurationFilterCriteria
              form={form}
              durationFilterCriteriaValues={filterUserAffinityValues}
              durationFilterCriteriaIdentifier={userAffinityIdentifier}
              durationFilterIdentifier={
                createSegementEnums.IDENTIFIERS.PRIMARY_TIME_RANGE
              }
              filterType={createSegementEnums.CONDITION.USER_AFFINITY_COND}
              filterFormErrors={filterFormErrors}
              filterFormTouched={filterFormTouched}
            />
          </Row>
        </>
      )}

      {filterUserAffinityValues.name && (
        <Row>
          <Colxx xxs="12">
            <FilterAttributesFieldArray
              ConditionLabel="CREATE_SEGMENT.WITH_ATTRIBUTE"
              form={form}
              userAttributesList={userAttributesList}
              filterAttributeIdentifier={userAffinityIdentifier}
              filterAttributeValue={filterUserAffinityValues}
              isWithAttribute
              attributeIdentifier={createSegementEnums.IDENTIFIERS.ATTRIBUTES}
              dropDownType={createSegementEnums.IDENTIFIERS.UN_GROUPED}
              isFilterTypeDropDown
              filterFormErrors={filterFormErrors}
              filterFormTouched={filterFormTouched}
            />
          </Colxx>
        </Row>
      )}
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
})(FilterByUserAffinity);
