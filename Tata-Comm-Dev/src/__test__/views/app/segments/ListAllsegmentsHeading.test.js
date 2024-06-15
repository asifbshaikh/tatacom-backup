import { fireEvent, render, within } from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import ListAllsegmentsHeading from 'views/app/segments/ListAllsegmentsHeading';

describe('List All segments headings component', () => {
  const mockObj = {
    match: {
      path: '/app/accounts/45/segments/all-segments',
      url: '/app/accounts/45/segments/all-segments',
      isExact: true,
      params: {},
    },
    heading: 'ALL_SEGMENTS.LIST.ALL_SEGMENT_HEADER',
    toggleModal: jest.fn(),
    totalItemCount: 8,
    pageSizes: [10, 15, 20, 25],
    changePageSize: jest.fn(),
    selectedPageSize: 10,
    startIndex: 0,
    endIndex: 10,
  };
  test('render heading, buttons and nav links ', () => {
    const { getByRole, getByText } = render(
      <CustomWrapper>
        <ListAllsegmentsHeading {...mockObj} />
      </CustomWrapper>
    );

    const navigation = getByRole('navigation', {
      name: /breadcrumb/i,
    });

    within(navigation).getByRole('list');

    within(navigation).getByRole('link', {
      name: /segments/i,
    });
    within(navigation).getByRole('link', {
      name: /home/i,
    });

    const allSegmentText = getByRole('heading', {
      name: /all segments/i,
    });

    const displayOptionsBtn = getByText(/Display Options/i);

    fireEvent.click(displayOptionsBtn);

    const segmentBtn = getByRole('button', {
      name: /segments/i,
    });

    fireEvent.click(segmentBtn);

    expect(displayOptionsBtn).toBeInTheDocument();
    expect(segmentBtn).toBeInTheDocument();
    expect(allSegmentText).toBeInTheDocument();
  });
  test('render totalItemCount >= endIndex ? endIndex : totalItemCount branch ', () => {
    const mockObj1 = { ...mockObj, endIndex: 8 };
    const { getByText } = render(
      <CustomWrapper>
        <ListAllsegmentsHeading {...mockObj1} />
      </CustomWrapper>
    );
    const getTotalCount = getByText(/viewing/i);
    expect(getTotalCount).toBeInTheDocument();
  });
});
