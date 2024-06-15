import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import SmsContentConfiguration from '../../../containers/campaigns/sms-campaign/SmsContentConfiguration';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';
import React from 'react';
import configureMockStore from 'redux-mock-store';

describe('SmsContentConfiguration component', () => {
  afterEach(cleanup);

  beforeEach(() => {
    return render(
      <CustomWrapper>
        <SmsContentConfiguration
          formSuccess={true}
          addContentConfiguration={jest.fn()}
          updateStepIndexAction={jest.fn()}
          channelType={'sms'}
          previous={jest.fn()}
          next={jest.fn()}
        />
      </CustomWrapper>
    );
  });

  it('handle default button click', async () => {
    const personalizedBtn = screen.getByTestId('default');
    fireEvent.click(personalizedBtn);
  });

  it('handle personalized button click', () => {
    const personalizedBtn = screen.getByTestId('personalized');
    fireEvent.click(personalizedBtn);
  });

  it('on change personalize Checkbox', () => {
    const smsOptOutCheckbox = screen.getByTestId('personalize');

    expect(smsOptOutCheckbox).not.toBeChecked();
    fireEvent.click(smsOptOutCheckbox);
    expect(smsOptOutCheckbox).toBeChecked();
  });

  it('on change tinyUrlConversion Checkbox', () => {
    const tinyUrlCheckbox = screen.getByTestId('tinyUrlConversion');
    expect(tinyUrlCheckbox).not.toBeChecked();
    fireEvent.click(tinyUrlCheckbox);
    expect(tinyUrlCheckbox).toBeChecked();
  });

  it('getDropDownValuesForSmsSender returns the correct list', () => {
    const smsSelectSender = screen.getByTestId('sms-select-sender');
    fireEvent.change(smsSelectSender, { target: { value: '09876567890' } });
  });

  it('getDropDownValuesForSmsCustomAttribute returns the correct list', () => {
    const smsSelectCustomAttribute = screen.getByTestId(
      'test-custom-attribute'
    );
    fireEvent.change(smsSelectCustomAttribute);
  });

  it('getDropDownValuesForSmsCustomAttribute returns the correct list', () => {
    const smsTextArea = screen.getByTestId('sms-texarea');
    fireEvent.change(smsTextArea, { target: { value: 'Test' } });
  });

  test('handleSubmit function works correctly', async () => {
    const smsSelectSender = screen.getByTestId('sms-select-sender');
    fireEvent.change(smsSelectSender, { target: { value: '09876567890' } });
    const smsTextArea = screen.getByTestId('sms-texarea');
    fireEvent.change(smsTextArea, { target: { value: 'Test' } });
    const nextBtn = screen.getByRole('button', {
      name: /next/i,
    });
    await act(async () => {
      fireEvent.click(nextBtn);
      expect(nextBtn).toBeValid();
    });
  });

  it('click Pervious button', async () => {
    const previousBtn = screen.getByRole('button', {
      name: /previous/i,
    });
    await act(async () => {
      fireEvent.click(previousBtn);
      await waitFor(() => {
        expect(previousBtn).toBeValid();
      });
    });
  });
});
describe('handle submit of form in content configuration', () => {
  const mockStore = configureMockStore();
  const insitialStateObj = {
    campaignsApp: {
      createCampaign: { contentConfiguration: {} },
      successAdd: true,
      errorAdd: { errorMsg: 'Invalid data' },
    },
    importusersApp: {
      colAttributesList: [
        {
          template_record_id: 80,
          template_id: '123455678932',
          sender_id: '12346677',
        },
      ],
    },
    settingsChannels: {
      tataSMSConnectors: [
        {
          inbox_id: 63,
          id: 63,
          channel_id: 63,
          name: 'Test',
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
              open_all_day: false,
            },
          ],
          timezone: 'UTC',

          auth_token: 'RkaXJlY3RteHByZWZlbnRlcnByaXNlOkJ0WFFmOXpF',
          medium: 'Test',
          sender_id: '12346677',
          sender_type: 'promotional',
          callback_url: '',
        },
      ],
    },
  };

  const mockData = {
    channelType: 'sms',
    smsSender: '12346677',
    templateRecordId: '80',
    message: 'Hello World http://wwww.google.com',
    actualMessage: 'Hello World http://wwww.google.com',
    personalize: false,
    tinyUrlConversion: false,
    templateCustomized: false,
    templateId: '123455678932',
    testUserAttribute: 'mobileNumber',
    testUserValue: '',
    personalisedParam: {
      fieldsArray: [],
    },
    defaultmessage: '',
  };
  it('handle submit function call and form success and form error functions', async () => {
    const initialState = { ...insitialStateObj };
    const store = mockStore(initialState);
    render(
      <CustomWrapper>
        <SmsContentConfiguration
          {...mockData}
          formSuccess={true}
          addContentConfiguration={jest.fn()}
          updateStepIndexAction={jest.fn()}
          channelType={'sms'}
          previous={jest.fn()}
          next={jest.fn()}
          store={store}
        />
      </CustomWrapper>
    );

    const nextBtn = screen.getByRole('button', {
      name: /next/i,
    });
    await act(async () => {
      fireEvent.click(nextBtn);
      expect(nextBtn).toBeValid();
    });
  });
});
