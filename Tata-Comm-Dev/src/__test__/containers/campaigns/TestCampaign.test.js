import { describe, expect } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import TestCampaign from 'containers/campaigns/TestCampaign';
import React from 'react';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';

describe('TestCampaign component', () => {
  const mockStore = configureMockStore();
  const formRef = {
    values: {
      channelType: 'sms',
      smsSender: '',
      mediaLink: '',
      templateRecordId: '',
      category: '',
      message: '',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '1',
      testUserAttribute: 'mobileNumber',
      testUserValue: '+9189898989',
      personalisedParam: {
        fieldsArray: [],
      },
    },
    isValid: true,
  };

  const formRefCustom = {
    values: {
      channelType: 'whatsapp',
      smsSender: '',
      mediaLink: '',
      templateRecordId: '',
      category: '',
      message: '',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '',
      testUserAttribute: 'custom_segment',
      testUserValue: '',
      personalisedParam: {
        fieldsArray: [],
      },
    },
  };

  const formRefMobile = {
    values: {
      channelType: 'sms',
      smsSender: 'ddd',
      templateRecordId: '1',
      message: 'Welcome to Persistent',
      actualMessage: '',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '4322',
      testUserAttribute: 'mobileNumber',
      testUserValue: '+919898989898',
      personalisedParam: {
        fieldsArray: [],
      },
    },
    setFieldValue: jest.fn(),
    errors: {},
    touched: {},
  };

  const formRefEmail = {
    values: {
      channelType: 'whatsapp',
      smsSender: '',
      mediaLink: '',
      templateRecordId: '',
      category: '',
      message: '',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '',
      testUserAttribute: 'emailId',
      testUserValue: '',
      personalisedParam: {
        fieldsArray: [],
      },
    },
  };

  const commonParam = {
    channelType: 'sms',
    convertedPersonalizedMsg: 'converted personalized message',
    customSegmentationlist: [],
    getCustomSegmentListAction: jest.fn(),
    convertedMsg: 'converted message',
    handleOnChangeUserAttribute: jest.fn(),
    testCampaign: jest.fn(),
    testEmailCampaignAction: jest.fn(),
    getWAActionButton: [],
  };

  const initialState = {
    campaignsApp: {
      createCampaign: {
        selectAudience: { ...formRef.values },
      },
      formEmailCreation: {
        subject: 'important email',
        emailConnector: 'qwertyuiop',

        senderName: 'harry',
        fromEmailAddress: [],
        replyEmailAddress: [],
      },
      emailTemplate: {
        id: '1',
      },
    },
    segmentationApp: {
      customSegmentationlist: [{ label: 'test', value: 'test' }],
    },
  };
  const store = mockStore(initialState);

  it('get custom Attribute', () => {
    const { getByText, getByTestId, getByRole } = render(
      <CustomWrapper>
        <TestCampaign form={formRef} {...commonParam} store={store} />
      </CustomWrapper>
    );
    expect(getByText(/Test Campaign/i)).toBeInTheDocument();

    const testAttributeDropDown = getByTestId('test-custom-attribute');
    fireEvent.change(testAttributeDropDown, {
      target: { value: 'Mobile Number' },
    });
    const testBtn = getByRole('button', {
      name: 'Test',
    });
    fireEvent.click(testBtn);
    expect(testAttributeDropDown).toBeInTheDocument();
  });

  it('On Click of Test Submit Button', () => {
    formRef.values.testUserAttribute = 'emailId';
    formRef.values.testUserValue = 'test@gmail.com';
    const { getByRole } = render(
      <CustomWrapper>
        <TestCampaign form={formRef} {...commonParam} store={store} />
      </CustomWrapper>
    );
    const testBtn = getByRole('button', {
      name: 'Test',
    });
    fireEvent.click(testBtn);
  });

  it('get PlaceHolder label for Custom Segment', () => {
    formRef.values.testUserAttribute = 'custom_segment';
    formRef.values.testUserValue = 'test';
    const { getByRole, getByPlaceholderText } = render(
      <CustomWrapper>
        <TestCampaign form={formRef} {...commonParam} store={store} />
      </CustomWrapper>
    );
    const testBtn = getByRole('button', {
      name: 'Test',
    });
    fireEvent.click(testBtn);
    expect(getByPlaceholderText('Select Custom Segement'));
  });

  it('get PlaceHolder label for uniq Id', () => {
    formRef.values.testUserAttribute = '';
    formRef.values.testUserValue = '';
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <TestCampaign form={formRef} {...commonParam} store={store} />
      </CustomWrapper>
    );
    expect(getByPlaceholderText('Enter Unique ID'));
  });

  it('onClick test button for whatsapp channel type', () => {
    formRef.values.channelType = 'whatsapp';
    commonParam.channelType = 'whatsapp';
    formRef.values.testUserAttribute = 'mobileNumber';
    formRef.values.testUserValue = '+918989898989';
    const { getByRole } = render(
      <CustomWrapper>
        <TestCampaign form={formRef} {...commonParam} store={store} />
      </CustomWrapper>
    );

    const testBtn = getByRole('button', {
      name: 'Test',
    });
    fireEvent.click(testBtn);
    expect(testBtn).toBeInTheDocument();
  });
  it('onClick test button for email channel type', () => {
    formRef.values.channelType = 'email';
    commonParam.channelType = 'email';
    formRef.values.testUserAttribute = 'emailId';
    formRef.values.testUserValue = 'test@gmail.com';
    const { getByRole } = render(
      <CustomWrapper>
        <TestCampaign form={formRef} {...commonParam} store={store} />
      </CustomWrapper>
    );

    const testBtn = getByRole('button', {
      name: 'Test',
    });
    fireEvent.click(testBtn);

    expect(testBtn).toBeInTheDocument();
  });
});
