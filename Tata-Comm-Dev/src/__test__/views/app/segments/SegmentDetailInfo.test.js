import { render } from '@testing-library/react';
import moment from 'moment';
import { CustomWrapper } from 'test-utils';
import SegmentDetailInfo from 'views/app/segments/SegmentDetailInfo';

describe('SegmentDetailInfo component correctly', () => {
  const mockObj = {
    segDetails: {
      id: 186,
      name: 'US1390',
      type: 'File',
      created_on: 1699419229,
      source_type: 'Import Users',
      description:
        "created from file: Persistent is uploaded file_with_name 'US1391.csv' on 08 Nov 2023  4:53 am",
      last_run_at: 0,
    },

    segType: 'File',
  };

  test('render SegmentDetailInfo segType is File ', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SegmentDetailInfo {...mockObj} />
      </CustomWrapper>
    );
    const segmentTypeLabelText = getByText(/segment type/i);

    const createdOnLabelText = getByText(/created on/i);
    const createdOnValueText = getByText(
      moment.unix(1699419229).format('DD MMM YYYY h:mm a')
    );

    expect(segmentTypeLabelText).toBeInTheDocument();
    expect(createdOnLabelText).toBeInTheDocument();
    expect(createdOnValueText).toBeInTheDocument();
  });
  test('render SegmentDetailInfo segType is Filter and last run !=0 ', () => {
    const mockObj1 = {
      ...mockObj,
      segType: 'Filter',
      segDetails: { ...mockObj.segDetails, last_run_at: 1699419229 },
    };
    const { getByText } = render(
      <CustomWrapper>
        <SegmentDetailInfo {...mockObj1} />
      </CustomWrapper>
    );
    const segmentTypeLabelText = getByText(/segment type/i);

    expect(segmentTypeLabelText).toBeInTheDocument();
  });
});
