import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import FrequencyCapping from 'containers/settings/channels/sms/FrequencyCapping';
import configureMockStore from 'redux-mock-store';

const connectorData = [
  {
    id: '',
    value: '',
  },
  {
    id: '35',
    value: '35',
  },
  {
    id: '232377',
    value: '232377',
  },
];

const data = {
  id: 35,
  account_id: 95,
  inbox_id: 105,
  fc_enabled: true,
  dnd_enabled: true,
  channel_type: 'Channel::TataSmsc',
  max_message: 3,
  no_of_days: 1,
  refresh_timezone: 'app_timezone',
  allow_in_dnd_period: false,
  save_and_send_criteria: 'send_all',
  message_queue: 'last_in_first_out',
  control_queue: false,
  control_queue_gap: 0,
  fc_dnd_setting_countries: [],
};

const userData = {
  ...data,
  fc_enabled: true,
};

describe('FrequencyCapping component', () => {
  const mockStore = configureMockStore();

  it('render FC without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <FrequencyCapping connectorDropDownData={connectorData} fcList={data} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('connectorDropdown to be in the doc', () => {
    render(
      <CustomWrapper>
        <FrequencyCapping connectorDropDownData={connectorData} fcList={data} />
      </CustomWrapper>
    );
    const connectorDropdown = screen.getByTestId('connectorDropdown');
    expect(connectorDropdown).toBeInTheDocument();
  });

  it('render FC form after selecting the connector', async () => {
    render(
      <CustomWrapper>
        <FrequencyCapping
          connectorDropDownData={connectorData}
          fcList={data}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorDropdown = screen.getByTestId('connectorDropdown');
    fireEvent.change(connectorDropdown, { target: { value: '35' } });
    const switchBtn = await screen.findByTestId('toggleFC');
    fireEvent.click(switchBtn);
    const emailCount = screen.getByTestId('emailCount');
    expect(emailCount).toBeInTheDocument();
  });

  it('Initially update button should be disabled', () => {
    const initialState = { settingsChannels: { freqCappingList: data } };
    const store = mockStore(initialState);

    const { getByText } = render(
      <CustomWrapper>
        <FrequencyCapping
          store={store}
          connectorDropDownData={connectorData}
          fcList={data}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorDropdown = screen.getByTestId('connectorDropdown');
    fireEvent.change(connectorDropdown, { target: { value: '35' } });
    expect(getByText(/Update/i).closest('button')).toHaveAttribute('disabled');
  });

  it('Update button should be enabled after getting response from API', () => {
    const initialState = { settingsChannels: { freqCappingList: userData } };
    const store = mockStore(initialState);

    const { getByText } = render(
      <CustomWrapper>
        <FrequencyCapping
          store={store}
          connectorDropDownData={connectorData}
          fcList={userData}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorDropdown = screen.getByTestId('connectorDropdown');
    fireEvent.change(connectorDropdown, { target: { value: '35' } });
    expect(getByText(/Update/i).closest('button')).toHaveAttribute(
      'disabled',
      ''
    );
  });

  it('Update button clicked', async () => {
    const initialState = {
      settingsChannels: { freqCappingList: userData, successFCAdd: true },
    };
    const store = mockStore(initialState);

    const { getByText } = render(
      <CustomWrapper>
        <FrequencyCapping
          store={store}
          connectorDropDownData={connectorData}
          fcList={userData}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorDropdown = screen.getByTestId('connectorDropdown');
    fireEvent.change(connectorDropdown, { target: { value: '35' } });
    expect(getByText(/Update/i).closest('button')).toHaveAttribute(
      'disabled',
      ''
    );

    const daysCountSelect = screen.getByTestId('daysCountSelect');
    fireEvent.change(daysCountSelect, { target: { value: '2' } });

    const btn = screen.getByTestId('updateBtn');
    fireEvent.click(btn);
    expect(getByText(/Update/i).closest('button')).not.toHaveAttribute(
      'disabled'
    );
  });
});
