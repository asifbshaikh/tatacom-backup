import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import DurationFilterCriteria from 'components/create-segment/DurationFilterCriteria';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import { CustomWrapper } from 'test-utils';
import createSegementEnums from 'enums/createSegment/createSegementEnums';

describe('DurationFilterCriteria component', () => {
  const newDate = '2023-07-01';

  const mockContext = {
    cleanFieldValues: jest.fn(),
    getErrorMessageOfField: jest.fn(),
  };

  const match = {
    url: '/app/accounts/95/segments/create-segment',
    path: '/app/accounts/95/segments/create-segment',
  };

  const mockObject = {
    form: {
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      values: {
        primary_time_range: {
          period_unit: '',
          type: 'in_the_last',
          value: '',
        },
      },
    },
  };

  it('Render DurationFilterCriteria component with filterType userAffinity and Days label should be on UI', () => {
    const { getByTestId, getByText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DurationFilterCriteria
            match={match}
            durationFilterCriteriaValues={mockObject.form.values}
            durationFilterCriteriaIdentifier="primary_time_range"
            filterType="userAffinity"
            durationFilterIdentifier={
              createSegementEnums.IDENTIFIERS.PRIMARY_TIME_RANGE
            }
            {...mockObject}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const typeDropdownField = getByTestId('typeDropdown');
    fireEvent.change(typeDropdownField, { target: { value: 'on' } });
    expect(typeDropdownField).toBeInTheDocument();
    expect(getByText('Days')).toBeInTheDocument();
  });
  it('Render DurationFilterCriteria component with filterType userAffinity and Days label should be on UI', () => {
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DurationFilterCriteria
            match={match}
            durationFilterCriteriaValues={mockObject.form.values}
            durationFilterCriteriaIdentifier="primary_time_range"
            filterType="userBehavior"
            durationFilterIdentifier={
              createSegementEnums.IDENTIFIERS.PRIMARY_TIME_RANGE
            }
            {...mockObject}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    expect(getByTestId('typeDropdown')).toBeInTheDocument();
  });

  it('After changing operator value to "In Between" it should render two datepickers', async () => {
    mockObject.form.values.primary_time_range.type = 'in_between';
    mockObject.form.values.primary_time_range.period_unit = 'date';
    const { getAllByPlaceholderText, getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DurationFilterCriteria
            match={match}
            durationFilterCriteriaValues={mockObject.form.values}
            durationFilterCriteriaIdentifier="primary_time_range"
            filterType="userAffinity"
            durationFilterIdentifier={
              createSegementEnums.IDENTIFIERS.PRIMARY_TIME_RANGE
            }
            {...mockObject}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const value = getAllByPlaceholderText('Select Date')[0];
    const value1 = getAllByPlaceholderText('Select Date')[1];
    const periodUnitField = getByTestId('periodUnitDropDown');
    fireEvent.change(periodUnitField, { target: { value: 'date' } });

    fireEvent.change(value, { target: { value: '2022-07-01' } });
    fireEvent.blur(value);

    fireEvent.change(value1, { target: { value: '2022-07-02' } });
    fireEvent.blur(value1);

    expect(periodUnitField).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(value1).toBeInTheDocument();
  });

  it('After changing operator value to "before" it should render datepicker', async () => {
    mockObject.form.values.primary_time_range.type = 'before';
    mockObject.form.values.primary_time_range.period_unit = 'date';
    const { getAllByPlaceholderText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DurationFilterCriteria
            match={match}
            durationFilterCriteriaValues={mockObject.form.values}
            durationFilterCriteriaIdentifier="primary_time_range"
            filterType="userAffinity"
            durationFilterIdentifier={
              createSegementEnums.IDENTIFIERS.PRIMARY_TIME_RANGE
            }
            {...mockObject}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const value = getAllByPlaceholderText('Select Date')[0];
    fireEvent.change(value, { target: { value: '2022-07-01' } });
    expect(value).toBeInTheDocument();
  });

  it('After changing operator value to "In Between" it should render two datepickers and compare opertor "days ago"', async () => {
    mockObject.form.values.primary_time_range.type = 'in_between';
    mockObject.form.values.primary_time_range.period_unit = 'days_ago';
    const { getByTestId } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <DurationFilterCriteria
            match={match}
            durationFilterCriteriaValues={mockObject.form.values}
            durationFilterCriteriaIdentifier="primary_time_range"
            filterType="userAffinity"
            durationFilterIdentifier={
              createSegementEnums.IDENTIFIERS.PRIMARY_TIME_RANGE
            }
            {...mockObject}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    expect(getByTestId('valueFieldForDaysAgo')).toBeInTheDocument();
    expect(getByTestId('value1FieldForDaysAgo')).toBeInTheDocument();
  });
});
