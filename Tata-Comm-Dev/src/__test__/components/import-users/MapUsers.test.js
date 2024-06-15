import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import MapUsers from 'components/import-user/MapUsers';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import { Suspense } from 'react';

describe('MapUsers component', () => {
  const mockObject = {
    headerKeys: [
      'Email',
      'Phone Number',
      'First Name',
      'Last Name',
      'Name',
      'Gender',
      'Birth Date',
      'Location',
      'Locale Country',
      'Locale Language',
      'Campaign Name',
    ],
    userDetails: [[], [], []],
    invalid: false,
    setInvalid: jest.fn(),
    getColumnAttributeListAction: jest.fn(),
    getImportUsersUploadDataAction: jest.fn(),
  };
  const initialState = {
    importusersApp: {
      selectUser: 'Anonymous',
      colAttributesList: {
        name: {
          name: 'Name',
          type: 'string',
        },
        email: {
          name: 'Email',
          type: 'string',
        },
        phone_number: {
          name: 'Phone Number',
          type: 'string',
        },
        pubsub_token: {
          name: 'Pubsub Token',
          type: 'string',
        },
        identifier: {
          name: 'Identifier',
          type: 'string',
        },
        last_activity_at: {
          name: 'Last Activity At',
          type: 'datetime',
        },
        first_name: {
          name: 'First Name',
          type: 'string',
        },
        gender: {
          name: 'Gender',
          type: 'string',
        },
        locale_country: {
          name: 'Locale Country',
          type: 'string',
        },
        birth_date: {
          name: 'Birth Date',
          type: 'datetime',
        },
        locale_language: {
          name: 'Locale Language',
          type: 'string',
        },
        location: {
          name: 'Location',
          type: 'string',
        },
        sms_subscription_status: {
          name: 'Sms Subscription Status',
          type: 'string',
        },
        first_seen: {
          name: 'First Seen',
          type: 'datetime',
        },
        ltv: {
          name: 'Ltv',
          type: 'integer',
        },
        last_seen: {
          name: 'Last Seen',
          type: 'datetime',
        },
        no_of_conversions: {
          name: 'No Of Conversions',
          type: 'integer',
        },
        no_of_sessions: {
          name: 'No Of Sessions',
          type: 'integer',
        },
        campaign_name: {
          name: 'Campaign Name',
          type: 'string',
        },
        publisher_name: {
          name: 'Publisher Name',
          type: 'string',
        },
        install_status: {
          name: 'Install Status',
          type: 'string',
        },
        uninstall_time: {
          name: 'Uninstall Time',
          type: 'datetime',
        },
        device_reinstall: {
          name: 'Device Reinstall',
          type: 'datetime',
        },
        user_reinstall: {
          name: 'User Reinstall',
          type: 'datetime',
        },
        push_opt_in_status: {
          name: 'Push Opt In Status',
          type: 'string',
        },
        web_push_subscription_page_url: {
          name: 'Web Push Subscription Page Url',
          type: 'string',
        },
        web_push_subscription_status: {
          name: 'Web Push Subscription Status',
          type: 'string',
        },
        last_known_city: {
          name: 'Last Known City',
          type: 'string',
        },
        last_known_country: {
          name: 'Last Known Country',
          type: 'string',
        },
        last_Known_pincode: {
          name: 'Last Known Pincode',
          type: 'string',
        },
        last_known_state: {
          name: 'Last Known State',
          type: 'string',
        },
        user_timezone_offset: {
          name: 'User Timezone Offset',
          type: 'string',
        },
        hard_bounce: {
          name: 'Hard Bounce',
          type: 'boolean',
        },
        spam: {
          name: 'Spam',
          type: 'boolean',
        },
        unsubscribe: {
          name: 'Unsubscribe',
          type: 'boolean',
        },
        advertising_identifier: {
          name: 'Advertising Identifier',
          type: 'string',
        },
        browser_details: {
          name: 'Browser Details',
          type: 'string',
        },
        google_advertising_id: {
          name: 'Google Advertising',
          type: 'integer',
        },
        mobile_user: {
          name: 'Mobile User',
          type: 'boolean',
        },
        last_name: {
          name: 'Last Name',
          type: 'string',
        },
        last_interaction_at: {
          name: 'Last Interaction At',
          type: 'datetime',
        },
        interaction_count: {
          name: 'Interaction Count',
          type: 'integer',
        },
        customer_id: {
          name: 'Customer Id',
          type: 'string',
        },
        data_sync_import_id: {
          name: 'Data Sync Import',
          type: 'integer',
        },
        middle_name: {
          name: 'Middle Name',
          type: 'string',
        },
        city: {
          name: 'City',
          type: 'string',
        },
        address: {
          name: 'Address',
          type: 'string',
        },
        country: {
          name: 'Country',
          type: 'string',
        },
      },
      loadedColAttributes: true,
      skippedColumns: [],
      segmentName: '',
      showSegmentName: true,
      colAttributeWithType: {
        2: {
          first_name: 'string',
        },
        3: {
          last_name: 'string',
        },
        4: {
          name: 'string',
        },
        5: {
          gender: 'string',
        },
        6: {
          birth_date: 'datetime',
        },
        7: {
          location: 'string',
        },
        8: {
          locale_country: 'string',
        },
        9: {
          locale_language: 'string',
        },
        10: {
          campaign_name: 'string',
        },
      },
      checkColumnAttributes: {
        0: {
          label: 'First Name',
          value: 'first_name',
          isdisabled: true,
          type: 'string',
        },
        1: {
          label: 'Custom',
          value: 'custom',
          isdisabled: false,
          type: 'string',
        },
      },
      selectedColumnType: {
        0: {
          label: 'Email',
          value: 'email',
          isdisabled: true,
          type: 'string',
        },
        1: {
          label: 'Phone Number',
          value: 'phone_number',
          isdisabled: true,
          type: 'string',
        },
        2: {
          label: 'First Name',
          value: 'first_name',
          isdisabled: true,
          type: 'string',
        },
        3: {
          label: 'Last Name',
          value: 'last_name',
          isdisabled: true,
          type: 'string',
        },
        4: {
          label: 'Name',
          value: 'name',
          isdisabled: true,
          type: 'string',
        },
        5: {
          label: 'Gender',
          value: 'gender',
          isdisabled: true,
          type: 'string',
        },
        6: {
          label: 'Birth Date',
          value: 'birth_date',
          isdisabled: true,
          type: 'datetime',
        },
        7: {
          label: 'Location',
          value: 'location',
          isdisabled: true,
          type: 'string',
        },
        8: {
          label: 'Locale Country',
          value: 'locale_country',
          isdisabled: true,
          type: 'string',
        },
        9: {
          label: 'Locale Language',
          value: 'locale_language',
          isdisabled: true,
          type: 'string',
        },
        10: {
          label: 'Campaign Name',
          value: 'campaign_name',
          isdisabled: true,
          type: 'string',
        },
      },
      customAttributeName: [],
    },
  };

  const mockStore = configureMockStore();

  it('render component to add segmentName', () => {
    const store = mockStore(initialState);
    const { getByText, getByTestId } = render(
      <CustomWrapper>
        <Suspense fallback="Loading">
          <MapUsers {...mockObject} store={store} />
        </Suspense>
      </CustomWrapper>
    );
    const mapColumnsText = getByText('Map Columns');

    const createSegment = getByTestId('createCutsomSegment');
    fireEvent.click(createSegment);
    const segmentNameField = getByTestId('segmentName');
    fireEvent.change(segmentNameField, { target: { value: 'Test' } });

    expect(mapColumnsText).toBeInTheDocument();
  });

  it('render component to skip columns and include columns', async () => {
    initialState.importusersApp.selectUser = 'Registered';
    initialState.importusersApp.skippedColumns = [2];

    const store = mockStore(initialState);
    const { getByText, getByTestId, getByRole } = render(
      <CustomWrapper>
        <Suspense fallback="Loading">
          <MapUsers {...mockObject} store={store} />
        </Suspense>
      </CustomWrapper>
    );
    const mapColumnsText = getByText('Map Columns');
    const skippedColumnsCheckBox = getByTestId('showSkippedColumns');
    fireEvent.click(skippedColumnsCheckBox);

    const skippedColumnsField = getByRole('heading', {
      name: /first name/i,
    });
    expect(skippedColumnsField).toBeInTheDocument();
    const inCludeColumn = getByText(/include the column/i);
    fireEvent.click(inCludeColumn);
    expect(inCludeColumn).toBeInTheDocument();
    expect(mapColumnsText).toBeInTheDocument();
  });
  it('render component skipColumns and to show No Data found', async () => {
    initialState.importusersApp.selectUser = 'Registered';
    initialState.importusersApp.skippedColumns = [];

    const store = mockStore(initialState);
    const { getByText, getByTestId } = render(
      <CustomWrapper>
        <Suspense fallback="Loading">
          <MapUsers {...mockObject} store={store} />
        </Suspense>
      </CustomWrapper>
    );
    const skippedColumnsCheckBox = getByTestId('showSkippedColumns');
    fireEvent.click(skippedColumnsCheckBox);
    expect(getByText('No data found')).toBeInTheDocument();
    fireEvent.click(skippedColumnsCheckBox);
    const SkipColumnCard = getByTestId(/last name/i);
    fireEvent.click(SkipColumnCard);
  });
  it('render component to show error message', async () => {
    mockObject.invalid = true;

    const store = mockStore(initialState);
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback="Loading">
          <MapUsers {...mockObject} store={store} />
        </Suspense>
      </CustomWrapper>
    );
    const errMessage = getByText('File name should not contain * and %.');
    expect(errMessage).toBeInTheDocument();
  });
  it('render component to select custom attribute', async () => {
    mockObject.invalid = true;

    const store = mockStore(initialState);
    const { getByLabelText, getByText } = render(
      <CustomWrapper>
        <Suspense fallback="Loading">
          <MapUsers {...mockObject} store={store} />
        </Suspense>
      </CustomWrapper>
    );
    const colNameField = getByLabelText('Email');
    fireEvent.change(colNameField, { target: { value: 'Custom' } });
    fireEvent.click(getByText('Custom'));
  });

  it('render component to change dataType', async () => {
    initialState.importusersApp.selectUser = 'Anonymous';
    mockObject.invalid = true;

    const store = mockStore(initialState);
    const { getByLabelText, getByTestId } = render(
      <CustomWrapper>
        <Suspense fallback="Loading">
          <MapUsers {...mockObject} store={store} />
        </Suspense>
      </CustomWrapper>
    );
    const colNameField = getByLabelText('First Name_selectType');
    fireEvent.change(colNameField, { target: { value: 'string' } });

    const createCustomSegment = getByTestId('createCustomSegment');
    fireEvent.click(createCustomSegment);
  });
});
