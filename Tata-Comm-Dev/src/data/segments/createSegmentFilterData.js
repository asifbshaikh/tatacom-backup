import createSegementEnums from 'enums/createSegment/createSegementEnums';
import { getConvertedStringWithSpace } from 'helpers/campaignHelper';
import moment from 'moment';
import { createContext } from 'react';

export const stringFilterType = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'is', value: 'CREATE_SEGMENT.IS' },
  { id: 'exists', value: 'CREATE_SEGMENT.EXISTS' },
  { id: 'contains', value: 'CREATE_SEGMENT.CONTAINS' },
  { id: 'starts_with', value: 'CREATE_SEGMENT.STARTS_WITH' },
  { id: 'ends_with', value: 'CREATE_SEGMENT.ENDS_WITH' },
  { id: 'is_not', value: 'CREATE_SEGMENT.IS_NOT' },
  { id: 'does_not_exist', value: 'CREATE_SEGMENT.DOES_NOT_EXIST' },
  { id: 'does_not_contain', value: 'CREATE_SEGMENT.DOES_NOT_CONTAIN' },
  { id: 'does_not_start_with', value: 'CREATE_SEGMENT.DOES_NOT_START_WITH' },
  { id: 'does_not_end_with', value: 'CREATE_SEGMENT.DOES_NOT_END_WITH' },
  { id: 'in_the_following', value: 'CREATE_SEGMENT.IN_THE_FOLLOWING' },
  { id: 'not_in_the_following', value: 'CREATE_SEGMENT.NOT_IN_THE_FOLLOWING' },
];
export const arrayStringOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: '(any of)_is', value: 'CREATE_SEGMENT.ANY_OF_IS' },
  { id: '(all of)_is', value: 'CREATE_SEGMENT.ALL_OF_IS' },
  { id: 'is_not', value: 'CREATE_SEGMENT.IS_NOT' },
  { id: '(any of)_contains', value: 'CREATE_SEGMENT.ANY_OF_CONTAINS' },
  { id: '(all of)_contains', value: 'CREATE_SEGMENT.ALL_OF_CONTAINS' },
  { id: 'does_not_contain', value: 'CREATE_SEGMENT.DOES_NOT_CONTAIN' },
  { id: '(any of)_starts_with', value: 'CREATE_SEGMENT.ANY_OF_STARTS_WITH' },
  { id: '(all of)_starts_with', value: 'CREATE_SEGMENT.ALL_OF_STARTS_WITH' },
  { id: 'does_not_start_with', value: 'CREATE_SEGMENT.DOES_NOT_START_WITH' },
  { id: '(any of)_ends_with', value: 'CREATE_SEGMENT.ANY_OF_ENDS_WITH' },
  { id: '(all of)_ends_with', value: 'CREATE_SEGMENT.ALL_OF_ENDS_WITH' },
  { id: 'does_not_end_with', value: 'CREATE_SEGMENT.DOES_NOT_END_WITH' },
  { id: 'exists', value: 'CREATE_SEGMENT.EXISTS' },
  { id: 'does_not_exist', value: 'CREATE_SEGMENT.DOES_NOT_EXIST' },
  {
    id: '(any of)_in_the_following',
    value: 'CREATE_SEGMENT.ANY_OF_IN_THE_FOLLOWING',
  },
  {
    id: '(all of)_in_the_following',
    value: 'CREATE_SEGMENT.ALL_OF_IN_THE_FOLLOWING',
  },
  { id: 'not_in_the_following', value: 'CREATE_SEGMENT.NOT_IN_THE_FOLLOWING' },
];

export const renderStringAndStringArray = [
  'string',
  'array_string',
  'text',
  'link',
  'list',
];

export const renderDoubleAndNumber = ['double', 'number'];

export const renderBooleanAndCheckbox = ['bool', 'checkbox'];

export const renderDateAndDatetime = ['date', 'datetime'];

export const dateTimeFilterType = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'date', value: 'CREATE_SEGMENT.DATE' },
  { id: 'daily_where_the_hour', value: 'CREATE_SEGMENT.DAILY_WHERE_THE_HOUR' },
  { id: 'weekly_where_the_day', value: 'CREATE_SEGMENT.WEEKLY_WHERE_THE_DAY' },
  {
    id: 'monthly_where_the_day',
    value: 'CREATE_SEGMENT.MONTHLY_WHERE_THE_DAY',
  },
  {
    id: 'yearly_where_the_month',
    value: 'CREATE_SEGMENT.YEARLY_WHERE_THE_MONTH',
  },
  {
    id: 'yearly_where_the_date',
    value: 'CREATE_SEGMENT.YEARLY_WHERE_THE_DATE',
  },
];

