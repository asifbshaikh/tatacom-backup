import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import ConnectorList from 'containers/settings/channels/sms/ConnectorList';

describe('Connector list component', () => {
  const mockStore = configureMockStore();
  const mockObj = {
    removeConnectorFromList: jest.fn(),
    successRemoveConnector: jest.fn(),
    data: [
      {
        id: 'dashboards',
        icon: 'iconsminds-shop-4',
        label: 'menu.dashboards',
        to: '/app/accounts/45/dashboards',
        subs: [
          {
            label: 'menu.dashboard_campaigns',
            to: '/app/accounts/45/dashboards/all-campaigns',
          },
          {
            label: 'menu.ab-comparison',
            to: '/app/accounts/45/dashboards/ab-comparison',
          },
        ],
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
    const { getByTestId, getByText } = render(
      <CustomWrapper>
        <ConnectorList {...mockObj} store={store} />
      </CustomWrapper>
    );
    const deleteBtn = getByTestId('delete-btn_dashboards');

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
    const { getByTestId, getByText } = render(
      <CustomWrapper>
        <ConnectorList {...mockObj} store={store} />
      </CustomWrapper>
    );
    const deleteBtn = getByTestId('delete-btn_dashboards');

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
    const { getByTestId, getByRole } = render(
      <CustomWrapper>
        <ConnectorList {...mockObj} store={store} />
      </CustomWrapper>
    );
    const editbtn = getByTestId('edit-btn_dashboards');

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
