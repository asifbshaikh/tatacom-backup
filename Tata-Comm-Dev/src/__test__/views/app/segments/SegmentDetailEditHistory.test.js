import { render } from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import SegmentDetailEditHistory from 'views/app/segments/SegmentDetailEditHistory';

describe('SegmentDetailEditHistory component correctly', () => {
  const mockObj = {
    revHistoryData: [
      {
        edited_time: 1697266629,
        description: 'First Name contains Rahul',
      },
      {
        edited_time: 1697266489,
        description: 'First Name contains Rahul',
      },
      {
        edited_time: 1697266439,
        description: 'First Name contains Rahul',
      },
    ],

    segType: 'Filter',
  };

  test('render SegmentDetailEditHistory segType is Filter ', () => {
    const { getByText, getByRole } = render(
      <CustomWrapper>
        <SegmentDetailEditHistory {...mockObj} />
      </CustomWrapper>
    );
    const segmentRevision = getByText('Segment Revision');

    const revisedOnHeader = getByRole('columnheader', {
      name: /revised on/i,
    });

    expect(revisedOnHeader).toBeInTheDocument();
    expect(segmentRevision).toBeInTheDocument();
  });

  test('render SegmentDetailEditHistory segType is File with revHistoryData is null ', () => {
    const mockObj1 = { mockObj, segType: 'File', revHistoryData: null };
    const { getByRole } = render(
      <CustomWrapper>
        <SegmentDetailEditHistory {...mockObj1} />
      </CustomWrapper>
    );
    const totalUsersHeaderText = getByRole('columnheader', {
      name: /total users/i,
    });

    expect(totalUsersHeaderText).toBeInTheDocument();
  });
  test('render SegmentDetailEditHistory segType is File with revHistoryData with data ', () => {
    const mockObj2 = {
      mockObj,
      segType: 'File',
      revHistoryData: [
        {
          edited_time: 1699419295,
          operation: 'Replace Users',
          total_users: 0,
          added_users: 0,
          invalid_users: 0,
          removed_users: 0,
          status: 'Processing',
        },
      ],
    };
    const { getByRole } = render(
      <CustomWrapper>
        <SegmentDetailEditHistory {...mockObj2} />
      </CustomWrapper>
    );
    const invalidUsersHeaderText = getByRole('columnheader', {
      name: /invalid users/i,
    });

    expect(invalidUsersHeaderText).toBeInTheDocument();
  });
});
