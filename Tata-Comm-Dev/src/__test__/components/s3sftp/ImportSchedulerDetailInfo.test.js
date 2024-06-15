import { screen, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';
import configureMockStore from 'redux-mock-store';
import ImportSchedulerDetailInfo from 'components/s3-sftp/ImportSchedulerDetailInfo';

const commonProps = {};

const initialState = {
  s3sftpApp: {
    successSchedulerDetail: true,
    importSchedulerDetails: {
      id: 25,
      end_type: '',
      frequency: null,
      import_name: 'ppp',
      occurrences: null,
      schedule_type: 'as_soon_as_possible',
      segment_name: null,
      connection_name: 'db1',
      source_type: 'db',
      source_id: '6e57d685-c1fd-4265-afed-28067fd3d18d',
      status: 'initiated',
      table_name: 'a',
      time_zone: 'Asia/Calcutta',
      import_type: 'registered_audience',
      email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
      start_date: 1701148406,
      end_date: 0,
      deactivate: true,
      events_name: [],
      repeat_on_day_of_month: [],
      repeat_on_day_of_week: [],
      cron_expression: null,
      occurrence_count: 0,
      repeat_every: null,
      created_at: 1701148406,
      updated_at: 1701181644,
      run_at: 0,
      next_run_at: 0,
    },

    successImportListAdd: [
      {
        id: 2,
        account_id: 1,
        crm_cdp_schedule_detail_id: 25,
        folder_path: null,
        name: 'testing',
        processed_count: 5,
        synced_count: 2,
        created_at: 1701149966,
        updated_at: 1701149966,
        import_type: 'db',
        status: 'failed',
        file_key: null,
        failed_error: 'Error message',
        segment_name: 'Tester',
        total_rows: null,
        processed_rows: null,
      },
    ],

    loadingSchedulerDetail: false,
  },
};

const periodicState = {
  s3sftpApp: {
    successSchedulerDetail: true,
    importSchedulerDetails: {
      id: 25,
      end_type: '',
      frequency: null,
      import_name: 'ppp',
      occurrences: null,
      schedule_type: 'periodic',
      segment_name: null,
      connection_name: 'db1',
      source_type: 'db',
      source_id: '6e57d685-c1fd-4265-afed-28067fd3d18d',
      status: 'initiated',
      table_name: 'a',
      time_zone: 'Asia/Calcutta',
      import_type: 'anonymous_audience',
      email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
      start_date: 1701148406,
      end_date: 0,
      deactivate: true,
      events_name: [],
      repeat_on_day_of_month: [],
      repeat_on_day_of_week: [],
      cron_expression: null,
      occurrence_count: 0,
      repeat_every: null,
      created_at: 1701148406,
      updated_at: 1701181644,
      run_at: 0,
      next_run_at: 0,
    },

    successImportListAdd: [
      {
        id: 2,
        account_id: 1,
        crm_cdp_schedule_detail_id: 25,
        folder_path: null,
        name: 'testing',
        processed_count: 5,
        synced_count: 2,
        created_at: 1701149966,
        updated_at: 1701149966,
        import_type: 'db',
        status: 'failed',
        file_key: null,
        failed_error: 'Error message',
        segment_name: 'Tester',
        total_rows: null,
        processed_rows: null,
      },
    ],

    loadingSchedulerDetail: false,
  },
};

const periodicState1 = {
  s3sftpApp: {
    successSchedulerDetail: true,
    importSchedulerDetails: {
      id: 25,
      end_type: '',
      frequency: null,
      import_name: 'ppp',
      occurrences: null,
      schedule_type: 'periodic',
      segment_name: null,
      connection_name: 'db1',
      source_type: 'db',
      source_id: '6e57d685-c1fd-4265-afed-28067fd3d18d',
      status: 'initiated',
      table_name: 'a',
      time_zone: 'Asia/Calcutta',
      import_type: 'anonymous_audience',
      email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
      start_date: 1701148406,
      end_date: 0,
      deactivate: true,
      events_name: [],
      repeat_on_day_of_month: [],
      repeat_on_day_of_week: [],
      cron_expression: null,
      occurrence_count: 0,
      repeat_every: null,
      created_at: 1701148406,
      updated_at: 1701181644,
      run_at: 1701148406,
      next_run_at: 1701148406,
    },

    successImportListAdd: [
      {
        id: 2,
        account_id: 1,
        crm_cdp_schedule_detail_id: 25,
        folder_path: null,
        name: 'testing',
        processed_count: 5,
        synced_count: 2,
        created_at: 1701149966,
        updated_at: 1701149966,
        import_type: 'db',
        status: 'failed',
        file_key: null,
        failed_error: 'Error message',
        segment_name: 'Tester',
        total_rows: null,
        processed_rows: null,
      },
    ],

    loadingSchedulerDetail: false,
  },
};

const atSpecificTimeState = {
  s3sftpApp: {
    successSchedulerDetail: true,
    importSchedulerDetails: {
      id: 25,
      end_type: '',
      frequency: null,
      import_name: 'ppp',
      occurrences: null,
      schedule_type: 'at_specific_time',
      segment_name: null,
      connection_name: 'db1',
      source_type: 'db',
      source_id: '6e57d685-c1fd-4265-afed-28067fd3d18d',
      status: 'initiated',
      table_name: 'a',
      time_zone: 'Asia/Calcutta',
      import_type: 'event',
      email_ids: ['ss@ss.com', 'asdas@ad.com', 'asdas@asd.com'],
      start_date: 1701148406,
      end_date: 0,
      deactivate: true,
      events_name: ['User Login'],
      repeat_on_day_of_month: [],
      repeat_on_day_of_week: [],
      cron_expression: null,
      occurrence_count: 0,
      repeat_every: null,
      created_at: null,
      updated_at: null,
      run_at: 1701865726,
      next_run_at: 1701865726,
    },

    successImportListAdd: [
      {
        id: 2,
        account_id: 1,
        crm_cdp_schedule_detail_id: 25,
        folder_path: null,
        name: 'testing',
        processed_count: 5,
        synced_count: 2,
        created_at: 1701149966,
        updated_at: 1701149966,
        import_type: 'db',
        status: 'failed',
        file_key: null,
        failed_error: 'Error message',
        segment_name: 'Tester',
        total_rows: null,
        processed_rows: null,
      },
    ],

    loadingSchedulerDetail: false,
  },
};

const errorState = {
  s3sftpApp: {
    successSchedulerDetail: true,
    importSchedulerDetails: {},
    errorImportListAdd: { error: false, errorMsg: 'Error message' },
    successImportListAdd: [],
    loadingSchedulerDetail: false,
  },
};
const mockStore = configureMockStore();

const store = mockStore(initialState);
const storeError = mockStore(errorState);
const storePeriodic = mockStore(periodicState);
const storeSpecificTime = mockStore(atSpecificTimeState);
const storePeriodic1 = mockStore(periodicState1);

describe('ImportSchedulerDetailInfo component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ImportSchedulerDetailInfo {...commonProps} store={store} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the ImportSchedulerDetailInfo component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ImportSchedulerDetailInfo {...commonProps} store={store} />
      </CustomWrapper>
    );
  });

  it('renders the ImportSchedulerDetailInfo component with error state', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ImportSchedulerDetailInfo {...commonProps} store={storeError} />
      </CustomWrapper>
    );
  });

  it('renders the ImportSchedulerDetailInfo component with periodic import type', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ImportSchedulerDetailInfo {...commonProps} store={storePeriodic} />
      </CustomWrapper>
    );
  });

  it('renders the ImportSchedulerDetailInfo component with specific type import type', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ImportSchedulerDetailInfo {...commonProps} store={storeSpecificTime} />
      </CustomWrapper>
    );
  });

  it('renders the ImportSchedulerDetailInfo component with specific type import type', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ImportSchedulerDetailInfo {...commonProps} store={storeSpecificTime} />
      </CustomWrapper>
    );
  });

  it('renders the ImportSchedulerDetailInfo component with periodic import type and run time, next run time value exists', () => {
    const { getByText, getByTestId } = render(
      <CustomWrapper>
        <ImportSchedulerDetailInfo {...commonProps} store={storePeriodic1} />
      </CustomWrapper>
    );

    expect(getByTestId('edit-import-schedule')).toBeInTheDocument();
    expect(getByTestId('delete-import-schedule')).toBeInTheDocument();
    const editBtn = getByTestId('edit-import-schedule');
    const deleteBtn = getByTestId('delete-import-schedule');

    act(() => {
      fireEvent.click(editBtn);
    });

    act(() => {
      fireEvent.click(deleteBtn);
    });
  });
});
