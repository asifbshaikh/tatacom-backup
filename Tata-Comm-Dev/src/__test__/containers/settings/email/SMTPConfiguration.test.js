import { fireEvent,render,screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import SMTPConfiguration from 'containers/settings/channels/email/SMTPConfiguration';

const data = {
  id:2,
  host_name: 'test',
  port: '5030',
  protocol: 'ssl',
  smtp_auth_enable: 'false',
  smtp_user_name: 'test@gmail.com',
  smtp_password: 'test123',
  maximum_send_rate: 10,
  unsubscribe_setting: 'none',
  unsubscribe_url: '',
  bounces_and_complaint_tracking: 'hi',
}

describe('SMTPConfiguration component', () => {
  it('render SMTPConfiguration without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SMTPConfiguration/>
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('handle submit click of Edit Configuration', async () => {
    render(
      <CustomWrapper>
        <SMTPConfiguration modalOpen={true} formSuccess={true} editRow={data}/>
      </CustomWrapper>
    );

    //Edit Configuration screen
    expect(screen.getByText('Edit Configuration')).toBeInTheDocument();

    const smtpAddress = screen.getByTestId("smtpAddress");
    fireEvent.change(smtpAddress, { target: { value: 'test' } })

    const apiKey = screen.getByTestId("apiKey");
    fireEvent.change(apiKey, { target: { value: 'abcxyz-2892982' } })

    const emailApiUrl = screen.getByTestId("emailApiUrl");
    fireEvent.change(emailApiUrl, { target: { value: 'https://api.test.com' } })


    const smtpSubmitBtn = screen.getByText("Submit");
    fireEvent.click(smtpSubmitBtn)

    expect(smtpSubmitBtn).toBeInTheDocument();

  });

  it('handle submit click of Add new configuration', async () => {
    render(
      <CustomWrapper>
        <SMTPConfiguration modalOpen={true} formSuccess={true}  modalType="Add"/>
      </CustomWrapper>
    );

    //Add Configuration screen
    expect(screen.getByText('Add Configuration')).toBeInTheDocument();

    const smtpAddress = screen.getByTestId("smtpAddress");
    fireEvent.change(smtpAddress, { target: { value: 'test' } })

    const apiKey = screen.getByTestId("apiKey");
    fireEvent.change(apiKey, { target: { value: 'abcxyz-2892982' } })

    const emailApiUrl = screen.getByTestId("emailApiUrl");
    fireEvent.change(emailApiUrl, { target: { value: 'https://api.test.com' } })


    const smtpSubmitBtn = screen.getByText("Submit");
    fireEvent.click(smtpSubmitBtn)

    expect(smtpSubmitBtn).toBeInTheDocument();
  });

});