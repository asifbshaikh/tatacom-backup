import {
  getDateInputStringDropDownOptions,
  getlastDropDownforWhereWeeklytheday,
  hideDropDownForDate,
  strigHideInputField,
  CleanFieldValuesProvider,
  getIsBetweenValues,
} from 'data/segments/createSegmentFilterData';
import React, { useContext } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import GroupedOptionsSelect from './GroupedOptionsSelect';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import IntlMessages from 'helpers/IntlMessages';

const WeeklyMonthlyYearlyWhereRangeType = ({
  handleOnValueChange,
  identifier,
  form,
  filteredValueByname,
  filterFormErrors,
  filterFormTouched,
  handleOnCompareOperatorChange,
}) => {
  const { getErrorMessageOfField } = useContext(CleanFieldValuesProvider);
  return (
    <>
      {strigHideInputField.includes(filteredValueByname.operator) ? (
        <Colxx xxs="12" md="2">
          <GroupedOptionsSelect
            data={getDateInputStringDropDownOptions(
              filteredValueByname.range,
              filteredValueByname.operator
            )}
            form={form}
            groupedOptionsValue={filteredValueByname}
            optionIdentifier={{
              label: 'value',
              value: 'id',
            }}
            handleOnBlur={form.setFieldTouched(`${identifier}.value`)}
            handleOnChangeDropDown={handleOnValueChange}
            optionType="unGrouped"
            isCheckboxMultiSelect
            fieldLabel="value"
            ariaLabel="valueSelect"
          />
          {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'value')}
        </Colxx>
      ) : (
        <Colxx xxs="12" md="2">
          <FormGroupCoustom
            noLable
            identifier={`${identifier}.value`}
            type="select"
            options={getDateInputStringDropDownOptions(
              filteredValueByname.range,
              filteredValueByname.operator,
              filteredValueByname.compare_operator
            )}
          />
          {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'value')}
        </Colxx>
      )}
      {hideDropDownForDate.includes(filteredValueByname.operator) && (
        <Colxx xxs="12" md="2">
          <span>
            {filteredValueByname.range ===
            createSegementEnums.CONDITION.YEARLY_WHERE_THE_MONTH ? (
              <IntlMessages id="CREATE_SEGMENT.MONTHS" />
            ) : (
              <IntlMessages id="CREATE_SEGMENT.DAYS" />
            )}
          </span>
        </Colxx>
      )}
      {filteredValueByname.operator ===
        createSegementEnums.CONDITION.IS_BETWEEN && (
        <>
          <Colxx xxs="12" md="1">
            {' '}
            <span>
              <IntlMessages id="CREATE_SEGMENT.USER_AFFINITY.AND" />
            </span>
          </Colxx>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              noLable
              identifier={`${identifier}.value1`}
              type="select"
              options={getIsBetweenValues(
                filteredValueByname.value,
                getDateInputStringDropDownOptions(
                  filteredValueByname.range,
                  filteredValueByname.operator,
                  filteredValueByname.compare_operator
                )
              )}
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'value1'
            )}
          </Colxx>
        </>
      )}
      {!hideDropDownForDate.includes(filteredValueByname.operator) &&
        filteredValueByname.operator !==
          createSegementEnums.CONDITION.IN_THE_FOLLOWING && (
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              noLable
              identifier={`${identifier}.compare_operator`}
              type="select"
              options={getlastDropDownforWhereWeeklytheday(
                filteredValueByname.range,
                filteredValueByname.operator
              )}
              onChange={handleOnCompareOperatorChange}
              value={filteredValueByname.compare_operator}
              dataTestId="compareOperator"
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'compare_operator'
            )}
          </Colxx>
        )}
    </>
  );
};

export default WeeklyMonthlyYearlyWhereRangeType;
