import { describe, it } from '@jest/globals';
import {
  fireEvent,
  getByTestId,
  render,
  waitFor,
} from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import InboxFilterMenu from 'containers/inbox/InboxFilterMenu';

describe('ConvesrationNestedFilterModal component', () => {
  const mockObject = {
    listingFilter: {
      labels: ['all'],
    },
    setListingFilter: jest.fn(),
    listingFilterInbox: null,
    setListingFilterInbox: jest.fn(),
    listingFilterConversationType: null,
    setListingFilterConversationType: jest.fn(),
    getInboxAction: jest.fn(),
    conversationCleanAction: jest.fn(),
    setListingFilterPage: jest.fn(),
    advancedFiltersConversationFiltersAction: jest.fn(),
    getConversationFiltersActions: jest.fn(),
  };

  const mockStore = configureMockStore();

  const initialState = {
    inboxApp: {
      inboxes: [
        {
          id: 4,
          avatar_url: '',
          channel_id: 4,
          name: 'test',
          channel_type: 'Channel::WebWidget',
          greeting_enabled: false,
          greeting_message: '',
          working_hours_enabled: false,
          enable_email_collect: true,
          csat_survey_enabled: false,
          enable_auto_assignment: true,
          out_of_office_message: null,
          working_hours: [
            {
              day_of_week: 0,
              closed_all_day: true,
              open_hour: null,
              open_minutes: null,
              close_hour: null,
              close_minutes: null,
              open_all_day: false,
            },
            {
              day_of_week: 1,
              closed_all_day: false,
              open_hour: 9,
              open_minutes: 0,
              close_hour: 17,
              close_minutes: 0,
              open_all_day: false,
            },
            {
              day_of_week: 2,
              closed_all_day: false,
              open_hour: 9,
              open_minutes: 0,
              close_hour: 17,
              close_minutes: 0,
              open_all_day: false,
            },
            {
              day_of_week: 3,
              closed_all_day: false,
              open_hour: 9,
              open_minutes: 0,
              close_hour: 17,
              close_minutes: 0,
              open_all_day: false,
            },
            {
              day_of_week: 4,
              closed_all_day: false,
              open_hour: 9,
              open_minutes: 0,
              close_hour: 17,
              close_minutes: 0,
              open_all_day: false,
            },
            {
              day_of_week: 5,
              closed_all_day: false,
              open_hour: 9,
              open_minutes: 0,
              close_hour: 17,
              close_minutes: 0,
              open_all_day: false,
            },
            {
              day_of_week: 6,
              closed_all_day: true,
              open_hour: null,
              open_minutes: null,
              close_hour: null,
              close_minutes: null,
              open_all_day: false,
            },
          ],
          timezone: 'UTC',
          callback_webhook_url: null,
          allow_messages_after_resolved: true,
          widget_color: 'test',
          website_url: 'tesy',
          hmac_mandatory: false,
          welcome_title: 'Hi there',
          welcome_tagline: 'Wel come ',
          web_widget_script: 'sdf ',
          website_token: 'sdfd',
          selected_feature_flags: ['attachments', 'emoji_picker'],
          reply_time: 'in_a_few_minutes',
          hmac_token: 'df',
          pre_chat_form_enabled: false,
          pre_chat_form_options: {},
          continuity_via_email: true,
          phone_number: null,
        },
      ],
      loadedInboxes: true,
      folders: [
        {
          id: 178,
          name: 'test',
          filter_type: 'conversation',
          query: {
            payload: [
              {
                values: ['snoozed'],
                attribute_key: 'status',
                attribute_model: 'standard',
                filter_operator: 'equal_to',
              },
            ],
          },
          created_at: '2023-12-28T13:59:51.272Z',
          updated_at: '2023-12-28T13:59:51.272Z',
        },
      ],
      converstaionFiltersOptions: [
        {
          attribute_key: 'status',
          attribute_name: 'Status',
          input_type: 'multi_select',
          data_type: 'text',
          filter_operators: ['equal_to', 'not_equal_to'],
          attribute_type: 'standard',
        },
      ],
    },
  };
  const store = mockStore(initialState);

  it('load all conversations', async () => {
    const { getByRole } = render(
      <CustomWrapper>
        <InboxFilterMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const allConversation = getByRole('link', {
      name: /all conversations/i,
    });

    fireEvent.click(allConversation);
    expect(allConversation).toBeInTheDocument();
  });
  it('load mentioned conversations', async () => {
    const { getByRole } = render(
      <CustomWrapper>
        <InboxFilterMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const mentionHeading = getByRole('link', {
      name: /mentions/i,
    });

    fireEvent.click(mentionHeading);
    expect(mentionHeading).toBeInTheDocument();
  });
  it('click on filters to check applied conversation filters', async () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <InboxFilterMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const folder = getByTestId('folder_178');

    await waitFor(() => fireEvent.click(folder));

    expect(folder).toBeInTheDocument();
  });
  it('load all labels', async () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <InboxFilterMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const allLabels = getByTestId('labels_all');

    fireEvent.click(allLabels);
    expect(allLabels).toBeInTheDocument();
  });

  it('add new label modal and form submit', async () => {
    mockObject.listingFilterConversationType = 'mention';
    const { getByRole, getByTestId, getByText } = render(
      <CustomWrapper>
        <InboxFilterMenu {...mockObject} store={store} />
      </CustomWrapper>
    );

    const addInboxBtn = getByText(/add new label/i);

    fireEvent.click(addInboxBtn);
    await waitFor(() => {
      const labelNameField = getByTestId('labelName');
      fireEvent.change(labelNameField, { target: { value: 'demo' } });

      const labelDescription = getByTestId('labelDescription');
      fireEvent.change(labelDescription, { target: { value: 'test' } });
    });
    const createBtn = getByRole('button', {
      name: /create/i,
    });

    await waitFor(() => {
      fireEvent.click(createBtn);
    });
  });
});