export const dateTypeOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_ONE_OPTION' },
  { id: 'on', value: 'CREATE_SEGMENT.ON' },
  { id: 'is_between', value: 'CREATE_SEGMENT.IS_BETWEEN' },
  { id: 'before', value: 'CREATE_SEGMENT.BEFORE' },
  { id: 'after', value: 'CREATE_SEGMENT.AFTER' },
  { id: 'in_the_next', value: 'CREATE_SEGMENT.IN_THE_NEXT' },
  { id: 'in_the_last', value: 'CREATE_SEGMENT.IN_THE_LAST' },
  { id: 'is_today', value: 'CREATE_SEGMENT.IS_TODAY' },
  { id: 'exists', value: 'CREATE_SEGMENT.EXISTS' },
  { id: 'does_not_exist', value: 'CREATE_SEGMENT.DOES_NOT_EXIST' },
];

export const dailyWhereTheHourOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'is', value: 'CREATE_SEGMENT.IS' },
  { id: 'is_between', value: 'CREATE_SEGMENT.IS_BETWEEN' },
  { id: 'in_the_following', value: 'CREATE_SEGMENT.IN_THE_FOLLOWING' },
];

export const weeklyAndMonthlyWhereTheDayOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'is', value: 'CREATE_SEGMENT.IS' },
  { id: 'is_between', value: 'CREATE_SEGMENT.IS_BETWEEN' },
  { id: 'in_the_next', value: 'CREATE_SEGMENT.IN_THE_NEXT' },
  { id: 'in_the_last', value: 'CREATE_SEGMENT.IN_THE_LAST' },
  { id: 'is_today', value: 'CREATE_SEGMENT.IS_TODAY' },
  { id: 'in_the_following', value: 'CREATE_SEGMENT.IN_THE_FOLLOWING' },
];
export const yearWhereTheMonthOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'is', value: 'CREATE_SEGMENT.IS' },
  { id: 'is_between', value: 'CREATE_SEGMENT.IS_BETWEEN' },
  { id: 'in_the_next', value: 'CREATE_SEGMENT.IN_THE_NEXT' },
  { id: 'in_the_last', value: 'CREATE_SEGMENT.IN_THE_LAST' },
  { id: 'is_this_month', value: 'CREATE_SEGMENT.IS_THIS_MONTH' },
  { id: 'in_the_following', value: 'CREATE_SEGMENT.IN_THE_FOLLOWING' },
];
export const yearWhereTheDateOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'is', value: 'CREATE_SEGMENT.IS' },
  { id: 'is_between', value: 'CREATE_SEGMENT.IS_BETWEEN' },
  { id: 'in_the_next', value: 'CREATE_SEGMENT.IN_THE_NEXT' },
  { id: 'in_the_last', value: 'CREATE_SEGMENT.IN_THE_LAST' },
  { id: 'is_today', value: 'CREATE_SEGMENT.IS_TODAY' },
];
export const onAndIsBetweenOptions = [
  { id: '', value: '' },
  { id: 'date', value: 'CREATE_SEGMENT.LOWER_CASE_DATE' },
  { id: 'days_ago', value: 'CREATE_SEGMENT.LOWER_CASE_DAYS_AGO' },
  { id: 'days_from_now', value: 'CREATE_SEGMENT.DAYS_FROM_NOW' },
];
export const dateTimeWeeklywherethedayOptions = [
  { id: '', value: '' },
  { id: 'day', value: 'CREATE_SEGMENT.DAY' },
  { id: 'days_ago', value: 'CREATE_SEGMENT.LOWER_CASE_DAYS_AGO' },
  { id: 'days_from_now', value: 'CREATE_SEGMENT.DAYS_FROM_NOW' },
];
export const dateTimeYearWhereTheMonthOptions = [
  { id: '', value: '' },
  { id: 'month', value: 'CREATE_SEGMENT.MONTH' },
  { id: 'month_ago', value: 'CREATE_SEGMENT.MONTH_AGO' },
  { id: 'month_from_now', value: 'CREATE_SEGMENT.MONTH_FROM_NOW' },
];
export const dateTimeYearWhereThedateOptions = [
  { id: '', value: '' },
  { id: 'date_month', value: 'CREATE_SEGMENT.DATE_MONTH' },
  { id: 'days_ago', value: 'CREATE_SEGMENT.LOWER_CASE_DAYS_AGO' },
  { id: 'days_from_now', value: 'CREATE_SEGMENT.DAYS_FROM_NOW' },
];

