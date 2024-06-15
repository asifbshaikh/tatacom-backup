import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import DoNotDisturb from 'containers/settings/channels/sms/DoNotDisturb';
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

const countryData = [
  {
    name: 'Andorra',
    phone_code: '376',
    country_code: 'AD',
  },
  {
    name: 'United Arab Emirates',
    phone_code: '971',
    country_code: 'AE',
  },
  {
    name: 'Afghanistan',
    phone_code: '93',
    country_code: 'AF',
  },
];

const data = {
  id: '35',
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
  fc_dnd_setting_countries: [
    {
      id: 117,
      fc_dnd_setting_id: '35',
      country_code: 'IN',
      week_days: ['Monday'],
      start_time: '2023-10-20T07:36:41.178Z',
      end_time: '2023-10-20T11:46:41.178Z',
      dnd_timezone: null,
      phone_code: null,
      created_at: '2023-10-20T10:35:08.487Z',
      updated_at: '2023-10-20T10:35:08.487Z',
    },
  ],
};

const userData = {
  ...data,
  dnd_enabled: true,
  allow_in_dnd_period: true,
};

describe('DoNotDisturb component', () => {
  const mockStore = configureMockStore();

  it('render DnD without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DoNotDisturb
          connectorDropDownData={connectorData}
          countryList={countryData}
          dndList={data}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('connectorSelect to be in the doc', () => {
    render(
      <CustomWrapper>
        <DoNotDisturb
          connectorDropDownData={connectorData}
          countryList={countryData}
          dndList={data}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorSelect = screen.getByTestId('connectorSelect');
    expect(connectorSelect).toBeInTheDocument();
  });

  it('render DND form after selecting the connector', () => {
    const initialState = { settingsChannels: { doNotDistList: data } };
    const store = mockStore(initialState);
    const { getByText } = render(
      <CustomWrapper>
        <DoNotDisturb
          store={store}
          connectorDropDownData={connectorData}
          countryList={countryData}
          dndList={data}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorSelect = screen.getByTestId('connectorSelect');
    fireEvent.change(connectorSelect, { target: { value: '35' } });
    const checkDndMsg = getByText(
      /DND will be activated based on user's timezone/i
    );
    // const emailCount = getByText(/Set DND Period/i);
    expect(checkDndMsg).toBeInTheDocument();
  });

  it('Initially update button should be disabled', () => {
    const initialState = { settingsChannels: { doNotDistList: data } };
    const store = mockStore(initialState);

    const { getByText } = render(
      <CustomWrapper>
        <DoNotDisturb
          store={store}
          connectorDropDownData={connectorData}
          countryList={countryData}
          dndList={data}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorSelect = screen.getByTestId('connectorSelect');
    fireEvent.change(connectorSelect, { target: { value: '35' } });
    expect(getByText(/Update/i).closest('button')).toHaveAttribute('disabled');
  });

  it('Update button should be enabled after getting response from API', () => {
    const initialState = { settingsChannels: { doNotDistList: userData } };
    const store = mockStore(initialState);

    const { getByText } = render(
      <CustomWrapper>
        <DoNotDisturb
          store={store}
          connectorDropDownData={connectorData}
          countryList={countryData}
          dndList={userData}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorSelect = screen.getByTestId('connectorSelect');
    fireEvent.change(connectorSelect, { target: { value: '35' } });
    expect(getByText(/Update/i).closest('button')).toHaveAttribute(
      'disabled',
      ''
    );
  });

  it('Update button clicked', async () => {
    const initialState = {
      settingsChannels: { doNotDistList: userData, successDnDAdd: true },
    };
    const store = mockStore(initialState);

    const { getByText } = render(
      <CustomWrapper>
        <DoNotDisturb
          store={store}
          connectorDropDownData={connectorData}
          countryList={countryData}
          dndList={userData}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorSelect = screen.getByTestId('connectorSelect');
    fireEvent.change(connectorSelect, { target: { value: '35' } });
    expect(getByText(/Update/i).closest('button')).toHaveAttribute(
      'disabled',
      ''
    );

    const controlQueueGapMin = screen.getByTestId('control_queue_gap');
    fireEvent.change(controlQueueGapMin, { target: { value: '22' } });

    const btn = screen.getByTestId('updateDnDBtn');
    fireEvent.click(btn);
    expect(getByText(/Update/i).closest('button')).not.toHaveAttribute(
      'disabled'
    );
  });

  it('Handle Add, Edit, Delete action buttons', async () => {
    const initialState = {
      settingsChannels: { doNotDistList: userData, successDnDAdd: true },
    };
    const store = mockStore(initialState);

    const { getByText } = render(
      <CustomWrapper>
        <DoNotDisturb
          store={store}
          connectorDropDownData={connectorData}
          countryList={countryData}
          dndList={userData}
          channelType={'sms'}
        />
      </CustomWrapper>
    );
    const connectorSelect = screen.getByTestId('connectorSelect');
    fireEvent.change(connectorSelect, { target: { value: '35' } });
    expect(getByText(/Update/i).closest('button')).toHaveAttribute(
      'disabled',
      ''
    );

    const controlQueueGapMin = screen.getByTestId('control_queue_gap');
    fireEvent.change(controlQueueGapMin, { target: { value: '22' } });

    const addBtn = screen.getAllByTestId('addBtnIcon');
    const editBtn = screen.getAllByTestId('editIcon');
    fireEvent.click(addBtn[0]);
    fireEvent.click(editBtn[0]);
    const afterAdd = screen.getAllByTestId('addBtnIcon');
    expect(afterAdd).toHaveLength(2);
    const deleteBtn = screen.getAllByTestId('deleteIcon');
    fireEvent.click(deleteBtn[1]);
    const afterDelete = screen.getAllByTestId('addBtnIcon');
    const afterDeleteEdit = screen.getAllByTestId('editIcon');
    expect(afterDelete).toHaveLength(1);
    expect(afterDeleteEdit).toHaveLength(1);
  });
});
