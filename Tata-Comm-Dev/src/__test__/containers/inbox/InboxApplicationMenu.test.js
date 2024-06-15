import { describe, it } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import InboxApplicationMenu from 'containers/inbox/InboxApplicationMenu';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';

describe('ConvesrationNestedFilterModal component', () => {
  const mockObject = {
    changeConversationAction: jest.fn(),
    createConversationAction: jest.fn(),
    searchContactAction: jest.fn(),
    conversationCleanAction: jest.fn(),
    getConversationFiltersActions: jest.fn(),
    saveAdvancedConversationFiltersActions: jest.fn(),
    deleteCustomFiltersActions: jest.fn(),
    customFiltersCleanUp: jest.fn(),
    getConversationSearchListAction: jest.fn(),
    getConversationSearchListSuccessAction: jest.fn(),
    getConversationsNewwwAction: jest.fn(),
    handleConversationClick: jest.fn(),
    activeTab: 'me',
    toggleAppMenu: jest.fn(),
    listingFilter: '',
    listingFilterConversationType: '',
    listingFilterInbox: '',
    listingFilterStatus: 'open',
    setListingFilterStatus: jest.fn(),
    listingFilterPage: 1,
    setListingFilterPage: jest.fn(),
  };

  const mockStore = configureMockStore();

  const initialState = {
    chatApp: {
      contacts: [],
      allContacts: [],
      conversations: {},
      loadingConversations: false,
      loadingContacts: false,
      currentUser: '',
    },
    inboxApp: {
      conversations: {},
      inboxes: [],
      selectedConversationId: '',
      converstaionFiltersOptions: [],
      conversationFilters: {
        filters: [
          {
            attribute_key: 'status',
            filter_operator: 'equal_to',
            values: ['snoozed'],
            attribute_model: 'standard',
            data_type: 'text',
            input_type: 'multi_select',
          },
        ],
      },
      deleteCustomFiltersSuccess: false,
      deleteCustomFiltersError: { errorMsg: 'Invalid response' },
      savedCustomFilters: false,
      errorCustomFilter: { errorMsg: 'Invalid response' },
    },
    contactsApp: {
      conversationSearchList: {
        meta: {
          mine_count: 25,
          unassigned_count: 6,
          all_count: 25,
        },
        payload: [
          {
            id: 125,
            created_at: 1703757872,
            contact: {
              id: 61619,
              name: 'Advait',
            },
            inbox: {
              id: 97,
              name: 'Test1232',
              channel_type: 'Channel::Whatsapp',
            },
            messages: [
              {
                content: 'testing ',
                id: 764,
                sender_name: 'roshan dhabekar',
                message_type: 1,
                created_at: 1703757872,
              },
            ],
            account_id: 1,
          },
        ],
      },
    },
  };
  const store = mockStore(initialState);

  it('search conversastion and click on search recievd converstion', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const searchField = getByPlaceholderText(
      'Search for messages in conversation'
    );
    fireEvent.focus(searchField);
    fireEvent.change(searchField, { target: { value: 'tes' } });

    await waitFor(() => {
      const searchResultRecieved = getByTestId('searchResult_recieved_0');
      fireEvent.click(searchResultRecieved);
    });

    expect(searchField).toBeInTheDocument();
  });

  it('search conversastion and click on search sent converstion', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const searchField = getByPlaceholderText(
      'Search for messages in conversation'
    );
    fireEvent.focus(searchField);
    fireEvent.change(searchField, { target: { value: 'tes' } });

    await waitFor(() => {
      const searchResultSent = getByTestId('searchResult_sent_0');
      fireEvent.click(searchResultSent);
    });

    expect(searchField).toBeInTheDocument();
  });
  it('search conversastion for No result Found', async () => {
    initialState.contactsApp.conversationSearchList = {};

    const { getByPlaceholderText, getByText } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const searchField = getByPlaceholderText(
      'Search for messages in conversation'
    );
    fireEvent.focus(searchField);
    fireEvent.change(searchField, { target: { value: 'tes' } });

    await waitFor(() => {
      const noOptions = getByText('No results found.');
      fireEvent.click(noOptions);
    });

    expect(searchField).toBeInTheDocument();
  });

  it('Apply Filter Modal Open and apply filters and clear the filters', async () => {
    const { getByText, getByTestId } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const filterBtn = getByTestId('filter_conversations');
    fireEvent.click(filterBtn);
    fireEvent.keyDown(filterBtn, { key: 'Enter', code: 'Enter' });
    expect(getByText('Filter Conversations')).toBeInTheDocument();

    const clearFilter = getByTestId('clear_filters');
    fireEvent.click(clearFilter);
    fireEvent.keyDown(clearFilter, { key: 'Enter', code: 'Enter' });
  });

  it('savefilters modal open and save the filters', async () => {
    const { getByRole, getByTestId, getByText } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const saveFilter = getByTestId('save_filter');
    fireEvent.click(saveFilter);
    fireEvent.keyDown(saveFilter, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      const filternameField = getByTestId('converstionFilterName');
      fireEvent.change(filternameField, { target: { value: 'Test' } });
    });

    expect(getByText('Do you want to save this filter?')).toBeInTheDocument();

    const saveFilterBtn = getByRole('button', {
      name: /save filter/i,
    });
    fireEvent.click(saveFilterBtn);
  });

  it('savefilters modal open and cancel the saving filter', async () => {
    const { getByRole, getByTestId } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const saveFilter = getByTestId('save_filter');
    fireEvent.click(saveFilter);

    await waitFor(() => {
      const filternameField = getByTestId('converstionFilterName');
      fireEvent.change(filternameField, { target: { value: 'Test' } });
    });

    const cancelFilterBtn = getByRole('button', {
      name: /cancel/i,
    });
    fireEvent.click(cancelFilterBtn);
  });

  it('delete filter modal with confirm the filter', async () => {
    initialState.inboxApp.conversationFilters = {
      ...initialState.inboxApp.conversationFilters,
      id: 1,
      name: 'Test',
    };

    const { getByRole, getByTestId } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const deleteFilter = getByTestId('delete_filter');
    fireEvent.click(deleteFilter);

    await waitFor(() => {
      const deleteBtn = getByRole('button', { name: /Yes, Delete/i });
      fireEvent.click(deleteBtn);
    });
  });
  it('delete filter modal with cancel the delete filter', async () => {
    initialState.inboxApp.conversationFilters = {
      ...initialState.inboxApp.conversationFilters,
      id: 1,
      name: 'Test',
    };

    const { getByRole, getByTestId } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const deleteFilter = getByTestId('delete_filter');
    fireEvent.click(deleteFilter);

    await waitFor(() => {
      const deleteBtn = getByRole('button', { name: /No, Keep it/i });
      fireEvent.click(deleteBtn);
    });
  });

  it('filtering conversation by tab', async () => {
    initialState.inboxApp.conversationFilters = {};

    const { getByRole } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const tab = getByRole('link', {
      name: /unassigned/i,
    });
    expect(tab).toBeInTheDocument();

    fireEvent.click(tab);
  });

  it('clicking on the conversation from list', async () => {
    initialState.inboxApp.conversations = {
      meta: {
        mine_count: 0,
        unassigned_count: 0,
        all_count: 1,
      },
      payload: [
        {
          meta: {
            sender: {
              additional_attributes: {
                description: 'Test user',
                company_name: 'PSL',
                social_profiles: {
                  github: '',
                  twitter: '',
                  facebook: '',
                  linkedin: '',
                },
              },
              availability_status: 'offline',
              email: 'naga_amballa@persistent.com',
              id: 61738,
              name: 'Naga Sai Raj A',
              phone_number: '+918008242429',
              identifier: null,
              thumbnail:
                'https://www.gravatar.com/avatar/15a9aa9fd05ee8a031e9654df4462410?d=404',
              custom_attributes: {
                test: 'test attribute',
                roshan: '2023-12-15',
                fb_link_contact: 'http://testfb.com',
                available_status: true,
                contact_interested: 'One',
                contact_active_date: '1996-06-13',
              },
              last_activity_at: 1703241674,
              first_name: 'naga',
              middle_name: 'sai',
              last_name: 'raj',
              gender: '',
              birth_date: null,
              city: '',
              address: '',
              country: '',
            },
            channel: 'Channel::Whatsapp',
            assignee: {
              id: 55,
              account_id: 1,
              availability_status: 'offline',
              auto_offline: true,
              confirmed: true,
              email: 'tirouvengadaramanane@persistent.com',
              available_name: 'Tirouvengadaramanane',
              name: 'Tirouvengadaramanane',
              role: 'administrator',
              thumbnail:
                'https://www.gravatar.com/avatar/d532efd252cc90f129a0ad68b079ce70?d=404',
            },
            team: {
              id: 4,
              name: 'customer support',
              description: 'test',
              allow_auto_assign: true,
              account_id: 1,
              is_member: true,
            },
            hmac_verified: false,
          },
          id: 106,
          messages: [
            {
              id: 705,
              content: 'roshan dhabekar added test',
              account_id: 1,
              inbox_id: 97,
              conversation_id: 106,
              message_type: 2,
              created_at: 1703652637,
              updated_at: '2023-12-27T04:50:37.217Z',
              private: false,
              status: 'sent',
              source_id: null,
              content_type: 'text',
              content_attributes: {},
              sender_type: null,
              sender_id: null,
              external_source_ids: {},
              campaign_id: null,
              conversation: {
                assignee_id: 55,
              },
            },
          ],
          account_id: 1,
          additional_attributes: {
            mail_subject: '',
          },
          agent_last_seen_at: 1703756209,
          assignee_last_seen_at: 1703583464,
          can_reply: false,
          contact_last_seen_at: 0,
          custom_attributes: {
            contact_rating: '555',
            contact_linkedin_url: 'http://linked.com',
            available_status_conversation: true,
          },
          inbox_id: 97,
          labels: [],
          muted: false,
          snoozed_until: null,
          status: 'snoozed',
          timestamp: 1703652637,
          unread_count: 0,
        },
      ],
    };

    const { getByTestId } = render(
      <CustomWrapper>
        <InboxApplicationMenu {...mockObject} store={store} />
      </CustomWrapper>
    );
    const conversation = getByTestId('conversationList_0');
    fireEvent.click(conversation);

    expect(conversation).toBeInTheDocument();
  });
});