export const beforeOptions = [
  { id: '', value: '' },
  { id: 'date', value: 'CREATE_SEGMENT.LOWER_CASE_DATE' },
  { id: 'days_ago', value: 'CREATE_SEGMENT.LOWER_CASE_DAYS_AGO' },
];

export const afterOptions = [
  { id: '', value: '' },
  { id: 'date', value: 'CREATE_SEGMENT.LOWER_CASE_DATE' },
  { id: 'days_from_now', value: 'CREATE_SEGMENT.DAYS_FROM_NOW' },
];

export const booleanFilterType = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'is', value: 'CREATE_SEGMENT.IS' },
  { id: 'is_not', value: 'CREATE_SEGMENT.IS_NOT' },
  { id: 'exists', value: 'CREATE_SEGMENT.EXISTS' },
  { id: 'does_not_exist', value: 'CREATE_SEGMENT.DOES_NOT_EXIST' },
];

export const numericFilterType = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'is_equal_to', value: 'CREATE_SEGMENT.IS_EQUAL_TO' },
  { id: 'is_not_equal_to', value: 'CREATE_SEGMENT.IS_NOT_EQUAL_TO' },
  { id: 'is_between', value: 'CREATE_SEGMENT.IS_BETWEEN' },
  { id: 'is_not_between', value: 'CREATE_SEGMENT.IS_NOT_BETWEEN' },
  { id: 'is_less_than', value: 'CREATE_SEGMENT.IS_LESS_THAN' },
  { id: 'is_greater_than', value: 'CREATE_SEGMENT.IS_GREATER_THAN' },
  { id: 'in_the_following', value: 'CREATE_SEGMENT.IN_THE_FOLLOWING' },
  { id: 'not_in_the_following', value: 'CREATE_SEGMENT.NOT_IN_THE_FOLLOWING' },
  { id: 'exists', value: 'CREATE_SEGMENT.EXISTS' },
  { id: 'does_not_exist', value: 'CREATE_SEGMENT.DOES_NOT_EXIST' },
];

export const dailyWhereHourDropDownOptions = [
  { id: '', value: 'CREATE_SEGMENT.HOURS_OF_THE_DAY' },
  { id: '12am-1am', value: '12am-1am' },
  { id: '1am-2am', value: '1am-2am' },
  { id: '2am-3am', value: '2am-3am' },
  { id: '3am-4am', value: '3am-4am' },
  { id: '4am-5am', value: '4am-5am' },
  { id: '5am-6am', value: '5am-6am' },
  { id: '6am-7am', value: '6am-7am' },
  { id: '7am-8am', value: '7am-8am' },
  { id: '8am-9am', value: '8am-9am' },
  { id: '9am-10am', value: '9am-10am' },
  { id: '10am-11am', value: '10am-11am' },
  { id: '11am-12pm', value: '11am-12pm' },
  { id: '12pm-1pm', value: '12pm-1pm' },
  { id: '1pm-2pm', value: '1pm-2pm' },
  { id: '2pm-3pm', value: '2pm-3pm' },
  { id: '3pm-4pm', value: '3pm-4pm' },
  { id: '4pm-5pm', value: '4pm-5pm' },
  { id: '5pm-6pm', value: '5pm-6pm' },
  { id: '6pm-7pm', value: '6pm-7pm' },
  { id: '7pm-8pm', value: '7pm-8pm' },
  { id: '8pm-9pm', value: '8pm-9pm' },
  { id: '9pm-10pm', value: '9pm-10pm' },
  { id: '10pm-11pm', value: '10pm-11pm' },
  { id: '11pm-12am', value: '11pm-12am' },
];

export const weeklyWherethedayDropDownOptions = [
  { id: '', value: 'CREATE_SEGMENT.DAYS_OF_THE_WEEK' },
  { id: 'Sunday', value: 'CREATE_SEGMENT.SUNDAY' },
  { id: 'Monday', value: 'CREATE_SEGMENT.MONDAY' },
  { id: 'Tuesday', value: 'CREATE_SEGMENT.TUESDAY' },
  { id: 'Wednesday', value: 'CREATE_SEGMENT.WEDNESDAY' },
  { id: 'Thursday', value: 'CREATE_SEGMENT.THURSDAY' },
  { id: 'Friday', value: 'CREATE_SEGMENT.FRIDAY' },
  { id: 'Saturday', value: 'CREATE_SEGMENT.SATURDAY' },
];

export const getNumericValues = (numericValue) => {
  const options = [{ id: '', value: 'CREATE_SEGMENT.SELECT_OPTION' }];
  for (let i = 1; i <= numericValue; i += 1) {
    options.push({ id: i.toString(), value: i.toString() });
  }
  return options;
};

