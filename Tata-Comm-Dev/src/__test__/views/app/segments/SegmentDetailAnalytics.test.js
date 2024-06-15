import { render } from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import SegmentDetailAnalytics from 'views/app/segments/SegmentDetailAnalytics';

describe('render SegmentDetailAnalytics component correctly', () => {
  const mockObj = {
    segAnalytics: {
      total_users: 0,
      reachable_users_count: 0,
      reachability_percentage: 0,
      by_channels: {
        sms_reachability: {
          reachable_users: 0,
          reachability_percentage: 0,
        },
        email_reachability: {
          reachable_users: 0,
          reachability_percentage: 0,
        },
        whatsapp_reachability: {
          reachable_users: 0,
          reachability_percentage: 0,
        },
        push_reachability: {
          reachable_users: 0,
          reachability_percentage: 0,
        },
      },
      last_refreshed_at: 1699848085,
    },

    segType: 'Filter',
  };

  test('render SegmentDetailAnalytics component when total users is 0 ', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SegmentDetailAnalytics {...mockObj} />
      </CustomWrapper>
    );
    const reachableUsers = getByText(/Total Users/i);
    expect(reachableUsers).toBeInTheDocument();
  });
});
