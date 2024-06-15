import { describe, it } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ListPageHeading from 'containers/notifications/ListPageHeading';
import { CustomWrapper } from 'test-utils';

describe('ListPageHeading component', () => {
  const match = {
    url: 'app/accounts/20/notifications/list',
    path: 'app/accounts/20/notifications/list',
  };
  const mockProps = {
    heading: 'NOTIFICATIONS_PAGE.HEADER',
    pageSizes: [10, 20, 30],
    metaData: {
      unread_count: 1,
      count: 37,
      current_page: '1',
    },
    endIndex: 8,
    startIndex: 0,
    totalItemCount: 37,
  };
  it('Render ListPageHeading', async () => {
    const { getAllByText } = render(
      <CustomWrapper>
        <ListPageHeading match={match} {...mockProps} />
      </CustomWrapper>
    );

    await waitFor(() => {
      const text = getAllByText('Notifications')[0];
      expect(text).toBeInTheDocument();
    });
  });

  it('Display Options should be in the documents', async () => {
    mockProps.endIndex = 40;
    const { getByText } = render(
      <CustomWrapper>
        <ListPageHeading match={match} {...mockProps} />
      </CustomWrapper>
    );

    await waitFor(() => {
      fireEvent.click(getByText('Display Options'));
      expect(getByText('Display Options')).toBeInTheDocument();
    });
  });
});