export const yearWhereTheMonthDropDownOptions = [
  { id: '', value: 'CREATE_SEGMENT.DAYS_OF_THE_MONTH' },
  { id: 'January', value: 'CREATE_SEGMENT.JANUARY' },
  { id: 'February', value: 'CREATE_SEGMENT.FEBRUARY' },
  { id: 'March', value: 'CREATE_SEGMENT.MARCH' },
  { id: 'April', value: 'CREATE_SEGMENT.APRIL' },
  { id: 'May', value: 'CREATE_SEGMENT.MAY' },
  { id: 'June', value: 'CREATE_SEGMENT.JUNE' },
  { id: 'July', value: 'CREATE_SEGMENT.JULY' },
  { id: 'August', value: 'CREATE_SEGMENT.AUGUST' },
  { id: 'September', value: 'CREATE_SEGMENT.SEPTEMBER' },
  { id: 'October', value: 'CREATE_SEGMENT.OCTOBER' },
  { id: 'November', value: 'CREATE_SEGMENT.NOVEMBER' },
  { id: 'December', value: 'CREATE_SEGMENT.DECEMBER' },
];

export const renderDateTimeFilters = [
  'weekly_where_the_day',
  'monthly_where_the_day',
  'yearly_where_the_month',
];
export const renderDateTimeFiltersForDateAndYearlyWhereTheDate = [
  'date',
  'yearly_where_the_date',
];
export const showInputFieldbeforeAfter = ['before', 'after'];
export const showDatePicker = ['on', 'is_between', 'is'];

export const hideDropDownForDate = ['in_the_next', 'in_the_last'];
export const showDateFieldBasedOnCompareOperator = ['date', 'date_month'];

export const doubleShowTwoInputFields = ['is_between', 'is_not_between'];
export const doubleHideInputFieldAndShowDropDown = [
  'in_the_following',
  'not_in_the_following',
];

export const strigHideInputField = [
  ...doubleHideInputFieldAndShowDropDown,
  '(any of)_in_the_following',
  '(all of)_in_the_following',
  'not_in_the_following',
];

export const doubleHideInputDropDown = ['exists', 'does_not_exist'];
export const booleanHideDropDown = [...doubleHideInputDropDown];
export const strigHideDropDownsFor = [...doubleHideInputDropDown];
export const dateTimeHideDropDownsAndInputFields = [
  ...doubleHideInputDropDown,
  'is_today',
  'is_this_month',
];

export const showDropdownForCampaignChannelAndType = [
  'campaign_channel',
  'campaign_type',
];

export const getlastDropDownforWhereWeeklytheday = (rangeType, text) => {
  let options = [];
  switch (rangeType) {
    case 'weekly_where_the_day':
      switch (text) {
        case 'is':
          options = dateTimeWeeklywherethedayOptions;
          break;
        case 'is_between':
          options = dateTimeWeeklywherethedayOptions;
          break;
        default:
          options = [];
          break;
      }
      break;
    case 'monthly_where_the_day':
      switch (text) {
        case 'is':
          options = dateTimeWeeklywherethedayOptions;
          break;
        case 'is_between':
          options = dateTimeWeeklywherethedayOptions;
          break;
        default:
          options = [];
          break;
      }
      break;

    case 'yearly_where_the_month':
      switch (text) {
        case 'is':
          options = dateTimeYearWhereTheMonthOptions;
          break;
        case 'is_between':
          options = dateTimeYearWhereTheMonthOptions;
          break;
        default:
          options = [];
          break;
      }
      break;
    case 'yearly_where_the_date':
      switch (text) {
        case 'is':
          options = dateTimeYearWhereThedateOptions;
          break;
        case 'is_between':
          options = dateTimeYearWhereThedateOptions;
          break;
        default:
          options = [];
          break;
      }
      break;
    case 'date':
      switch (text) {
        case 'on':
          options = onAndIsBetweenOptions;
          break;
        case 'is_between':
          options = onAndIsBetweenOptions;

          break;
        case 'before':
          options = beforeOptions;
          break;
        case 'after':
          options = afterOptions;

          break;

        default:
          options = [];
          break;
      }
      break;

    default:
      options = [];
      break;
  }

  return options;
};

