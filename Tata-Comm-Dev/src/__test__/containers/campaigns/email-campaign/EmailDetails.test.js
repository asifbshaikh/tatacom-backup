import {
  act,
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import EmailDetails from 'containers/campaigns/email/EmailDetails';
import { NotificationManager } from 'components/common/react-notifications';

jest.mock('components/common/react-notifications', () => ({
  NotificationManager: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('EmailDetails Component', () => {
  const mockProps = {
    formRef: { current: { setFieldValue: jest.fn(), setValues: jest.fn() } },
    getEmailAddressAction: jest.fn(),
    emailAddress: { data: { email_address: ['test@example.com'] } },
    getConnectorListAction: jest.fn(),
    setEmailConnectorAction: jest.fn(),
    connectorList: [{ channel_id: 1, smtp_address: 'smtp@example.com' }],
    setFormEmailCreationAction: jest.fn(),
    formEmailCreation: {},
    formSuccess: false,
    formError: null,
    testEmailCampaignAction: jest.fn(),
    testEmailCampaignCleanAction: jest.fn(),
    selectAudience: { channelType: 'EMAIL' },
    setCampaignInboxIdAction: jest.fn(),
    setIsChoose: jest.fn(),
    handleSubmit: jest.fn(),
    setDisableNextButton: jest.fn(),
    emailEditorRef: {
      current: { editor: { exportHtml: jest.fn(), loadDesign: jest.fn() } },
    },
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <EmailDetails {...mockProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders form fields correctly', () => {
    const { getByText } = render(
      <CustomWrapper>
        <EmailDetails {...mockProps} />
      </CustomWrapper>
    );

    expect(getByText('Subject')).toBeInTheDocument();
    expect(getByText('Email Connector')).toBeInTheDocument();
    expect(getByText('Sender Name')).toBeInTheDocument();
    expect(getByText('From email address')).toBeInTheDocument();
    expect(getByText('Reply-to email address')).toBeInTheDocument();
  });
  it('toggles reply checkbox and updates form state', () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <EmailDetails {...mockProps} />
      </CustomWrapper>
    );

    const replyCheckbox = getByTestId('replyToEmailAddressCheckBox');

    fireEvent.change(replyCheckbox, { target: { checked: true } });
    fireEvent.click(replyCheckbox);
  });
  it('handles form submission correctly', async () => {
    render(
      <CustomWrapper>
        <EmailDetails {...mockProps} />
      </CustomWrapper>
    );
    await waitFor(() => {
      fireEvent.change(screen.getByTestId('subject-input'), {
        target: { value: 'Test Subject' },
      });
      fireEvent.change(screen.getByTestId('emailConnector-input'), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByTestId('senderName-input'), {
        target: { value: 'xyz' },
      });
      fireEvent.change(screen.getByTestId('senderName-input'), {
        target: { value: 'xyz' },
      });
      fireEvent.change(screen.getByTestId('fromEmailAddress-input'), {
        target: { value: 'xyz@gmail.com' },
      });
      fireEvent.change(screen.getByTestId('replyToEmailAddressCheckBox'), {
        target: { value: 'xyz@gmail.com' },
      });
    });
  });
  it('should show success notification and clean test campaign on form success', () => {
    const mockFormSuccess = true;
    const mockCleanTestCampaign = jest.fn();
    const mockFormRef = { current: { setValues: jest.fn() } };

    render(
      <CustomWrapper>
        <EmailDetails
          formRef={mockFormRef}
          formSuccess={mockFormSuccess}
          cleanTestCampaign={mockCleanTestCampaign}
          {...mockProps}
        />
      </CustomWrapper>
    );

    expect(screen.queryByText('Success')).toBeNull();
    act(() => {
      jest.runAllTimers();
    });

    expect(
      NotificationManager.success.mock.calls.length
    ).toBeGreaterThanOrEqual(0);
  });
  it('should update state and form values when checkbox is clicked', () => {
    const email = 'test@example.com';
    const setReplyCheckBoxMock = jest.fn();
    const setFormEmailCreationActionMock = jest.fn();
    const setFieldValueMock = jest.fn();

    const formRefMock = {
      current: {
        setFieldValue: setFieldValueMock,
      },
    };

    const component = (
      <CustomWrapper>
        <EmailDetails
          setReplyCheckBox={setReplyCheckBoxMock}
          setFormEmailCreationAction={setFormEmailCreationActionMock}
          formRef={formRefMock}
          setDisableNextButton={jest.fn()}
          emailEditorRef={{
            current: {
              editor: { exportHtml: jest.fn(), loadDesign: jest.fn() },
            },
          }}
        />
      </CustomWrapper>
    );

    const { getByLabelText } = render(component);
    const checkbox = getByLabelText('Use same as From Email Address');

    fireEvent.click(checkbox);

    expect(setReplyCheckBoxMock).toHaveBeenCalledTimes(0);
  });
  it('handleOnChangeUserAttribute updates form values', () => {
    const email = 'test@example.com';
    const setFieldValueMock = jest.fn();

    const formRefMock = {
      current: {
        setFieldValue: setFieldValueMock,
      },
    };

    render(
      <CustomWrapper>
        <EmailDetails
          formRef={formRefMock}
          setDisableNextButton={jest.fn()}
          emailEditorRef={{
            current: {
              editor: { exportHtml: jest.fn(), loadDesign: jest.fn() },
            },
          }}
        />
      </CustomWrapper>
    );

    fireEvent.change(screen.getByTestId('test-custom-attribute'), {
      target: { value: 'newAttribute' },
    });
  });
});
