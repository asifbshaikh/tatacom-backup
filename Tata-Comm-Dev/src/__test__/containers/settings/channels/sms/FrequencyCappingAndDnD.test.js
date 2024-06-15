import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import FrequencyCappingAndDnD from 'containers/settings/channels/sms/FrequencyCappingAndDnD';
import { Suspense } from 'react';
import configureMockStore from 'redux-mock-store';

const countryListData = [
  {
    name: 'Andorra',
    phone_code: '376',
    country_code: 'AD',
  },
  {
    name: 'United Arab Emirates',
    phone_code: '971',
    country_code: 'AE',
  },
  {
    name: 'Afghanistan',
    phone_code: '93',
    country_code: 'AF',
  },
];

const connectors = [
  {
    inbox_id: 54,
    id: 54,
    avatar_url: '',
    channel_id: 54,
    name: 'Changed sender name',
    channel_type: 'Channel::TataSmsc',
    greeting_enabled: false,
    greeting_message: null,
    working_hours_enabled: false,
    enable_email_collect: true,
    csat_survey_enabled: false,
    enable_auto_assignment: true,
    out_of_office_message: null,
    working_hours: [
      {
        day_of_week: 0,
        closed_all_day: true,
        open_hour: null,
        open_minutes: null,
        close_hour: null,
        close_minutes: null,
        open_all_day: false,
      },
      {
        day_of_week: 1,
        closed_all_day: false,
        open_hour: 9,
        open_minutes: 0,
        close_hour: 17,
        close_minutes: 0,
        open_all_day: false,
      },
      {
        day_of_week: 2,
        closed_all_day: false,
        open_hour: 9,
        open_minutes: 0,
        close_hour: 17,
        close_minutes: 0,
        open_all_day: false,
      },
      {
        day_of_week: 3,
        closed_all_day: false,
        open_hour: 9,
        open_minutes: 0,
        close_hour: 17,
        close_minutes: 0,
        open_all_day: false,
      },
      {
        day_of_week: 4,
        closed_all_day: false,
        open_hour: 9,
        open_minutes: 0,
        close_hour: 17,
        close_minutes: 0,
        open_all_day: false,
      },
      {
        day_of_week: 5,
        closed_all_day: false,
        open_hour: 9,
        open_minutes: 0,
        close_hour: 17,
        close_minutes: 0,
        open_all_day: false,
      },
      {
        day_of_week: 6,
        closed_all_day: true,
        open_hour: null,
        open_minutes: null,
        close_hour: null,
        close_minutes: null,
        open_all_day: false,
      },
    ],
    timezone: 'UTC',
    callback_webhook_url: null,
    allow_messages_after_resolved: true,
    widget_color: null,
    website_url: null,
    hmac_mandatory: null,
    welcome_title: null,
    welcome_tagline: null,
    web_widget_script: null,
    website_token: null,
    selected_feature_flags: null,
    reply_time: null,
    phone_number: null,
    auth_token:
      'Basic dGNsLXRyaWFscG9zdG1hbnJlc3RkaXJlY3RteHByZWZlbnRlcnByaXNlOkJ0WFFmOXpF',
    medium: 'tata',
    sender_id: 'abcdef',
    sender_type: 'transactional',
    callback_url: '',
  },
];

describe('FrequencyCappingAndDnD component', () => {
  const mockStore = configureMockStore();

  it('render FrequencyCappingAndDnD without crashing', () => {
    const initialState = {
      settingsChannels: {
        countryList: countryListData,
        tataSMSConnectors: connectors,
      },
    };
    const store = mockStore(initialState);
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <FrequencyCappingAndDnD channelType="sms" store={store} />
        </Suspense>
      </CustomWrapper>
    );

    const text = getByText('FREQUENCY CAPPING');
    expect(text).toBeInTheDocument();
  });
});