export const getStringInputDropDownOptions = (text) => {
  let options = [];
  switch (text) {
    case 'daily_where_the_hour':
      options = dailyWhereTheHourOptions;
      break;
    case 'weekly_where_the_day':
      options = weeklyAndMonthlyWhereTheDayOptions;
      break;
    case 'monthly_where_the_day':
      options = weeklyAndMonthlyWhereTheDayOptions;
      break;
    case 'yearly_where_the_month':
      options = yearWhereTheMonthOptions;
      break;
    case 'yearly_where_the_date':
      options = yearWhereTheDateOptions;
      break;

    default:
      options = dateTypeOptions;
      break;
  }
  return options;
};

export const getDateInputStringDropDownOptions = (
  rangeType,
  text,
  compareOperator
) => {
  let options = [];
  switch (rangeType) {
    case 'daily_where_the_hour':
      switch (text) {
        case 'is':
          options = dailyWhereHourDropDownOptions;
          break;
        case 'is_between':
          options = dailyWhereHourDropDownOptions;

          break;
        case 'in_the_following':
          options = dailyWhereHourDropDownOptions;
          break;

        default:
          options = [];
          break;
      }
      break;
    case 'weekly_where_the_day':
      switch (text) {
        case 'is':
          if (compareOperator === 'day') {
            options = weeklyWherethedayDropDownOptions;
          } else {
            options = getNumericValues(
              createSegementEnums.RANGE_CONSTANTS.WEEK_RANGE
            );
          }
          break;
        case 'is_between':
          if (compareOperator === 'day') {
            options = weeklyWherethedayDropDownOptions;
          } else {
            options = getNumericValues(
              createSegementEnums.RANGE_CONSTANTS.WEEK_RANGE
            );
          }
          break;
        case 'in_the_next':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.WEEK_RANGE
          );
          break;
        case 'in_the_last':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.WEEK_RANGE
          );

          break;
        case 'in_the_following':
          options = weeklyWherethedayDropDownOptions;

          break;

        default:
          options = [];
          break;
      }
      break;
    case 'monthly_where_the_day':
      switch (text) {
        case 'is':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.DAYS_RANGE
          );
          break;
        case 'is_between':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.DAYS_RANGE
          );

          break;
        case 'in_the_next':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.DAYS_RANGE
          );
          break;
        case 'in_the_last':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.DAYS_RANGE
          );

          break;
        case 'in_the_following':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.DAYS_RANGE
          );

          break;

        default:
          options = [];
          break;
      }
      break;
    case 'yearly_where_the_month':
      switch (text) {
        case 'is':
          if (compareOperator === 'month') {
            options = yearWhereTheMonthDropDownOptions;
          } else {
            options = getNumericValues(
              createSegementEnums.RANGE_CONSTANTS.MONTH_RANGE
            );
          }
          break;
        case 'is_between':
          if (compareOperator === 'month') {
            options = yearWhereTheMonthDropDownOptions;
          } else {
            options = getNumericValues(
              createSegementEnums.RANGE_CONSTANTS.MONTH_RANGE
            );
          }
          break;
        case 'in_the_next':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.MONTH_RANGE
          );
          break;
        case 'in_the_last':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.MONTH_RANGE
          );

          break;
        case 'in_the_following':
          options = yearWhereTheMonthDropDownOptions;

          break;

        default:
          options = [];
          break;
      }
      break;
    case 'yearly_where_the_date':
      switch (text) {
        case 'is':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.YEAR_RANGE
          );
          break;
        case 'is_between':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.YEAR_RANGE
          );
          break;
        case 'in_the_next':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.YEAR_RANGE
          );
          break;
        case 'in_the_last':
          options = getNumericValues(
            createSegementEnums.RANGE_CONSTANTS.YEAR_RANGE
          );

          break;

        default:
          options = [];
          break;
      }
      break;
    default:
      options = [];
      break;
  }
  return options;
};

export const booleanDataTypeDropDownOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPTION' },
  { id: 'true', value: 'CREATE_SEGMENT.TRUE' },
  { id: 'false', value: 'CREATE_SEGMENT.FALSE' },
];

export const userBehaviourOperatorList = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPERATOR' },
  { id: 'exactly', value: 'CREATE_SEGMENT.EXACTLY' },
  { id: 'at_least', value: 'CREATE_SEGMENT.AT_LEAST' },
  { id: 'at_most', value: 'CREATE_SEGMENT.AT_MOST' },
];

