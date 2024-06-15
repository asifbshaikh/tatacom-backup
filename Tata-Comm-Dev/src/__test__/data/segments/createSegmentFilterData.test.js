import '@testing-library/jest-dom/extend-expect';
import {
  afterOptions,
  beforeOptions,
  dailyWhereHourDropDownOptions,
  dailyWhereTheHourOptions,
  dateTimeWeeklywherethedayOptions,
  dateTimeYearWhereTheMonthOptions,
  dateTimeYearWhereThedateOptions,
  dateTypeOptions,
  getDateInputStringDropDownOptions,
  getInitialValuesOfFilterType,
  getNumericValues,
  getStringInputDropDownOptions,
  getUserPropertyFieldList,
  getlastDropDownforWhereWeeklytheday,
  isExcludeUserSelected,
  onAndIsBetweenOptions,
  removeEmptyPropertyFromJson,
  weeklyAndMonthlyWhereTheDayOptions,
  weeklyWherethedayDropDownOptions,
  yearWhereTheDateOptions,
  yearWhereTheMonthDropDownOptions,
  yearWhereTheMonthOptions,
} from '../../../data/segments/createSegmentFilterData';

describe('getlastDropDownforWhereWeeklytheday', () => {
  it('returns options for weekly_where_the_day with text "is"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'weekly_where_the_day',
      'is'
    );
    expect(result).toEqual(dateTimeWeeklywherethedayOptions);
  });
  it('returns options for weekly_where_the_day with text "is_between"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'weekly_where_the_day',
      'is_between'
    );
    expect(result).toEqual(dateTimeWeeklywherethedayOptions);
  });
  it('returns options for weekly_where_the_day with text "exists"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'weekly_where_the_day',
      'exists'
    );
    expect(result).toEqual([]);
  });
  it('returns options for monthly_where_the_day with text "is"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'monthly_where_the_day',
      'is'
    );
    expect(result).toEqual(dateTimeWeeklywherethedayOptions);
  });
  it('returns options for monthly_where_the_day with text "is_between"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'monthly_where_the_day',
      'is_between'
    );
    expect(result).toEqual(dateTimeWeeklywherethedayOptions);
  });
  it('returns options for monthly_where_the_day with text "exists"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'monthly_where_the_day',
      'exists'
    );
    expect(result).toEqual([]);
  });
  it('returns options for yearly_where_the_month with text "is"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'yearly_where_the_month',
      'is'
    );
    expect(result).toEqual(dateTimeYearWhereTheMonthOptions);
  });
  it('returns options for yearly_where_the_month with text "is_between"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'yearly_where_the_month',
      'is_between'
    );
    expect(result).toEqual(dateTimeYearWhereTheMonthOptions);
  });
  it('returns options for yearly_where_the_month with text "exists"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'yearly_where_the_month',
      'exists'
    );
    expect(result).toEqual([]);
  });
  it('returns options for yearly_where_the_date with text "is"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'yearly_where_the_date',
      'is'
    );
    expect(result).toEqual(dateTimeYearWhereThedateOptions);
  });
  it('returns options for yearly_where_the_date with text "is_between"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'yearly_where_the_date',
      'is_between'
    );
    expect(result).toEqual(dateTimeYearWhereThedateOptions);
  });
  it('returns options for yearly_where_the_date with text "exists"', () => {
    const result = getlastDropDownforWhereWeeklytheday(
      'yearly_where_the_date',
      'exists'
    );
    expect(result).toEqual([]);
  });
  it('returns options for date with text "on"', () => {
    const result = getlastDropDownforWhereWeeklytheday('date', 'on');
    expect(result).toEqual(onAndIsBetweenOptions);
  });
  it('returns options for date with text "is_between"', () => {
    const result = getlastDropDownforWhereWeeklytheday('date', 'is_between');
    expect(result).toEqual(onAndIsBetweenOptions);
  });
  it('returns options for date with text "before"', () => {
    const result = getlastDropDownforWhereWeeklytheday('date', 'before');
    expect(result).toEqual(beforeOptions);
  });
  it('returns options for date with text "after"', () => {
    const result = getlastDropDownforWhereWeeklytheday('date', 'after');
    expect(result).toEqual(afterOptions);
  });
  it('returns options for date with text "exists"', () => {
    const result = getlastDropDownforWhereWeeklytheday('date', 'exists');
    expect(result).toEqual([]);
  });
  it('returns options for range and text ""', () => {
    const result = getlastDropDownforWhereWeeklytheday('', '');
    expect(result).toEqual([]);
  });
  it('returns options for getDateInputStringDropDownOptions daily_where_the_hour with operator "is" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'daily_where_the_hour',
      'is',
      ''
    );
    expect(result).toEqual(dailyWhereHourDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions daily_where_the_hour with operator "is_between" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'daily_where_the_hour',
      'is_between',
      ''
    );
    expect(result).toEqual(dailyWhereHourDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions daily_where_the_hour with operator "in_the_following" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'daily_where_the_hour',
      'in_the_following',
      ''
    );
    expect(result).toEqual(dailyWhereHourDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions daily_where_the_hour with operator "" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'daily_where_the_hour',
      '',
      ''
    );
    expect(result).toEqual([]);
  });
  it('returns options for getDateInputStringDropDownOptions weekly_where_the_day with operator "is" and compareOpertor with "day"', () => {
    const result = getDateInputStringDropDownOptions(
      'weekly_where_the_day',
      'is',
      'day'
    );
    expect(result).toEqual(weeklyWherethedayDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions weekly_where_the_day with operator "is" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'weekly_where_the_day',
      'is',
      ''
    );
    expect(result).toEqual(getNumericValues(7));
  });
  it('returns options for getDateInputStringDropDownOptions weekly_where_the_day with operator "is_between" and compareOpertor with "day"', () => {
    const result = getDateInputStringDropDownOptions(
      'weekly_where_the_day',
      'is_between',
      'day'
    );
    expect(result).toEqual(weeklyWherethedayDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions weekly_where_the_day with operator "is_between" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'weekly_where_the_day',
      'is_between',
      ''
    );
    expect(result).toEqual(getNumericValues(7));
  });
  it('returns options for getDateInputStringDropDownOptions weekly_where_the_day with operator "in_the_next" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'weekly_where_the_day',
      'in_the_next',
      ''
    );
    expect(result).toEqual(getNumericValues(7));
  });
  it('returns options for getDateInputStringDropDownOptions weekly_where_the_day with operator "in_the_last" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'weekly_where_the_day',
      'in_the_last',
      ''
    );
    expect(result).toEqual(getNumericValues(7));
  });
  it('returns options for getDateInputStringDropDownOptions weekly_where_the_day with operator "in_the_following" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'weekly_where_the_day',
      'in_the_following',
      ''
    );
    expect(result).toEqual(weeklyWherethedayDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions weekly_where_the_day with operator "" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'weekly_where_the_day',
      '',
      ''
    );
    expect(result).toEqual([]);
  });
  it('returns options for getDateInputStringDropDownOptions monthly_where_the_day with operator "is" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'monthly_where_the_day',
      'is',
      ''
    );
    expect(result).toEqual(getNumericValues(31));
  });
  it('returns options for getDateInputStringDropDownOptions monthly_where_the_day with operator "is_between" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'monthly_where_the_day',
      'is_between',
      ''
    );
    expect(result).toEqual(getNumericValues(31));
  });
  it('returns options for getDateInputStringDropDownOptions monthly_where_the_day with operator "in_the_next" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'monthly_where_the_day',
      'in_the_next',
      ''
    );
    expect(result).toEqual(getNumericValues(31));
  });
  it('returns options for getDateInputStringDropDownOptions monthly_where_the_day with operator "in_the_last" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'monthly_where_the_day',
      'in_the_last',
      ''
    );
    expect(result).toEqual(getNumericValues(31));
  });
  it('returns options for getDateInputStringDropDownOptions monthly_where_the_day with operator "in_the_following" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'monthly_where_the_day',
      'in_the_following',
      ''
    );
    expect(result).toEqual(getNumericValues(31));
  });
  it('returns options for getDateInputStringDropDownOptions monthly_where_the_day with operator "" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'monthly_where_the_day',
      '',
      ''
    );
    expect(result).toEqual([]);
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_month with operator "is" and compareOpertor with "month"', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_month',
      'is',
      'month'
    );
    expect(result).toEqual(yearWhereTheMonthDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_month with operator "is" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_month',
      'is',
      ''
    );
    expect(result).toEqual(getNumericValues(12));
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_month with operator "is_between" and compareOpertor with "month"', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_month',
      'is_between',
      'month'
    );
    expect(result).toEqual(yearWhereTheMonthDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_month with operator "is_between" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_month',
      'is_between',
      ''
    );
    expect(result).toEqual(getNumericValues(12));
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_month with operator "in_the_next" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_month',
      'in_the_next',
      ''
    );
    expect(result).toEqual(getNumericValues(12));
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_month with operator "in_the_last" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_month',
      'in_the_last',
      ''
    );
    expect(result).toEqual(getNumericValues(12));
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_month with operator "in_the_following" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_month',
      'in_the_following',
      ''
    );
    expect(result).toEqual(yearWhereTheMonthDropDownOptions);
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_month with operator "" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_month',
      '',
      ''
    );
    expect(result).toEqual([]);
  });
  it('returns options for getDateInputStringDropDownOptions "" with operator "" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions('', '', '');
    expect(result).toEqual([]);
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_date with operator "is" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_date',
      'is',
      ''
    );
    expect(result).toEqual(getNumericValues(365));
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_date with operator "is_between" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_date',
      'is_between',
      ''
    );
    expect(result).toEqual(getNumericValues(365));
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_date with operator "in_the_next" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_date',
      'in_the_next',
      ''
    );
    expect(result).toEqual(getNumericValues(365));
  });
  it('returns options for getDateInputStringDropDownOptions yearly_where_the_date with operator "in_the_last" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_date',
      'in_the_last',
      ''
    );
    expect(result).toEqual(getNumericValues(365));
  });

  it('returns options for getDateInputStringDropDownOptions yearly_where_the_date with operator "" and compareOpertor with ""', () => {
    const result = getDateInputStringDropDownOptions(
      'yearly_where_the_date',
      '',
      ''
    );
    expect(result).toEqual([]);
  });

  it('returns options for getNumericValues', () => {
    const result = getNumericValues(1);
    expect(result).toEqual([
      { id: '', value: 'CREATE_SEGMENT.SELECT_OPTION' },
      { id: '1', value: '1' },
    ]);
  });
  it('returns options for getStringInputDropDownOptions for daily_where_the_hour', () => {
    const result = getStringInputDropDownOptions('daily_where_the_hour');
    expect(result).toEqual(dailyWhereTheHourOptions);
  });
  it('returns options for getStringInputDropDownOptions for weekly_where_the_day', () => {
    const result = getStringInputDropDownOptions('weekly_where_the_day');
    expect(result).toEqual(weeklyAndMonthlyWhereTheDayOptions);
  });
  it('returns options for getStringInputDropDownOptions for monthly_where_the_day', () => {
    const result = getStringInputDropDownOptions('monthly_where_the_day');
    expect(result).toEqual(weeklyAndMonthlyWhereTheDayOptions);
  });
  it('returns options for getStringInputDropDownOptions for yearly_where_the_month', () => {
    const result = getStringInputDropDownOptions('yearly_where_the_month');
    expect(result).toEqual(yearWhereTheMonthOptions);
  });
  it('returns options for getStringInputDropDownOptions for yearly_where_the_date', () => {
    const result = getStringInputDropDownOptions('yearly_where_the_date');
    expect(result).toEqual(yearWhereTheDateOptions);
  });
  it('returns options for getStringInputDropDownOptions for date', () => {
    const result = getStringInputDropDownOptions('date');
    expect(result).toEqual(dateTypeOptions);
  });
  it('returns options for getInitialValuesOfFilterType for filter type "user_Property"', () => {
    const result = getInitialValuesOfFilterType('user_property');
    expect(result).toEqual({
      filter_type: 'user_property',
      data_type: '',
      category: '',
      name: '',
      value: '',
      operator: '',
    });
  });
  it('returns options for getUserPropertyFieldList for name', () => {
    const result = getUserPropertyFieldList('name');
    expect(result).toEqual([
      'operator',
      'compare_operator',
      'range',
      'value',
      'value1',
      'case_sensitive',
    ]);
  });
  it('returns options for getUserPropertyFieldList for name', () => {
    const result = getUserPropertyFieldList('operator');
    expect(result).toEqual(['compare_operator', 'value', 'value1']);
  });
  it('returns options for removeEmptyPropertyFromJson for empty values remove', () => {
    const result = removeEmptyPropertyFromJson({
      filter_operator: 'and',
      filters: [
        {
          filter_operator: 'or',
          filter_type: 'nested_filters',
          filters: [
            {
              filter_type: 'user_property',
              name: '',
              operator: 'is',
              value: 'test',
              case_sensitive: false,
              data_type: '',
              category: 'Lifecycle',
              displayed_name: 'User Creation Source',
            },
          ],
        },
      ],
    });
    expect(result).toEqual({
      filter_operator: 'and',
      filters: [
        {
          filter_operator: 'or',
          filter_type: 'nested_filters',
          filters: [
            {
              filter_type: 'user_property',
              operator: 'is',
              value: 'test',
              case_sensitive: false,
              category: 'Lifecycle',
              displayed_name: 'User Creation Source',
            },
          ],
        },
      ],
    });
  });
  it('returns options for isExcludeUserSelected for showCount payload without exclude users', () => {
    const dummyData = {
      audience_type: 'allUsers',
      exclude_users: false,
      included_filters: {
        filter_operator: 'and',
        filters: [
          {
            filter_operator: 'or',
            filter_type: 'nested_filters',
            filters: [
              {
                filter_type: 'all_users',
                name: 'All Users',
                id: 'digo_all_users',
              },
            ],
          },
        ],
      },
    };
    const result = isExcludeUserSelected(dummyData);
    expect(result).toEqual({
      included_filters: { ...dummyData.included_filters },
    });
  });
  it('returns options for isExcludeUserSelected for showCount payload with exclude users', () => {
    const dummyData = {
      audience_type: 'allUsers',
      exclude_users: true,
      included_filters: {
        filter_operator: 'and',
        filters: [
          {
            filter_operator: 'or',
            filter_type: 'nested_filters',
            filters: [
              {
                filter_type: 'all_users',
                name: 'All Users',
                id: 'digo_all_users',
              },
            ],
          },
        ],
      },
      excluded_filters: {
        filter_operator: 'and',
        filters: [
          {
            filter_operator: 'or',
            filter_type: 'nested_filters',
            filters: [
              {
                filter_type: 'filterByUsers',
              },
            ],
          },
        ],
      },
    };
    const result = isExcludeUserSelected(dummyData);
    expect(result).toEqual({
      included_filters: { ...dummyData.included_filters },
      excluded_filters: { ...dummyData.excluded_filters },
    });
  });
});
