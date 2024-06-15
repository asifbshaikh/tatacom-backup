import { describe, it } from '@jest/globals';
import {
  fireEvent,
  getByTestId,
  render,
  waitFor,
} from '@testing-library/react';
import SendConversationModal from 'containers/inbox/SendConversationModal';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';

describe('SendConversation Modal component', () => {
  const mockObject = {
    modalOpen: true,
    toggleModal: jest.fn(),

    sendConversationCleanAction: jest.fn(),
    selectedConversation: {
      meta: {
        sender: {
          additional_attributes: {
            description: 'Sports',
            company_name: 'Mechatronics',
            social_profiles: {
              github: '',
              twitter: '',
              facebook: '',
              linkedin: '',
            },
          },
          availability_status: 'offline',
          email: 'advait_gawande@persistent.com',
          id: 61619,
          name: 'Advait',
          phone_number: '+919766994788',
          identifier: null,
          thumbnail:
            'https://www.gravatar.com/avatar/6847b2f52617bcb9dad9d5c9638006e3?d=404',
          custom_attributes: {},
          last_activity_at: 1703056765,
          first_name: 'Advait',
          middle_name: 'Vijay',
          last_name: 'Gawande',
          gender: 'male',
          birth_date: '2023-12-04T00:00:00.000Z',
          city: 'Pune',
          address: 'test',
          country: 'IN',
        },
        channel: 'Channel::Whatsapp',
        assignee: {
          id: 1,
          account_id: 1,
          availability_status: 'online',
          auto_offline: true,
          confirmed: true,
          email: 'roshan_dhabekar@persistent.com',
          available_name: 'roshan dhabekar',
          name: 'roshan dhabekar',
          role: 'administrator',
          thumbnail:
            'https://www.gravatar.com/avatar/13c0308a636e8a9876f2d36bc4dacdeb?d=404',
        },
        hmac_verified: false,
      },
      id: 122,
      messages: [
        {
          id: 765,
          content: 'Conversation was reopened by roshan dhabekar',
          account_id: 1,
          inbox_id: 97,
          conversation_id: 122,
          message_type: 2,
          created_at: 1703762830,
          updated_at: '2023-12-28T11:27:10.350Z',
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
            assignee_id: 1,
          },
        },
      ],
      account_id: 1,
      additional_attributes: {
        mail_subject: '',
      },
      agent_last_seen_at: 1703766374,
      assignee_last_seen_at: 1703766374,
      can_reply: false,
      contact_last_seen_at: 0,
      custom_attributes: {},
      inbox_id: 97,
      labels: [],
      muted: false,
      snoozed_until: null,
      status: 'open',
      timestamp: 1703762830,
      unread_count: 0,
    },
  };

  const mockStore = configureMockStore();

  const initialState = {
    inboxApp: {
      formSuccess: true,
      formError: { errorMsg: 'unhandled api' },
      formLoading: false,
    },
  };

  it('cancel button modal', async () => {
    const store = mockStore(initialState);

    const { getByRole } = render(
      <CustomWrapper>
        <SendConversationModal {...mockObject} store={store} />
      </CustomWrapper>
    );
    const modalHeader = getByRole('heading', {
      name: /send conversation transcript/i,
    });

    expect(modalHeader).toBeInTheDocument();

    const cancleBtn = getByRole('button', {
      name: /cancel/i,
    });
    fireEvent.click(cancleBtn);
  });
  it('form submit by selecting other email address checkbox', async () => {
    initialState.inboxApp.formSuccess = false;
    const store = mockStore(initialState);

    const { getByRole, getByText, getByTestId } = render(
      <CustomWrapper>
        <SendConversationModal {...mockObject} store={store} />
      </CustomWrapper>
    );
    const submitBtn = getByRole('button', {
      name: /submit/i,
    });
    await waitFor(() => fireEvent.click(submitBtn));
    expect(getByText('Type is required!')).toBeInTheDocument();

    const selectCheckBox = getByRole('radio', {
      name: /send the transcript to another email address/i,
    });

    fireEvent.click(selectCheckBox);

    await waitFor(() => {
      const emailField = getByTestId('otherEmailAddressEmail');
      fireEvent.change(emailField, { target: { value: 'test@gmail.com' } });
    });

    await waitFor(() => fireEvent.click(submitBtn));
  });
  it('form submit by selecting assigned agent checkbox', async () => {
    initialState.inboxApp.formSuccess = false;
    const store = mockStore(initialState);

    const { getByRole } = render(
      <CustomWrapper>
        <SendConversationModal {...mockObject} store={store} />
      </CustomWrapper>
    );
    const submitBtn = getByRole('button', {
      name: /submit/i,
    });

    const selectCheckBox = getByRole('radio', {
      name: /send the transcript to the assigned agent/i,
    });

    fireEvent.click(selectCheckBox);

    await waitFor(() => fireEvent.click(submitBtn));
  });
  it('form submit by selecting customer checkbox', async () => {
    initialState.inboxApp.formSuccess = false;
    const store = mockStore(initialState);

    const { getByRole } = render(
      <CustomWrapper>
        <SendConversationModal {...mockObject} store={store} />
      </CustomWrapper>
    );
    const submitBtn = getByRole('button', {
      name: /submit/i,
    });

    const selectCheckBox = getByRole('radio', {
      name: /send the transcript to the customer/i,
    });

    fireEvent.click(selectCheckBox);

    await waitFor(() => fireEvent.click(submitBtn));
  });
});