export const getAccordionHeaderTitleForFilter = (objectData) => {
  const displayNameKeys = [
    'executed',
    'displayed_name',
    'name',
    'operator_type',
    'range',
    'operator',
    'type',
    'value',
    'value1',
    'case_sensitive',
    'compare_operator',
    'filter_operator',
    'user_affinity_attributes',
    'primary_time_range',
    'attributes',
    'period_unit',
  ];
  let header = '';
  displayNameKeys.forEach((name) => {
    if (typeof objectData[name] != undefined) {
      switch (typeof objectData[name]) {
        case createSegementEnums.CONDITION.STRING:
          if (name === createSegementEnums.IDENTIFIERS.DISPLAYED_NAME) {
            displayNameKeys.splice(
              displayNameKeys.indexOf(createSegementEnums.IDENTIFIERS.NAME),
              1
            );
            header += `${objectData[name]} `;
          } else if (name === 'executed') {
            header +=
              objectData[name] === 'true' ? 'Executed ' : 'Not Executed ';
          } else if (objectData[name] && name === 'value1') {
            header += `And ${getConvertedStringWithSpace(objectData?.[name])} `;
          } else if (objectData[name] === createSegementEnums.CONDITION.NULL) {
            header += '';
          } else {
            header += `${getConvertedStringWithSpace(objectData?.[name])} `;
          }
          break;
        case createSegementEnums.CONDITION.OBJECT:
          if (
            Array.isArray(objectData[name]) &&
            name === createSegementEnums.IDENTIFIERS.VALUE
          ) {
            header += `${objectData[name].toString()} `;
          } else if (
            objectData[name] &&
            name === createSegementEnums.IDENTIFIERS.VALUE
          ) {
            header += `${moment(objectData[name]).format('L')} `;
          } else if (
            objectData[name] &&
            name === createSegementEnums.IDENTIFIERS.VALUE1
          ) {
            header += `And ${moment(objectData[name]).format('L')} `;
          } else if (name === 'user_affinity_attributes') {
            if (objectData?.user_affinity_attributes?.filters?.length > 0) {
              objectData?.user_affinity_attributes.filters.forEach(
                (item, index) => {
                  header += ` ${
                    index === 0
                      ? ' ' + createSegementEnums.CONDITION.WITH + ' '
                      : objectData?.user_affinity_attributes.filter_operator
                  } `;
                  header += `${getAccordionHeaderTitleForFilter(item)} `;
                }
              );
            }
          } else if (name === 'primary_time_range') {
            header += `${getAccordionHeaderTitleForFilter(objectData[name])} `;
          } else if (name === 'attributes') {
            if (objectData?.attributes?.filters?.length > 0) {
              objectData?.attributes.filters.forEach((item, idx) => {
                header += ` ${
                  idx === 0
                    ? ' ' + createSegementEnums.CONDITION.WITH_ATTRIBUTE + ' '
                    : objectData?.attributes.filter_operator
                } `;
                header += getAccordionHeaderTitleForFilter(item);
              });
            }
          } else {
            header += `${getConvertedStringWithSpace(objectData?.[name])} `;
          }
          break;
        case createSegementEnums.CONDITION.NUMBER:
          if (
            name === createSegementEnums.IDENTIFIERS.VALUE &&
            objectData[createSegementEnums.IDENTIFIERS.OPERATOR_TYPE] ===
              createSegementEnums.CONDITION.FOR_MIN_OF
          ) {
            header += `${objectData[name]} ${createSegementEnums.CONDITION.PERCENT_OF_TIMES} `;
          } else if (
            name === createSegementEnums.IDENTIFIERS.VALUE &&
            objectData[createSegementEnums.IDENTIFIERS.OPERATOR_TYPE] ===
              createSegementEnums.CONDITION.MOST_OF_TIMES
          ) {
            header += ` ${createSegementEnums.CONDITION.AND_FILTER_TOP} ${objectData[name]} ${createSegementEnums.CONDITION.PERCENT_OF_THE_USERS} `;
          } else if (
            name === createSegementEnums.IDENTIFIERS.VALUE &&
            objectData[createSegementEnums.IDENTIFIERS.OPERATOR_TYPE] ===
              createSegementEnums.CONDITION.LEAST_NO_OF_TIMES
          ) {
            header += ` ${createSegementEnums.CONDITION.AND_FILTER_BOTTOM} ${objectData[name]} ${createSegementEnums.CONDITION.PERCENT_OF_THE_USERS} `;
          } else if (name === createSegementEnums.IDENTIFIERS.VALUE1) {
            header += `And ${objectData?.[name]} `;
          } else {
            header += `${objectData?.[name]} `;
          }
          break;
        case createSegementEnums.CONDITION.BOOLEAN:
          if (name === 'executed') {
            header += 'Executed ';
          } else if (name === createSegementEnums.IDENTIFIERS.CASE_SENSITIVE) {
            header += objectData[name]
              ? `(${createSegementEnums.LABEL.CASE_SENSITIVE})`
              : `(${createSegementEnums.LABEL.CASE_IN_SENSITIVE})`;
          } else {
            header += '';
          }
          break;
        default:
          header += '';
          break;
      }
    }
  });
  return header.trim();
};

