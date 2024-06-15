import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import EmailContentConfiguration from 'containers/campaigns/email/EmailContentConfiguration';
import configureStore from 'redux-mock-store';
import templateDefaultData from 'data/templateDefaultData';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { flattenMessages } from 'helpers/Utils';
import EnLang from 'lang/entries/en-US';

describe('EmailContentCampaign component', () => {
  const mockStore = configureStore();
  const initialState = {
    campaignsApp: {
      formEmailCreation: {
        subject: 'Test Email',
        emailConnector: '1',
        senderName: 'Test',
        fromEmailAddress: 'test@test.com',
        replyToEmailAddress: 'test@test.com',
        testUserAttribute: 'emailId',
        testUserValue: '',
      },
    },
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <EmailContentConfiguration />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls next function and show Template Not Saved modal and hide on click of ok', async () => {
    const nextMock = jest.fn();
    const store = mockStore(initialState);
    render(
      <CustomWrapper>
        <EmailContentConfiguration
          next={nextMock}
          store={store}
          formRef={{ current: { setValues: jest.fn() } }}
        />
      </CustomWrapper>
    );
    fireEvent.click(screen.getByText('Choose'));
    fireEvent.click(screen.getByText('Next'));
    const modalContent = screen.getByText('Template Not Saved');
    expect(modalContent).toBeInTheDocument();
    const modalOkBtn = screen.getByText('Ok');
    await waitFor(() => {
      fireEvent.click(modalOkBtn);
      expect(modalContent).not.toBeInTheDocument();
    });
  });
  it('if template already selected it should not show the templates list', async () => {
    const nextMock = jest.fn();
    const newInitialState = {
      campaignsApp: {
        formEmailCreation: {
          subject: 'Test Email',
          emailConnector: '1',
          senderName: 'Test',
          fromEmailAddress: 'test@test.com',
          replyToEmailAddress: 'test@test.com',
          testUserAttribute: 'emailId',
          testUserValue: '',
        },
        emailTemplate: {
          success: true,
          id: '123',
          name: 'Example Template',
          body: '<p>Example Body</p>',
          design: templateDefaultData,
        },
        loading: false,
        emailCampaignTemplates: {
          totalCount: 1,
          savedTemplates: [
            {
              success: true,
              id: '123',
              name: 'Example Template',
              body: '<p>Example Body</p>',
              design: templateDefaultData,
            },
          ],
        },
        error: null,
        createCampaign: { selectAudience: {} },
      },
      settingsChannels: { tataEmailConnectors: [] },
      segmentationApp: { customSegmentationlist: [] },
    };
    const newstore = mockStore(newInitialState);
    render(
      <Provider store={newstore}>
        <IntlProvider
          locale="en"
          messages={flattenMessages(EnLang.messages)}
          onError={(err) => {
            err;
          }}
        >
          <EmailContentConfiguration
            next={nextMock}
            formRef={{ current: { setValues: jest.fn() } }}
          />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(await screen.findByText('Next'));
    expect(screen.queryByText('Choose')).toBeNull();
  });
  it('calls previous function when "Previous" button is clicked', () => {
    const previousMock = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <EmailContentConfiguration previous={previousMock} />
      </CustomWrapper>
    );
    fireEvent.click(getByText('Previous'));
    expect(previousMock).toHaveBeenCalled();
  });

  it('handles form submission correctly', async () => {
    const nextMock = jest.fn();
    const store = mockStore({
      campaignsApp: {
        stepIndex: 1,
        emailTemplate: { id: 123 },
      },
    });
    render(
      <CustomWrapper>
        <EmailContentConfiguration store={store} next={nextMock} />
      </CustomWrapper>
    );
    fireEvent.click(screen.getByText(/next/i));
  });
});
