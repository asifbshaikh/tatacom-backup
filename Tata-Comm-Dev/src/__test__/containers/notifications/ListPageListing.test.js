import { describe, it } from '@jest/globals';
import { render, waitFor } from '@testing-library/react';
import ListPageListing from 'containers/notifications/ListPageListing';
import { CustomWrapper } from 'test-utils';

describe('ListPageListing component', () => {
  const mockProps = {
    items: [
      {
        id: 227,
        notification_type: 'conversation_assignment',
        push_message_title: '[Assigned to you] - #31 has been assigned to you',
        primary_actor_type: 'Conversation',
        primary_actor_id: 547,
        primary_actor: {
          additional_attributes: {
            mail_subject: 'test staging',
          },
          can_reply: true,
          channel: 'Channel::Email',
          contact_inbox: {
            id: 285,
            contact_id: 114,
            inbox_id: 79,
            source_id: 'abc@test.com',
            created_at: '2023-11-22T06:43:57.890Z',
            updated_at: '2023-11-22T06:43:57.890Z',
            hmac_verified: false,
            pubsub_token: 'hghgsd',
          },
          id: 31,
          inbox_id: 79,
          messages: [],
          meta: {
            hmac_verified: false,
          },
          status: 'resolved',
          custom_attributes: {},
          snoozed_until: null,
          unread_count: 0,
          agent_last_seen_at: 1704690351,
          contact_last_seen_at: 0,
          timestamp: 1703741628,
        },
        read_at: '2024-01-05T09:41:35.346Z',
        secondary_actor: null,
        user: {
          id: 49,
          name: 'test',
          available_name: 'test',
          avatar_url: '',
          type: 'user',
          availability_status: 'online',
          thumbnail: '',
        },
        created_at: 1703590524,
      },
    ],
    currentPage: 1,
    totalPage: 3,
    onChangePage: jest.fn(),
    setModalOpen: jest.fn(),
    setModalOpenDetails: jest.fn(),
  };

  it('Render ListPageListing', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <ListPageListing {...mockProps} />
      </CustomWrapper>
    );

    await waitFor(() => {
      const text = getByText('Conversation Assigned');
      expect(text).toBeInTheDocument();
    });
  });
});