export const userAffinityWithSelectAttr = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPTION' },
  { id: 'predominantly', value: 'CREATE_SEGMENT.PREDOMINANTLY' },
  { id: 'for_a_minimum_of', value: 'CREATE_SEGMENT.FOR_MIN_OF' },
  { id: 'most_no_of_times', value: 'CREATE_SEGMENT.MOST_OF_TIMES' },
  { id: 'least_no_of_times', value: 'CREATE_SEGMENT.LEAST_NO_OF_TIMES' },
];

export const predominantlyAndForMinOf = ['predominantly', 'for_a_minimum_of'];

export const mostAndLeastNoOfTimes = ['most_no_of_times', 'least_no_of_times'];

export const getUserPropertyFieldList = (fieldType) => {
  let arr = [];
  switch (fieldType) {
    case 'name':
      arr = [
        'operator',
        'compare_operator',
        'range',
        'value',
        'value1',
        'case_sensitive',
      ];
      break;
    case 'operator':
      arr = ['compare_operator', 'value', 'value1'];
      break;
    case 'operator_type':
      arr = [
        'name',
        'operator',
        'compare_operator',
        'range',
        'value',
        'value1',
      ];
      break;
    case 'compare_operator':
      arr = ['value', 'value1'];
      break;
    case 'data_type':
      arr = [
        'operator',
        'compare_operator',
        'range',
        'value',
        'value1',
        'case_sensitive',
      ];
      break;
    case 'range':
      arr = [
        'value',
        'value1',
        'operator',
        'compare_operator',
        'case_sensitive',
      ];
      break;
    case 'type':
      arr = ['value', 'value1', 'period_unit'];
      break;
    case 'period_unit':
      arr = ['value', 'value1'];
      break;
    default:
      break;
  }
  return arr;
};

export const CleanFieldValuesProvider = createContext(null);

export const durationDropdownOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPTION' },
  { id: 'in_the_last', value: 'CREATE_SEGMENT.IN_THE_LAST' },
  { id: 'in_between', value: 'CREATE_SEGMENT.IN_BETWEEN' },
  { id: 'before', value: 'CREATE_SEGMENT.BEFORE' },
  { id: 'after', value: 'CREATE_SEGMENT.AFTER' },
  { id: 'on', value: 'CREATE_SEGMENT.ON' },
  { id: 'today', value: 'CREATE_SEGMENT.TODAY' },
];

export const durationUserBehaviorOptions = [
  ...durationDropdownOptions,
  { id: 'yesterday', value: 'CREATE_SEGMENT.YESTERDAY' },
  { id: 'this_week', value: 'CREATE_SEGMENT.THIS_WEEK' },
  { id: 'last_week', value: 'CREATE_SEGMENT.LAST_WEEK' },
  { id: 'this_month', value: 'CREATE_SEGMENT.THIS_MONTH' },
  { id: 'last_month', value: 'CREATE_SEGMENT.LAST_MONTH' },
];

export const daysOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPTION' },
  { id: 'date', value: 'CREATE_SEGMENT.DATE' },
  { id: 'days_ago', value: 'CREATE_SEGMENT.DAYS_AGO' },
];

export const userBehaviorDaysOptions = [
  { id: '', value: 'CREATE_SEGMENT.SELECT_OPTION' },
  { id: 'hours', value: 'CREATE_SEGMENT.HOURS' },
  { id: 'days', value: 'CREATE_SEGMENT.DAYS' },
  { id: 'weeks', value: 'CREATE_SEGMENT.WEEKS' },
  { id: 'months', value: 'CREATE_SEGMENT.MONTHS' },
];

export const getInitialValuesOfFilterType = (filterType) => {
  let initialObject = {};
  switch (filterType) {
    case createSegementEnums.CONDITION.USER_PROPERTY:
      initialObject = {
        filter_type: filterType,
        data_type: '',
        category: '',
        name: '',
        value: '',
        operator: '',
      };

      break;
    case createSegementEnums.CONDITION.USER_AFFINITY:
      initialObject = {
        filter_type: filterType,
        executed: true,
        name: '',
        value: '',
        operator_type: '',
        attributes: {
          filter_operator: createSegementEnums.INITIALVALUES.AND,
          filters: [],
        },
        user_affinity_attributes: {
          filter_operator: createSegementEnums.INITIALVALUES.AND,
          filters: [
            {
              filter_type:
                createSegementEnums.INITIALVALUES.USER_AFFINITY_ATTRIBUTES,
            },
          ],
        },
        primary_time_range: {
          period_unit: '',
          type: '',
          value: '',
        },
      };

      break;
    case createSegementEnums.CONDITION.USER_BEHAVIOR:
      initialObject = {
        filter_type: filterType,
        executed: '',
        name: '',
        operator: '',
        attributes: {
          filter_operator: createSegementEnums.INITIALVALUES.AND,
          filters: [],
        },
        primary_time_range: {
          period_unit: '',
          type: '',
          value: '',
        },
      };

      break;
    case createSegementEnums.CONDITION.CUSTOM_SEGMENT:
      initialObject = {
        filter_type: filterType,
        name: '',
        segment_id: 0,
      };

      break;

    default:
      initialObject = {};
      break;
  }
  return initialObject;
};

