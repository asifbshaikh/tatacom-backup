import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import FilterByUsers from 'components/create-segment/FilterByUsers';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';

describe('FilterByUsers component', () => {
  const mockContext = {
    getErrorMessageOfField: jest.fn(),
    cleanFieldValues: jest.fn(),
  };

  const form = {
    values: {
      included_filters: {
        filter_operator: createSegementEnums.INITIALVALUES.AND,
        filters: [
          {
            filter_operator: createSegementEnums.INITIALVALUES.OR,
            filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS,
            filters: [
              {
                filter_type: 'user_property',
                data_type: '',
                category: '',
                name: '',
                value: '',
                operator: '',
              },
            ],
          },
        ],
      },
    },
    setFieldValue: jest.fn(),
    setTouched: jest.fn(),
  };

  it('Filter BY users render user property and nested filter btn click', () => {
    const { getByLabelText, getByRole, getAllByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUsers
            form={form}
            filterIdentifier={'filters'}
            filterRootIdentifier={'included_filters'}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const createEventBtn = getByRole('button', {
      name: '+ Create Event',
    });
    const nestedFilterBtn = getByRole('button', {
      name: '+ Nested Filter',
    });
    const filterBtn = getByRole('button', {
      name: 'Filter',
    });
    const filterOpertorBtn = getByRole('button', {
      name: 'User Property',
    });
    fireEvent.click(createEventBtn);
    fireEvent.click(nestedFilterBtn);
    fireEvent.click(filterBtn);
    fireEvent.click(filterOpertorBtn);
    expect(createEventBtn).toBeInTheDocument();
    expect(nestedFilterBtn).toBeInTheDocument();
    expect(filterOpertorBtn).toBeInTheDocument();
    expect(filterBtn).toBeInTheDocument();
    expect(getByLabelText('userPropertyNameField')).toBeInTheDocument();
  });
  it('Filter BY users render user property and nested filter btn click with filter_operator is or', () => {
    form.values.included_filters.filter_operator =
      createSegementEnums.INITIALVALUES.OR;
    const { getByRole, getAllByRole } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUsers
            form={form}
            filterIdentifier={'filters'}
            filterRootIdentifier={'included_filters'}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );
    const nestedFilterBtn = getByRole('button', {
      name: '+ Nested Filter',
    });

    const filterBtn = getByRole('button', {
      name: 'Filter',
    });

    fireEvent.click(nestedFilterBtn);
    fireEvent.click(filterBtn);
    expect(nestedFilterBtn).toBeInTheDocument();
    expect(filterBtn).toBeInTheDocument();
  });
  it('Filter BY users click close button and filter type ', () => {
    const mockForm = {
      ...form,
      values: {
        ...form.values,
        included_filters: {
          ...form.values.included_filters,
          filters: [
            {
              filter_operator: createSegementEnums.INITIALVALUES.OR,
              filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS,
              filters: [
                {
                  filter_type: 'user_behavior',
                  data_type: '',
                  category: '',
                  name: '',
                  value: '',
                  operator: '',
                },
                {
                  filter_type: 'user_affinity',
                  data_type: '',
                  category: '',
                  name: '',
                  value: '',
                  operator: '',
                },
              ],
            },
            {
              filter_operator: createSegementEnums.INITIALVALUES.OR,
              filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS,
              filters: [
                {
                  filter_type: 'custom_segments',
                  data_type: '',
                  category: '',
                  name: '',
                  value: '',
                  operator: '',
                },
              ],
            },
          ],
        },
      },
    };
    const { getAllByRole, getByTestId, getByLabelText } = render(
      <CleanFieldValuesProvider.Provider value={mockContext}>
        <CustomWrapper>
          <FilterByUsers
            form={mockForm}
            filterIdentifier={'filters'}
            filterRootIdentifier={'included_filters'}
          />
        </CustomWrapper>
      </CleanFieldValuesProvider.Provider>
    );

    const closeBtn = getAllByRole('button', {
      name: 'x',
    });

    const nestedFilterCondition = getByTestId('nestedFilterCondition');
    const filterCondition = getByTestId('filterCondition');

    fireEvent.click(closeBtn[0]);
    fireEvent.click(closeBtn[1]);
    fireEvent.change(nestedFilterCondition, { target: { value: 'and' } });
    fireEvent.change(filterCondition, { target: { value: 'or' } });

    expect(closeBtn[0]).toBeInTheDocument();
    expect(closeBtn[1]).toBeInTheDocument();
    expect(nestedFilterCondition.value).toBe('or');
    expect(filterCondition.value).toBe('or');
    expect(getByLabelText('custom-segment-select')).toBeInTheDocument();
    expect(getByLabelText('userAffinityNameField')).toBeInTheDocument();
    expect(getByTestId('userBehaviorExecuted')).toBeInTheDocument();
  });
});
