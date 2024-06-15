import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import SelectSource from 'components/s3-sftp/SelectSource';
import { act } from 'react-dom/test-utils';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import { createRef } from 'react';
import { createMemoryHistory } from 'history';

describe('CampaignTypeCard component', () => {
  const ref = createRef(null);
  const history = createMemoryHistory();

  const match = {
    path: 'app/accounts/1/segments/db-imports/upload/:importType',
    url: 'app/accounts/1/segments/db-imports/upload/audience',
    isExact: true,
    params: {
      importType: 'audience',
    },
  };

  const eventList = [
    {
      id: 2,
      name: 'App/Site Opened',
      displayed_name: 'App/Site Opened',
      description: 'App/Site Opened',
      category: 'custom',
      source: ['internal'],
      created_at: '2023-11-30T12:34:36.935Z',
      updated_at: '2023-11-30T12:34:36.935Z',
      property_name: 'ss',
      data_type: null,
      account_id: 1,
    },
    {
      id: 1,
      name: 'ss',
      displayed_name: 'ss',
      description: 'ss',
      category: 'custom',
      source: ['internal'],
      created_at: '2023-11-25T07:39:46.831Z',
      updated_at: '2023-11-25T07:39:46.831Z',
      property_name: 'ss',
      data_type: null,
      account_id: 1,
    },
  ];

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SelectSource userEventsList={eventList} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the component', () => {
    const { getByRole } = render(
      <CustomWrapper>
        <SelectSource userEventsList={eventList} />
      </CustomWrapper>
    );
  });

  it('click on event imports link', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SelectSource
          userEventsList={[]}
          importType="events"
          sourceType="database"
        />
      </CustomWrapper>
    );

    const eventImport = getByText('Event imports');
    fireEvent.click(eventImport);
    expect(eventImport).toBeInTheDocument();
  });

  it('handlePreviousBtnClick should be called when the previous button is clicked', () => {
    const previousMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <SelectSource
          previous={previousMock}
          userEventsList={[]}
          importType="events"
          sourceType="database"
        />
      </CustomWrapper>
    );

    const previousButton = getByText('Previous');

    act(() => {
      fireEvent.click(previousButton);
    });
    expect(previousMock).toBeCalledTimes(0);
  });

  it('next button click', () => {
    const nextMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <SelectSource
          userEventsList={[]}
          importType="events"
          sourceType="database"
        />
      </CustomWrapper>
    );

    const submitButton = getByText('Next');
    act(() => {
      fireEvent.click(submitButton);
    });

    expect(nextMock).toBeCalledTimes(0);
  });

  it('Create Event link click', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SelectSource
          userEventsList={[]}
          importType="events"
          sourceType="database"
        />
      </CustomWrapper>
    );

    const createEvent = getByText('+ Create Event');
    act(() => {
      fireEvent.click(createEvent);
    });
    const eventName = screen.getByText('Event Name');
    expect(eventName).toBeInTheDocument();
  });
});