export const createSegmentFiltersInitialValues = {
  audience_type: createSegementEnums.CONDITION.ALL_USERS,
  exclude_users: false,
  included_filters: {
    filter_operator: createSegementEnums.INITIALVALUES.AND,
    filters: [
      {
        filter_operator: createSegementEnums.INITIALVALUES.OR,
        filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS,
        filters: [
          {
            filter_type: createSegementEnums.INITIALVALUES.ALL_USERS,
            name: createSegementEnums.LABEL.ALL_USERS,
            id: createSegementEnums.INITIALVALUES.DIGO_ALL_USERS,
          },
        ],
      },
    ],
  },
  excluded_filters: {
    filter_operator: createSegementEnums.INITIALVALUES.AND,
    filters: [
      {
        filter_operator: createSegementEnums.INITIALVALUES.OR,
        filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS,
        filters: [
          {
            filter_type: createSegementEnums.INITIALVALUES.FILTER_BY_USERS,
          },
        ],
      },
    ],
  },
};

export function removeEmptyPropertyFromJson(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      if (typeof obj[prop] === 'object') {
        if (obj[prop] instanceof Date) {
          continue;
        }
        if (Array.isArray(obj[prop]) && obj[prop].length === 0) {
          continue;
        }
        obj[prop] = removeEmptyPropertyFromJson(obj[prop]);
        if (obj[prop] && Object.keys(obj[prop]).length === 0) {
          delete obj[prop];
        }
      } else if (
        obj[prop] === '' ||
        obj[prop] === null ||
        obj[prop] === undefined
      ) {
        delete obj[prop];
      } else if (obj[prop] === createSegementEnums.CONDITION.TRUE) {
        obj[prop] = true;
      } else if (obj[prop] === createSegementEnums.CONDITION.FALSE) {
        obj[prop] = false;
      }
    }
  }
  return obj;
}

export const isExcludeUserSelected = (values) => {
  const removeEmptyValues = removeEmptyPropertyFromJson(values);
  let filters = {};
  if (removeEmptyValues.exclude_users) {
    filters = {
      included_filters: removeEmptyValues.included_filters,
      excluded_filters: removeEmptyValues.excluded_filters,
    };
  } else {
    filters = { included_filters: removeEmptyValues.included_filters };
  }
  return filters;
};

export const reactSelectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '0.1rem',
    fontSize: '0.8rem',
    border: '1px solid #9d9fa1',
    background: '#ffffff',
    color: '#363636',
    height: '34px',
    minHeight: '34px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#9d9fa1',
      boxShadow: '#9d9fa1',
    },
  }),

  menu: (base) => ({
    ...base,
    zIndex: 5,
    overFlow: 'hidden',
  }),

  indicatorSeparator: (base) => ({
    ...base,
    display: 'none',
  }),

  placeholder: (base) => ({
    ...base,
    color: '#363636',
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: '#363636',
    padding: 0,
    height: '17px',
    width: '17px',
  }),

  menuList: (base) => ({
    ...base,
    overFlow: 'hidden',
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#d63548' : '',
    '&:active': {
      backgroundColor: '#d63548',
    },
    '&:hover': {
      backgroundColor: '#f2d2d2',
    },
  }),

  valueContainer: (provided) => ({
    ...provided,
    textOverflow: 'ellipsis',
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'flex',
    height: 'inherit',
    flexWrap: 'nowrap',
  }),
};

export const getIsBetweenValues = (valueData, options) => {
  const Value1Options = [...options];
  if (valueData) {
    const indexValue = Value1Options.findIndex(
      (data) => data.value === valueData || data.id === valueData
    );
    if (indexValue >= 0) {
      Value1Options.splice(1, indexValue);
    }
  }
  return Value1Options;
};
export const segmentionState = (state) => state.segmentationApp;
