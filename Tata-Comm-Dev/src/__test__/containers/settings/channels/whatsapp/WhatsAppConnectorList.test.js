import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import WhatsAppConnectorList from 'containers/settings/channels/whatsapp/WhatsAppConnectorList';

describe('WhatsAppConnectorList component', () => {
  const mockStore = configureMockStore();
  const mockObj = {
    removeWhatsAppChannelConnector: jest.fn(),
    data: [
      {
        inbox_id: 155,
        id: 155,
        avatar_url: '',
        channel_id: 6,
        name: 'testwhatsapp 90000003330',
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
        phone_number: '+91822222250',
        provider_config: {
          api_key:
            'EAAVvpH5HjxUBAPddsddd3455ZBI7G8epDH4gsJp6LQ66btwpKGqYSsFK9gy1sM7U0R64cqZAsikUr6JoOt37oTlmDe6tPTresFmSaLmbSGHkvpAlRYngIa5ZCm8g6LM8t',
          waba_id: '10774dsdd906040',
          auth_key: 'LrxFNsdDSDDDddfZ6W',
          phone_number_id: '11333333333336',
        },
      },
    ],
  };

  const insitialStateObj = {
    settingsChannels: {
      successWARemove: true,
    },
  };

  it('open warning model to confirm delete of a channel', async () => {
    const store = mockStore(insitialStateObj);
    const { getAllByTestId, getByText } = render(
      <CustomWrapper>
        <WhatsAppConnectorList {...mockObj} store={store} />
      </CustomWrapper>
    );
    const deleteBtn = getAllByTestId('delete-btn')[0];

    fireEvent.click(deleteBtn);
    await waitFor(() => {
      const Yestext = getByText('Yes, Delete');
      fireEvent.click(Yestext);

      expect(deleteBtn).toBeInTheDocument();
    });
  });

  it('open warning model to discard delete of a channel', async () => {
    const initialState = { ...insitialStateObj };
    const store = mockStore(initialState);
    const { getAllByTestId, getByText } = render(
      <CustomWrapper>
        <WhatsAppConnectorList {...mockObj} store={store} />
      </CustomWrapper>
    );
    const deleteBtn = getAllByTestId('delete-btn')[0];

    fireEvent.click(deleteBtn);
    await waitFor(() => {
      const Notext = getByText('No, Keep');
      fireEvent.click(Notext);

      expect(deleteBtn).toBeInTheDocument();
    });
  });

  it('close warning model on click of close icon', async () => {
    const initialState = { ...insitialStateObj };
    const store = mockStore(initialState);
    const { getAllByTestId, getByRole } = render(
      <CustomWrapper>
        <WhatsAppConnectorList {...mockObj} store={store} />
      </CustomWrapper>
    );
    const editbtn = getAllByTestId('edit-btn')[0];

    fireEvent.click(editbtn);
    await waitFor(() => {
      const SubmitText = getByRole('button', {
        name: /close/i,
      });
      fireEvent.click(SubmitText);

      expect(SubmitText).toBeInTheDocument();
    });
  });
});
