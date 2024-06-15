import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ListCreateSegmentHeading from 'views/app/segments/create-segment/widgets/ListCreateSegmentHeading';

describe('ListCreateSegmentHeading component', () => {
  const match = {
    url: '/app/accounts/20/segments/create-segment',
    path: '/app/accounts/20/segments/create-segment',
  };
  const mockObject = {
    heading: 'Test',
    segmentName: 'Name',
  };

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ListCreateSegmentHeading match={match} {...mockObject} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
