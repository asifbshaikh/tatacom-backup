import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import WhatsAppFCAndDND from 'containers/settings/channels/whatsapp/WhatsAppFCAndDND';
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
    inbox_id: 155,
    id: 155,
    avatar_url: '',
    channel_id: 6,
    name: 'testwhatsapp 99999949440',
    channel_type: 'Channel::Whatsapp',
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
    phone_number: '+918177861650',
    provider_config: {
      api_key:
        'EAAVvpH5HjxUdsdsssddSDSDFKfjdDDUJH6TpfvLzm6mlndjcxUQkxmLnswKZBI7G8epDH4gsJp6LQ66btwpKGqYSsFK9gy1sM7U0R64cqZAsikUr6JoOt37oTlmDe6tPTresFmSaLmbSGHkvpAlRYngIa5ZCm8g6LM8t',
      waba_id: '13444346040',
      auth_key: 'LrxFNdjshdsdhjsddDDdSD6W',
      phone_number_id: '1888888888336',
    },
  },
];

describe('WhatsAppFCAndDND component', () => {
  const mockStore = configureMockStore();

  it('render WhatsAppFCAndDND without crashing', async () => {
    const initialState = {
      settingsChannels: {
        countryList: countryListData,
        tataEmailConnectors: connectors,
      },
    };
    const store = mockStore(initialState);
    const { getByText } = render(
      <CustomWrapper>
        <Suspense fallback={<div className="loading" />}>
          <WhatsAppFCAndDND channelType="email" store={store} />
        </Suspense>
      </CustomWrapper>
    );

    await waitFor(() => {
      const text = getByText('FREQUENCY CAPPING');
      expect(text).toBeInTheDocument();
    });
  });
});
