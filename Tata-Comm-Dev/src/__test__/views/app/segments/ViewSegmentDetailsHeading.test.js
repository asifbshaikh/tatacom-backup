import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ViewSegmentDetailsHeading from 'views/app/segments/ViewSegmentDetailsHeading';

describe('view segment details heading component', () => {
  const mockObj = {
    match: {
      path: '/app/accounts/45/segments/all-segments/segment-info/:segmentionId',
      url: '/app/accounts/45/segments/all-segments/segment-info/188',
      isExact: true,
      params: {
        segmentionId: '188',
      },
    },
    heading: 'Segment Info',
    segmentName: 'Test',
  };
  it('render without crashing', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ViewSegmentDetailsHeading {...mockObj} />
      </CustomWrapper>
    );

    const segmentText = getByText('Test');
    expect(segmentText).toBeInTheDocument();
  });
});
