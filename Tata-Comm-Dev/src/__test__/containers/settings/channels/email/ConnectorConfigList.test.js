import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import ConnectorConfigList from 'containers/settings/channels/email/ConnectorConfigList';

describe('ConnectorConfigList list component', () => {
  const mockStore = configureMockStore();
  const mockObj = {
    removeConnectorFromList: jest.fn(),
    data: [
      {
        inbox_id: 97,
        id: 97,
        avatar_url: '',
        channel_id: 61,
        name: 'Email',
        channel_type: 'Channel::Email',
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
        forward_to_email: 'ac7928eb76bu2y323jbja6729d1e15cd@',
        email: null,
        imap_email: '',
        imap_password: '',
        imap_address: '',
        imap_port: 0,
        imap_enabled: false,
        imap_enable_ssl: true,
        smtp_email: '',
        smtp_password: '',
        smtp_address: 'Test filter',
        smtp_port: 0,
        smtp_enabled: false,
        smtp_domain: '',
        smtp_enable_ssl_tls: false,
        smtp_enable_starttls_auto: true,
        smtp_openssl_verify_mode: 'none',
        smtp_auth_enable: false,
        maximum_send_rate: null,
        unsubscribe_setting: 'none',
        bounces_and_complaint_tracking: null,
        smtp_protocol: 'none',
        email_api_url: 'https://test.com',
        email_api_key:
          'xkeysib-f46c33bjhsjdghsgdhs76376823879823682363c0c68264d9-TjYF92vSWqVyLHBI',
      },
      {
        inbox_id: 98,
        id: 98,
        avatar_url: '',
        channel_id: 62,
        name: 'Email',
        channel_type: 'Channel::Email',
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
        forward_to_email: 'b015e7a4b15232233232rwerf86894114e@',
        email: null,
        imap_email: '',
        imap_password: '',
        imap_address: '',
        imap_port: 0,
        imap_enabled: false,
        imap_enable_ssl: true,
        smtp_email: '',
        smtp_password: '',
        smtp_address: 'email connector1',
        smtp_port: 0,
        smtp_enabled: false,
        smtp_domain: '',
        smtp_enable_ssl_tls: false,
        smtp_enable_starttls_auto: true,
        smtp_openssl_verify_mode: 'none',
        smtp_auth_enable: false,
        maximum_send_rate: null,
        unsubscribe_setting: 'none',
        bounces_and_complaint_tracking: null,
        smtp_protocol: 'none',
        email_api_url: 'https://test.com',
        email_api_key:
          'xkeysib-f46c33wjegjwgeuwehj8728366232nbhgsdhb3d7c0c68264d9-TjYF92vSWqVyLHBI',
      },
    ],
  };

  const insitialStateObj = {
    settingsChannels: {
      successRemove: true,
    },
  };

  it('open warning model to confirm delete of a channel', async () => {
    const store = mockStore(insitialStateObj);
    const { getAllByTestId, getByText } = render(
      <CustomWrapper>
        <ConnectorConfigList {...mockObj} store={store} />
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
        <ConnectorConfigList {...mockObj} store={store} />
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
        <ConnectorConfigList {...mockObj} store={store} />
      </CustomWrapper>
    );
    const editbtn = getAllByTestId('edit-button')[0];

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
