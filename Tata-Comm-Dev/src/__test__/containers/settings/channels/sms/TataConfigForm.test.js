import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import TataConfigForm from 'containers/settings/channels/sms/TataConfigForm';

const data = {
  "id": 12,
  "channel_id": 12,
  "name": "testttt",
  "channel_type": "Channel::TataSmsc",
  "timezone": "UTC",
  "phone_number": null,
  "auth_token": "Basic dGNsLXRyaWFscG9zdG1hbnJlc3RkaXJlY3RteHByZWZlbnRlcnByaXNlOkJ0WFFmOXpF",
  "medium": "tata",
  "sender_id": "232356",
  "sender_type": "promotional",
  "callback_url": ""
}

describe('TataConfigForm component', () => {
  it('render TataConfigForm without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <TataConfigForm />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('on chnage senderType dropdown', () => {
    render(
      <CustomWrapper>
        <TataConfigForm modalOpen={true} />
      </CustomWrapper>
    );
    const selector = screen.getByTestId("senderType");

    //default value should be tata
    expect(selector.value).toBe('promotional')
    fireEvent.change(selector, { target: { value: 'transactional' } })
    //onChange value should change
    expect(selector.value).toBe('transactional')
  });

  it('handle submit click of Edit Configuration', async () => {
    render(
      <CustomWrapper>
        <TataConfigForm modalOpen={true} formSuccess={true} editRow={data}/>
      </CustomWrapper>
    );

    //Edit Configuration screen
    expect(screen.getByText('Edit Configuration')).toBeInTheDocument();

    const senderType = screen.getByTestId("senderType");
    fireEvent.change(senderType, { target: { value: 'transactional' } })

    const senderName = screen.getByTestId("senderName");
    fireEvent.change(senderName, { target: { value: 'test' } })

    const senderID = screen.getByTestId("senderID");
    fireEvent.change(senderID, { target: { value: '1244' } })

    const APIKey = screen.getByTestId("APIKey");
    fireEvent.change(APIKey, { target: { value: 'test123' } })

    const callbackURL = screen.getByTestId("callbackURL");
    fireEvent.change(callbackURL, { target: { value: 'http://abc.com' } })

    const tataSubmitBtn = screen.getByTestId("tataSubmitBtn");
    fireEvent.click(tataSubmitBtn)

    expect(tataSubmitBtn).toBeInTheDocument();

  });

  it('handle submit click of Add new configuration', async () => {
    render(
      <CustomWrapper>
        <TataConfigForm modalOpen={true} formSuccess={true}  modalType="Add"/>
      </CustomWrapper>
    );

    //Add Configuration screen
    expect(screen.getByText('Add Configuration')).toBeInTheDocument();

    const senderType = screen.getByTestId("senderType");
    fireEvent.change(senderType, { target: { value: 'transactional' } })

    const senderName = screen.getByTestId("senderName");
    fireEvent.change(senderName, { target: { value: 'test' } })

    const senderID = screen.getByTestId("senderID");
    fireEvent.change(senderID, { target: { value: '1244' } })

    const APIKey = screen.getByTestId("APIKey");
    fireEvent.change(APIKey, { target: { value: 'test123' } })

    const callbackURL = screen.getByTestId("callbackURL");
    fireEvent.change(callbackURL, { target: { value: 'http://abc.com' } })

    const tataSubmitBtn = screen.getByTestId("tataSubmitBtn");
    fireEvent.click(tataSubmitBtn)

    expect(tataSubmitBtn).toBeInTheDocument();
  });
});