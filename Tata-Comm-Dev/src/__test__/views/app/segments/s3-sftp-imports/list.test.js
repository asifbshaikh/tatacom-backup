import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import S3SFTPUploadList from 'views/app/segments/s3-sftp-imports/list';
import { CustomWrapper } from 'test-utils';
import React, { Suspense } from 'react';
import configureMockStore from 'redux-mock-store';

describe('S3SFTP listing component', () => {
  const initialStore = {
    s3sftpApp: {
      pagination: {
        current_page: 1,
        prev_page: null,
        next_page: 2,
        total_pages: 5,
        limit_value: 2,
        total_count: 48,
      },
      importScheduler: [
        {
          id: 51,
          end_type: '',
          frequency: null,
          import_name: 'rrrr',
          occurrences: null,
          schedule_type: 'as_soon_as_possible',
          segment_name: null,
          connection_name: 'a',
          source_type: 'database',
          source_id: '47acb1ab-1c23-49df-9562-679b47b9241a',
          status: 'initiated',
          table_name: 'contacts',
          time_zone: 'Asia/Calcutta',
          import_type: 'registered_audience',
          email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
          start_date: 1701865726,
          end_date: 0,
          deactivate: false,
          events_name: [],
          repeat_on_day_of_month: [],
          repeat_on_day_of_week: [],
          cron_expression: null,
          occurrence_count: 0,
          repeat_every: null,
          created_at: 1701865672,
          updated_at: 1701865726,
          run_at: 0,
          next_run_at: 1701865726,
        },
        {
          id: 50,
          end_type: '',
          frequency: null,
          import_name: 'asdsad',
          occurrences: null,
          schedule_type: 'as_soon_as_possible',
          segment_name: null,
          connection_name: 'a',
          source_type: 'database',
          source_id: '47acb1ab-1c23-49df-9562-679b47b9241a',
          status: 'initiated',
          table_name: 'contacts',
          time_zone: 'Asia/Calcutta',
          import_type: 'registered_audience',
          email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
          start_date: 1701865455,
          end_date: 0,
          deactivate: false,
          events_name: [],
          repeat_on_day_of_month: [],
          repeat_on_day_of_week: [],
          cron_expression: null,
          occurrence_count: 0,
          repeat_every: null,
          created_at: 1701865455,
          updated_at: 1701865455,
          run_at: 0,
          next_run_at: 1701865455,
        },
        {
          id: 49,
          end_type: '',
          frequency: null,
          import_name: 'asdsad',
          occurrences: null,
          schedule_type: 'at_specific_time',
          segment_name: null,
          connection_name: 'devsetup-1',
          source_type: 'database',
          source_id: '5804e809-3f35-41a5-93eb-708852a17310',
          status: 'initiated',
          table_name: 'contacts',
          time_zone: 'Asia/Calcutta',
          import_type: 'registered_audience',
          email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
          start_date: 1701784560,
          end_date: 0,
          deactivate: false,
          events_name: [],
          repeat_on_day_of_month: [],
          repeat_on_day_of_week: [],
          cron_expression: null,
          occurrence_count: 0,
          repeat_every: null,
          created_at: 1701780970,
          updated_at: 1701780970,
          run_at: 0,
          next_run_at: 1701784560,
        },
        {
          id: 48,
          end_type: 'Never',
          frequency: 'daily',
          import_name: 'sdsd',
          occurrences: null,
          schedule_type: 'periodic',
          segment_name: null,
          connection_name: 'a',
          source_type: 'database',
          source_id: '47acb1ab-1c23-49df-9562-679b47b9241a',
          status: 'initiated',
          table_name: 'contacts',
          time_zone: 'Asia/Calcutta',
          import_type: 'registered_audience',
          email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
          start_date: 1701777180,
          end_date: 0,
          deactivate: false,
          events_name: [],
          repeat_on_day_of_month: [],
          repeat_on_day_of_week: [],
          cron_expression: '50 11  */7 * 0',
          occurrence_count: 0,
          repeat_every: 1,
          created_at: 1701777021,
          updated_at: 1701777052,
          run_at: 0,
          next_run_at: 1701777180,
        },
        {
          id: 47,
          end_type: '',
          frequency: null,
          import_name: 'asdsad',
          occurrences: null,
          schedule_type: 'as_soon_as_possible',
          segment_name: null,
          connection_name: 'dsad',
          source_type: 'database',
          source_id: '4c5f61b5-868d-476d-8325-b92c0ea90cbb',
          status: 'initiated',
          table_name: 'a',
          time_zone: 'Asia/Calcutta',
          import_type: 'registered_audience',
          email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
          start_date: 1701776904,
          end_date: 0,
          deactivate: false,
          events_name: [],
          repeat_on_day_of_month: [],
          repeat_on_day_of_week: [],
          cron_expression: null,
          occurrence_count: 0,
          repeat_every: null,
          created_at: 1701776904,
          updated_at: 1701776904,
          run_at: 0,
          next_run_at: 1701776904,
        },
        {
          id: 46,
          end_type: 'Never',
          frequency: 'daily',
          import_name: 'sdsd',
          occurrences: null,
          schedule_type: 'periodic',
          segment_name: null,
          connection_name: 'a',
          source_type: 'database',
          source_id: '47acb1ab-1c23-49df-9562-679b47b9241a',
          status: 'initiated',
          table_name: 'a',
          time_zone: 'Asia/Calcutta',
          import_type: 'registered_audience',
          email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
          start_date: 1701783900,
          end_date: 0,
          deactivate: false,
          events_name: [],
          repeat_on_day_of_month: [],
          repeat_on_day_of_week: [],
          cron_expression: '45 10 */1 * *',
          occurrence_count: 0,
          repeat_every: 2,
          created_at: 1701773108,
          updated_at: 1701776989,
          run_at: 0,
          next_run_at: 1701783900,
        },
      ],
      successImportDeleteAdd: { message: 'Success' },
    },
  };
  const mockStore = configureMockStore();

  const store = mockStore(initialStore);

  it('render without crashing', () => {
    const commonProps = {
      match: {
        url: '/app/accounts/3/segments/db-imports/list',
        path: '',
      },
    };
    const { asFragment } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <CustomWrapper>
            <S3SFTPUploadList {...commonProps} />
          </CustomWrapper>
        </Suspense>
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the component', () => {
    const commonProps = {
      match: {
        url: '/app/accounts/3/segments/db-imports/list',
        path: '',
      },
    };
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <CustomWrapper>
            <S3SFTPUploadList {...commonProps} store={store} />
          </CustomWrapper>
        </Suspense>
      </CustomWrapper>
    );

    expect(getByText('Event')).toBeInTheDocument();
    fireEvent.click(getByText('Events'));
  });

  it('click on Audience tab', () => {
    const commonProps = {
      match: {
        url: '/app/accounts/3/segments/db-imports/list',
        path: '',
      },
    };
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <CustomWrapper>
            <S3SFTPUploadList {...commonProps} store={store} />
          </CustomWrapper>
        </Suspense>
      </CustomWrapper>
    );

    fireEvent.click(screen.getAllByText('Audience')[1]);
    fireEvent.click(screen.getByText('15'));
  });

  it('handle page change', () => {
    const commonProps = {
      match: {
        url: '/app/accounts/3/segments/db-imports/list',
        path: '',
      },
    };
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <CustomWrapper>
            <S3SFTPUploadList {...commonProps} store={store} />
          </CustomWrapper>
        </Suspense>
      </CustomWrapper>
    );

    fireEvent.click(screen.getByText('15'));
    fireEvent.click(screen.getByText('3'));
  });
});
