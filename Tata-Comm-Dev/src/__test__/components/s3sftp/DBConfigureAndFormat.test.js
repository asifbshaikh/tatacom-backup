import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import DBConfigureAndFormat from 'components/s3-sftp/DBConfigureAndFormat';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';
import configureMockStore from 'redux-mock-store';

describe('DBConfigureAndFormat component', () => {
  const commonProps = {};
  const dbConnectionList = [
    [
      {
        id: '6e57d685-c1fd-4265-afed-28067fd3d18d',
        name: 'conn1',
      },
      {
        id: '4c5f61b5-868d-476d-8325-b92c0ea90cbb',
        name: 'a',
      },
      {
        id: '47acb1ab-1c23-49df-9562-679b47b9241a',
        name: 'asdas',
      },
    ],
  ];

  const previewData = {
    response: {
      data: {
        headers: [
          'id',
          'name',
          'created_at',
          'updated_at',
          'locale',
          'domain',
          'support_email',
          'settings_flags',
          'feature_flags',
          'auto_resolve_duration',
          'limits',
          'max_days_limit_for_events',
        ],
        rows: [
          {
            id: 3,
            name: 'ABC',
            created_at: '2023-07-27T12:42:26.914Z',
            updated_at: '2023-11-16T05:25:51.551Z',
            locale: 0,
            domain: '',
            support_email: 'Tring <accounts@tring.com>',
            settings_flags: 0,
            feature_flags: 2047,
            auto_resolve_duration: '',
            limits: '',
            max_days_limit_for_events: '',
          },
          {
            id: 4,
            name: 'XYZ',
            created_at: '2023-08-18T10:34:51.092Z',
            updated_at: '2023-08-18T10:34:51.092Z',
            locale: 0,
            domain: '',
            support_email: '',
            settings_flags: 0,
            feature_flags: 2047,
            auto_resolve_duration: '',
            limits: '',
            max_days_limit_for_events: '',
          },
          {
            id: 5,
            name: 'Test',
            created_at: '2023-08-18T10:39:32.872Z',
            updated_at: '2023-08-18T10:39:32.872Z',
            locale: 0,
            domain: '',
            support_email: '',
            settings_flags: 0,
            feature_flags: 2047,
            auto_resolve_duration: '',
            limits: '',
            max_days_limit_for_events: '',
          },
          {
            id: 6,
            name: 'QQQ',
            created_at: '2023-09-11T11:04:24.924Z',
            updated_at: '2023-09-11T11:04:24.924Z',
            locale: 0,
            domain: '',
            support_email: '',
            settings_flags: 0,
            feature_flags: 2047,
            auto_resolve_duration: '',
            limits: '',
            max_days_limit_for_events: '',
          },
          {
            id: 11,
            name: 'PQR',
            created_at: '2023-09-20T06:09:27.216Z',
            updated_at: '2023-09-20T06:09:27.216Z',
            locale: 0,
            domain: '',
            support_email: false,
            settings_flags: 0,
            feature_flags: 2047,
            auto_resolve_duration: { name: 'ABC', type: 'audience' },
            limits: null,
            max_days_limit_for_events: {},
          },
        ],
      },
    },
    payload: {
      db_preview: {
        import_name: 'sdsd',
        source_id: 'ce88b9d2-c15b-4010-b8f1-3241de80f97a',
        source_type: 'db',
        table_name: 'accounts',
      },
    },
  };

  const initialState = {
    s3sftpApp: {
      dbConnectionDropdownList: dbConnectionList,
      previewData: previewData,
      dataBaseFormat: {},
      errorTableAdd: { error: 'Error message' },
      successTableAdd: true,
      selectSource: {
        audienceType: 'registered_audience',
        eventSelect: [],
        importType: 'audience',
      },
    },
  };
  const mockStore = configureMockStore();

  const store = mockStore(initialState);

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DBConfigureAndFormat {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <DBConfigureAndFormat {...commonProps} />
      </CustomWrapper>
    );
    //check if the component renders the message
    expect(getByText('Import source')).toBeInTheDocument();
  });

  it('handlePreviousBtnClick should be called when the previous button is clicked', () => {
    const previousMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <DBConfigureAndFormat previous={previousMock} />
      </CustomWrapper>
    );

    const previousButton = getByText('Previous');

    act(() => {
      fireEvent.click(previousButton);
    });
    expect(previousMock).toHaveBeenCalled();
  });

  it('handleSubmit should be called when the form is submitted', () => {
    const nextMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <DBConfigureAndFormat next={nextMock} store={store} />
      </CustomWrapper>
    );

    const importName = screen.getByTestId('importName');
    fireEvent.change(importName, { target: { value: 'test' } });

    const dbConnection = screen.getByTestId('dbConnection');
    fireEvent.change(dbConnection, {
      target: { value: '6e57d685-c1fd-4265-afed-28067fd3d18d' },
    });

    const tableName = screen.getByTestId('tableName');
    fireEvent.change(tableName, { target: { value: '2' } });

    const emailID = screen.getByTestId('emailID');
    fireEvent.change(emailID, { target: { value: 'aaa@test.com,b@test.com' } });

    const submitButton = getByText('Next');
    act(() => {
      fireEvent.click(submitButton);
    });

    expect(nextMock).toBeCalledTimes(0);
  });

  it('handlePreviousBtnClick should be called when the previous button is clicked', () => {
    const previousMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <DBConfigureAndFormat previous={previousMock} store={store} />
      </CustomWrapper>
    );

    const previousButton = getByText('Previous');

    act(() => {
      fireEvent.click(previousButton);
    });
    expect(previousMock).toHaveBeenCalled();
  });

  it('Preview table should be shown when the Preview button is clicked', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <DBConfigureAndFormat store={store} />
      </CustomWrapper>
    );

    const importName = screen.getByTestId('importName');
    fireEvent.change(importName, { target: { value: 'test' } });

    const dbConnection = screen.getByTestId('dbConnection');
    fireEvent.change(dbConnection, {
      target: { value: '6e57d685-c1fd-4265-afed-28067fd3d18d' },
    });

    const tableName = screen.getByTestId('tableName');
    fireEvent.change(tableName, { target: { value: '2' } });

    const emailID = screen.getByTestId('emailID');
    fireEvent.change(emailID, { target: { value: 'aaa@test.com,b@test.com' } });

    const previewButton = getByText('Preview');

    fireEvent.click(previewButton);
    await waitFor(() => {
      const preview = screen.getByText('Showing Preview of top 5 rows');
      expect(preview).toBeInTheDocument();
    });
  });
});
