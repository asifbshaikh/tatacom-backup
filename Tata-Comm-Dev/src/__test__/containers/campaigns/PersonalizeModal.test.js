import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import PersonalizeModal from 'containers/campaigns/PersonalizeModal';
import { act } from 'react-dom/test-utils';

describe('PersonalizeModal component', () => {
  const mockObject = {
    form: {
      setFieldValue: jest.fn(),
      values: {
        channelType: 'sms',
        smsSender: 'ddd',
        templateRecordId: '1',
        message: 'Welcome to Persistent {{name}}',
        actualMessage: 'Welcome to Persistent ',
        personalize: true,
        tinyUrlConversion: false,
        templateCustomized: true,
        templateId: '4322',
        testUserAttribute: 'mobileNumber',
        testUserValue: '',
        personalisedParam: {
          fieldsArray: [
            {
              key: '{name}',
              value: '',
              isAccepted: true,
            },
          ],
        },
      },
    },

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
    },
    modalOpen: true,
    toggleModal: jest.fn(),
    channelType: 'sms',
    getPersonalizedMsgAction: jest.fn(),
  };

  const mockObject1 = {
    form: {
      setFieldValue: jest.fn(),
      values: {
        channelType: 'sms',
        smsSender: 'ddd',
        templateRecordId: '1',
        message: 'Welcome {{name}}',
        actualMessage: 'Welcome',
        personalize: true,
        tinyUrlConversion: false,
        templateCustomized: true,
        templateId: '4322',
        testUserAttribute: 'mobileNumber',
        testUserValue: '',
        personalisedParam: {
          fieldsArray: [
            {
              key: '{name}',
              value: '',
              isAccepted: false,
            },
          ],
        },
      },
    },

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
    },
    modalOpen: true,
    toggleModal: jest.fn(),
    channelType: 'whatsapp',
    getPersonalizedMsgAction: jest.fn(),
  };

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <PersonalizeModal {...mockObject} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the component', () => {
    render(
      <CustomWrapper>
        <PersonalizeModal {...mockObject} />
      </CustomWrapper>
    );
    expect(screen.getByText('Personalise SMS')).toBeInTheDocument();
    screen.debug();
  });

  it('Ignore button click', async () => {
    render(
      <CustomWrapper>
        <PersonalizeModal {...mockObject} />
      </CustomWrapper>
    );
    expect(screen.getByText('Ignore')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ignore'));
  });

  it('Personalize Whatsapp and Accept btn click', async () => {
    render(
      <CustomWrapper>
        <PersonalizeModal {...mockObject1} />
      </CustomWrapper>
    );
    expect(screen.getByText('Accept')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Accept'));

    const userEventSelect = screen.getByTestId('select-user-event');
    fireEvent.change(userEventSelect, { target: { value: 'name' } });
  });

  it('Submit button click for sms', async () => {
    render(
      <CustomWrapper>
        <PersonalizeModal {...mockObject} />
      </CustomWrapper>
    );

    const userEventSelect = screen.getByTestId('select-user-event');
    fireEvent.change(userEventSelect, { target: { value: 'name' } });

    expect(screen.getByText('Done')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Done'));
  });

  it('Submit button click for whatsapp', async () => {
    render(
      <CustomWrapper>
        <PersonalizeModal {...mockObject1} />
      </CustomWrapper>
    );

    const userEventSelect = screen.getByTestId('select-user-event');
    fireEvent.change(userEventSelect, { target: { value: 'name' } });
    expect(screen.getByText('Done')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Done'));
  });

  it('Close button click', async () => {
    render(
      <CustomWrapper>
        <PersonalizeModal {...mockObject1} />
      </CustomWrapper>
    );

    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);
  });
});
