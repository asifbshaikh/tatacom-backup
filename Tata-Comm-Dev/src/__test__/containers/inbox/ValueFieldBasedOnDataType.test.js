import { describe, it } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ValueFieldBasedOnDataType from 'containers/inbox/ValueFieldBasedOnDataType';
import { CustomWrapper } from 'test-utils';

describe('valueFieldBasedOnDataType component', () => {
  const mockObject = {
    getErrorMessage: jest.fn(),
    form: { values: {}, setFieldValue: jest.fn() },
    filterValues: {
      attribute_key: 'status',
      filter_operator: 'equal_to',
      values: [],
      attribute_model: 'standard',
      data_type: 'text',
      input_type: 'multi_select',
    },
    index: 0,
    labels: [],
    inboxes: [],
    teams: [],
    agents: [
      {
        id: 52,
        account_id: 1,
        availability_status: 'offline',
        auto_offline: true,
        confirmed: true,
        email: 'advait_gawande@persistent.com',
        available_name: 'Advait Gawande PSL',
        name: 'Advait Gawande PSL',
        role: 'agent',
        thumbnail:
          'https://www.gravatar.com/avatar/6847b2f52617bcb9dad9d5c9638006e3?d=404',
      },
    ],
    campaigns: [],
    countryList: [],
  };
  it('inputType is multi_select', async () => {
    const { getByLabelText, getByText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByLabelText('multiSelect_0');
    fireEvent.change(valueField, { target: { value: 'all' } });
    await waitFor(() => fireEvent.click(getByText('All')));

    expect(valueField).toBeInTheDocument();
  });
  it('inputType is  search_box inputType', async () => {
    mockObject.filterValues.attribute_key = 'assignee_id';
    mockObject.filterValues.input_type = 'search_box';
    const { getByLabelText, getByText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByLabelText('searchBox_0');
    fireEvent.change(valueField, { target: { value: 52 } });
    await waitFor(() => fireEvent.click(getByText('Advait Gawande PSL')));
    expect(valueField).toBeInTheDocument();
  });

  it('inputType is empty ', async () => {
    mockObject.filterValues.attribute_key = 'display_id';
    mockObject.filterValues.input_type = '';
    const { getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByTestId('emptyInputValue_0');
    fireEvent.change(valueField, { target: { value: 'test' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is equal_to with invalidDate format', async () => {
    mockObject.filterValues.attribute_key = 'created_at';
    mockObject.filterValues.data_type = 'date';
    mockObject.filterValues.input_type = 'date';
    mockObject.filterValues.filter_operator = 'equal_to';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '28/12/2023' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is equal_to with valid dateformat ', async () => {
    mockObject.filterValues.attribute_key = 'created_at';
    mockObject.filterValues.data_type = 'date';
    mockObject.filterValues.input_type = 'date';
    mockObject.filterValues.filter_operator = 'equal_to';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '2023-12-28' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is not_equal_to with invalidDate format', async () => {
    mockObject.filterValues.attribute_key = 'created_at';
    mockObject.filterValues.data_type = 'date';
    mockObject.filterValues.input_type = 'date';
    mockObject.filterValues.filter_operator = 'not_equal_to';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '28/12/2023' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is not_equal_to with valid dateformat ', async () => {
    mockObject.filterValues.attribute_key = 'created_at';
    mockObject.filterValues.data_type = 'date';
    mockObject.filterValues.input_type = 'date';
    mockObject.filterValues.filter_operator = 'not_equal_to';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '2023-12-28' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is is_greater_than with invalidDate format', async () => {
    mockObject.filterValues.attribute_key = 'created_at';
    mockObject.filterValues.data_type = 'date';
    mockObject.filterValues.input_type = 'date';
    mockObject.filterValues.filter_operator = 'is_greater_than';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '28/12/2023' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is is_greater_than with valid dateformat ', async () => {
    mockObject.filterValues.attribute_key = 'created_at';
    mockObject.filterValues.data_type = 'date';
    mockObject.filterValues.input_type = 'date';
    mockObject.filterValues.filter_operator = 'is_greater_than';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '2023-12-28' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is is_less_than with invalidDate format', async () => {
    mockObject.filterValues.attribute_key = 'last_activity_at';
    mockObject.filterValues.filter_operator = 'is_less_than';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '28/12/2023' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is is_less_than with validDate format', async () => {
    mockObject.filterValues.attribute_key = 'last_activity_at';
    mockObject.filterValues.filter_operator = 'is_less_than';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '2023-12-28' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is date and filter_opertor is days_before', async () => {
    mockObject.filterValues.attribute_key = 'last_activity_at';
    mockObject.filterValues.filter_operator = 'days_before';
    const { getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByTestId('daysBefore_0');
    fireEvent.change(valueField, { target: { value: 1 } });
    expect(valueField).toBeInTheDocument();
  });

  it('inputType is empty and filter_opertor is empty with invaliDate format', async () => {
    mockObject.filterValues.attribute_key = 'last_activity_at';
    mockObject.filterValues.filter_operator = '';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '28/12/2023' } });
    expect(valueField).toBeInTheDocument();
  });
  it('inputType is empty and filter_opertor is empty with valiDate format', async () => {
    mockObject.filterValues.attribute_key = 'last_activity_at';
    mockObject.filterValues.filter_operator = '';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByPlaceholderText('Select Date');
    fireEvent.change(valueField, { target: { value: '2023-12-28' } });
    expect(valueField).toBeInTheDocument();
  });

  it('inputType plain_text', async () => {
    mockObject.filterValues.attribute_key = 'display_id';
    mockObject.filterValues.data_type = 'number';
    mockObject.filterValues.input_type = 'plain_text';
    const { getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByTestId('plainText_0');
    fireEvent.change(valueField, { target: { value: 'test' } });
    expect(valueField).toBeInTheDocument();
  });
  it('cover branch for inbox_id ', async () => {
    mockObject.filterValues.attribute_key = 'inbox_id';
    mockObject.filterValues.data_type = 'text';
    mockObject.filterValues.input_type = 'search_box';
    const { getByLabelText, getByText, getByRole, getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByLabelText('searchBox_0');
    expect(valueField).toBeInTheDocument();
  });
  it('cover branch for  labels', async () => {
    mockObject.filterValues.attribute_key = 'labels';
    mockObject.filterValues.data_type = 'text';
    mockObject.filterValues.input_type = 'multi_select';
    const { getByLabelText, getByText, getByRole, getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByLabelText('multiSelect_0');
    expect(valueField).toBeInTheDocument();
  });

  it('cover branch for team_id', async () => {
    mockObject.filterValues.attribute_key = 'team_id';
    mockObject.filterValues.data_type = 'number';
    mockObject.filterValues.input_type = 'search_box';
    const { getByLabelText, getByText, getByRole, getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByLabelText('searchBox_0');
    expect(valueField).toBeInTheDocument();
  });

  it('cover branch for campaign_id', async () => {
    mockObject.filterValues.attribute_key = 'campaign_id';
    const { getByLabelText, getByText, getByRole, getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByLabelText('searchBox_0');
    expect(valueField).toBeInTheDocument();
  });

  it('cover branch for browser_language', async () => {
    mockObject.filterValues.attribute_key = 'browser_language';
    const { getByLabelText, getByText, getByRole, getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByLabelText('searchBox_0');
    expect(valueField).toBeInTheDocument();
  });

  it('cover branch for country_code', async () => {
    mockObject.filterValues.attribute_key = 'country_code';
    const { getByLabelText, getByText, getByRole, getByTestId } = render(
      <CustomWrapper>
        <ValueFieldBasedOnDataType {...mockObject} />
      </CustomWrapper>
    );
    const valueField = getByLabelText('searchBox_0');
    expect(valueField).toBeInTheDocument();
  });
});
