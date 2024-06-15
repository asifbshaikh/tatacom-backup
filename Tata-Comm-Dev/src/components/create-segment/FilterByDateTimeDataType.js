import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  dateTimeFilterType,
  dateTimeHideDropDownsAndInputFields,
  getStringInputDropDownOptions,
  renderDateTimeFilters,
  renderDateTimeFiltersForDateAndYearlyWhereTheDate,
  CleanFieldValuesProvider,
} from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import React, { useContext } from 'react';
import DailyWhereTheHourRangeType from './DailyWhereTheHourRangeType';
import DateAndYearlyWhereDateRangeType from './DateAndYearlyWhereDateRangeType';
import WeeklyMonthlyYearlyWhereRangeType from './WeeklyMonthlyYearlyWhereRangeType';

const FilterByDateTimeDataType = ({
  filteredValueByname,
  identifier,
  form,
  filterFormErrors,
  filterFormTouched,
}) => {
  const { cleanFieldValues, getErrorMessageOfField } = useContext(
    CleanFieldValuesProvider
  );

  const handleOnOperatorChange = (event) => {
    cleanFieldValues(identifier, createSegementEnums.IDENTIFIERS.OPERATOR);
    if (
      event.target.value === 'in_the_following' ||
      event.target.value === 'not_in_the_following'
    ) {
      form.setFieldValue(`${identifier}.value`, []);
    } else {
      form.setFieldValue(`${identifier}.value`, '');
    }

    form.setFieldValue(`${identifier}.operator`, event.target.value);
  };

  const handleOnRangeChange = (event) => {
    cleanFieldValues(identifier, createSegementEnums.IDENTIFIERS.RANGE);

    form.setFieldValue(`${identifier}.range`, event.target.value);
  };

  const handleOnValueChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    form.setFieldValue(`${identifier}.value`, selectedValues);
  };

  const handleOnCompareOperatorChange = (event) => {
    cleanFieldValues(identifier, 'compare_operator');

    form.setFieldValue(`${identifier}.compare_operator`, event.target.value);
    if (
      event.target.value === 'in_the_following' ||
      event.target.value === 'not_in_the_following'
    ) {
      form.setFieldValue(`${identifier}.value`, []);
    } else {
      form.setFieldValue(`${identifier}.value`, '');
    }
  };

  return (
    <>
      <Colxx xxs="12" md="2">
        <FormGroupCoustom
          noLable
          options={dateTimeFilterType}
          identifier={`${identifier}.range`}
          type="select"
          onChange={handleOnRangeChange}
          value={filteredValueByname.range}
          onBlur={form.handleBlur}
          dataTestId="rangeDropdown"
        />
        {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'range')}
      </Colxx>
      <Colxx xxs="12" md="2">
        <FormGroupCoustom
          noLable
          identifier={`${identifier}.operator`}
          type="select"
          options={getStringInputDropDownOptions(filteredValueByname.range)}
          onChange={handleOnOperatorChange}
          value={filteredValueByname.operator}
          onBlur={form.handleBlur}
          dataTestId="operatorDropdown"
        />
        {getErrorMessageOfField(
          filterFormErrors,
          filterFormTouched,
          'operator'
        )}
      </Colxx>
      {renderDateTimeFiltersForDateAndYearlyWhereTheDate.includes(
        filteredValueByname.range
      ) && (
        <DateAndYearlyWhereDateRangeType
          handleOnValueChange={handleOnValueChange}
          filteredValueByname={filteredValueByname}
          identifier={identifier}
          form={form}
          filterFormErrors={filterFormErrors}
          filterFormTouched={filterFormTouched}
          handleOnCompareOperatorChange={handleOnCompareOperatorChange}
        />
      )}
      {filteredValueByname.range ===
        createSegementEnums.CONDITION.DAILY_WHERE_THE_HOUR && (
        <DailyWhereTheHourRangeType
          handleOnValueChange={handleOnValueChange}
          filteredValueByname={filteredValueByname}
          identifier={identifier}
          form={form}
          filterFormErrors={filterFormErrors}
          filterFormTouched={filterFormTouched}
        />
      )}
      {renderDateTimeFilters.includes(filteredValueByname.range) &&
        !dateTimeHideDropDownsAndInputFields.includes(
          filteredValueByname.operator
        ) && (
          <WeeklyMonthlyYearlyWhereRangeType
            handleOnValueChange={handleOnValueChange}
            filteredValueByname={filteredValueByname}
            identifier={identifier}
            form={form}
            filterFormErrors={filterFormErrors}
            filterFormTouched={filterFormTouched}
            handleOnCompareOperatorChange={handleOnCompareOperatorChange}
          />
        )}
    </>
  );
};

export default FilterByDateTimeDataType;
