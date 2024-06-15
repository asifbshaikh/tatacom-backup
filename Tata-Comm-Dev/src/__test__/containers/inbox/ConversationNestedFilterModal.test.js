import { describe, it } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ConversationNestedFilterModal from 'containers/inbox/ConversationNestedFilterModal';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';

describe('ConvesrationNestedFilterModal component', () => {
  const mockObject = {
    filterIsOpen: true,
    setFilterIsOpen: jest.fn(),
    converstaionFiltersOptions: [
      {
        attribute_key: 'status',
        attribute_name: 'Status',
        input_type: 'multi_select',
        data_type: 'text',
        filter_operators: ['equal_to', 'not_equal_to'],
        attribute_type: 'standard',
      },
      {
        attribute_key: 'assignee_id',
        attribute_name: 'Assignee Name',
        input_type: 'search_box',
        data_type: 'text',
        filter_operators: [
          'equal_to',
          'not_equal_to',
          'contains',
          'does_not_contain',
          'is_present',
          'is_not_present',
        ],
        attribute_type: 'standard',
      },
    ],
    getConversationFiltersActions: jest.fn(),
    advancedFiltersConversationFiltersAction: jest.fn(),
    applyAdvancedFiltersCleanUp: jest.fn(),
  };
  const mockStore = configureMockStore();

  const initialState = {
    labelsApp: { labels: [] },
    inboxApp: {
      inboxes: [],
      conversationFilters: {},
      successAppliedFilters: true,
      errorAppliedFilters: { errorMsg: 'invalid payload' },
    },
    teamsApp: { teams: [] },
    agentsApp: {
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
    },
    campaignsApp: { campaigns: [] },
    settingsChannels: { countryList: [] },
  };
  const store = mockStore(initialState);

  it('close ConversationNestedFilterModal component', async () => {
    const { getByRole } = render(
      <CustomWrapper>
        <ConversationNestedFilterModal {...mockObject} store={store} />
      </CustomWrapper>
    );

    const cancelBtn = getByRole('button', { name: 'Cancel' });
    await waitFor(() => {
      fireEvent.click(cancelBtn);
    });
  });
  it('click on x to remove applied filter row', async () => {
    const { getByText, getByTestId } = render(
      <CustomWrapper>
        <ConversationNestedFilterModal {...mockObject} store={store} />
      </CustomWrapper>
    );

    const removeFilterRow = getByTestId('closeBtn_0');
    await waitFor(() => fireEvent.click(removeFilterRow));

    expect(getByText('Atleast need one filter')).toBeInTheDocument();
  });
  it('close ConversationNestedFilterModal on click of x button', async () => {
    const { getAllByText } = render(
      <CustomWrapper>
        <ConversationNestedFilterModal {...mockObject} store={store} />
      </CustomWrapper>
    );

    const toggleBtn = getAllByText(/×/i);
    await waitFor(() => {
      fireEvent.click(toggleBtn[0]);
    });
    expect(toggleBtn[0]).toBeInTheDocument();
  });

  it('remove added filter row form submit action', async () => {
    const { getByLabelText, getByText, getByRole, getByTestId } = render(
      <CustomWrapper>
        <ConversationNestedFilterModal {...mockObject} store={store} />
      </CustomWrapper>
    );

    const addFilterBtn = getByRole('button', {
      name: /\+ add filter/i,
    });
    await waitFor(() => fireEvent.click(addFilterBtn));

    const queryField = getByLabelText('queryOperator');
    fireEvent.change(queryField, { target: { value: 'or' } });
    await waitFor(() => fireEvent.click(getByText('Or')));

    const removeFilterRow = getByTestId('closeBtn_1');
    await waitFor(() => fireEvent.click(removeFilterRow));
  });
  it('simulate form submit action', async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <CustomWrapper>
        <ConversationNestedFilterModal {...mockObject} store={store} />
      </CustomWrapper>
    );

    const attributeField = getByLabelText('attributeName');
    fireEvent.change(attributeField, { target: { value: 'assignee_id' } });
    await waitFor(() => fireEvent.click(getByText('Assignee Name')));
    await waitFor(() => fireEvent.blur(attributeField));

    const filterOpertorField = getByLabelText('filterOperator');
    fireEvent.change(filterOpertorField, { target: { value: 'not_equal_to' } });
    await waitFor(() => fireEvent.click(getByText('Not Equal To')));

    const valueField = getByLabelText('searchBox_0');
    fireEvent.change(valueField, { target: { value: 52 } });
    await waitFor(() => fireEvent.click(getByText('Advait Gawande PSL')));

    const submitBtn = getByRole('button', { name: 'Submit' });
    await waitFor(() => fireEvent.click(submitBtn));
  });
});
