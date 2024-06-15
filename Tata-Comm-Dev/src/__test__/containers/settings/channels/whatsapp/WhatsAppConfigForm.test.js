import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import WhatsAppConfigForm from 'containers/settings/channels/whatsapp/WhatsAppConfigForm';

const data = {
  inbox_id: 155,
  id: 155,
  avatar_url: '',
  channel_id: 6,
  name: 'testwhatsapp 919994944940',
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
      'EAAVvpH5HjxdhHHDJDHsjhddHJSHJSHJSHsdsdsdknkk&8dnkadhask7dsjdhsjdhhjdshsdhjsdjbbg6LM8t',
    waba_id: '10000040',
    auth_key: 'LrxHDajshjasHDDJJDHJDxZ6W',
    phone_number_id: '11344434345336',
  },
};

const insitialStateObj = {
  settingsChannels: {
    successWAAdd: true,
  },
};

describe('WhatsAppConfigForm component', () => {
  it('on chnage providerSelect dropdown', () => {
    render(
      <CustomWrapper>
        <WhatsAppConfigForm modalOpen={true} />
      </CustomWrapper>
    );
    const selector = screen.getByTestId('providerSelect');

    //default value should be tata
    expect(selector.value).toBe('tata');
  });

  it('handle submit click of Edit Configuration', async () => {
    render(
      <CustomWrapper>
        <WhatsAppConfigForm
          modalOpen={true}
          formSuccess={true}
          editRow={data}
        />
      </CustomWrapper>
    );

    //Edit Configuration screen
    expect(screen.getByText('Edit Configuration')).toBeInTheDocument();

    const senderType = screen.getByTestId('name');
    fireEvent.change(senderType, { target: { value: 'test' } });

    const senderName = screen.getByTestId('phoneNumber');
    fireEvent.change(senderName, { target: { value: '9282673873' } });

    const senderID = screen.getByTestId('phoneNumberId');
    fireEvent.change(senderID, { target: { value: '+91' } });

    const APIKey = screen.getByTestId('apiKey');
    fireEvent.change(APIKey, { target: { value: 'test123' } });

    const callbackURL = screen.getByTestId('wabaId');
    fireEvent.change(callbackURL, { target: { value: 'test121' } });

    const authKey = screen.getByTestId('authKey');
    fireEvent.change(authKey, { target: { value: 'test121' } });

    const tataSubmitBtn = screen.getByTestId('tataSubmitBtn');
    fireEvent.click(tataSubmitBtn);

    expect(tataSubmitBtn).toBeInTheDocument();
  });

  it('handle submit click of Add new configuration', async () => {
    render(
      <CustomWrapper>
        <WhatsAppConfigForm
          modalOpen={true}
          formSuccess={true}
          modalType="Add"
          editRow={undefined}
        />
      </CustomWrapper>
    );

    //Add Configuration screen
    expect(screen.getByText('Add Configuration')).toBeInTheDocument();

    const senderType = screen.getByTestId('name');
    fireEvent.change(senderType, { target: { value: 'test' } });

    const senderName = screen.getByTestId('phoneNumber');
    fireEvent.change(senderName, { target: { value: '9282673873' } });

    const senderID = screen.getByTestId('phoneNumberId');
    fireEvent.change(senderID, { target: { value: '+91' } });

    const APIKey = screen.getByTestId('apiKey');
    fireEvent.change(APIKey, { target: { value: 'test123' } });

    const callbackURL = screen.getByTestId('wabaId');
    fireEvent.change(callbackURL, { target: { value: 'test121' } });

    const authKey = screen.getByTestId('authKey');
    fireEvent.change(authKey, { target: { value: 'test121' } });

    const tataSubmitBtn = screen.getByTestId('tataSubmitBtn');
    fireEvent.click(tataSubmitBtn);

    expect(tataSubmitBtn).toBeInTheDocument();
  });
});
