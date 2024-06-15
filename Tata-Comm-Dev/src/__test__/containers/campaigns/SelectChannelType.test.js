import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import SelectChannelType from '../../../../src/containers/campaigns/SelectChannelType';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import { createRef } from 'react';

describe('Select channel type component', () => {
  const mockStore = configureMockStore();
  const ref = createRef(null);
  const mockObj = {
    formRef: ref,
    next: jest.fn(),
    addChannelType: jest.fn(),
    updateStepIndexAction: jest.fn(),
    clearOnChannelTypeChange: jest.fn(),
    clearUserCount: jest.fn(),
  };

  const insitialStateObj = {
    campaignsApp: {
      createCampaign: { selectAudience: { channelType: 'sms' } },
    },
    successAdd: true,
    errorAdd: true,
    loadingAdd: true,
    stepIndex: 1,
  };

  it('handleSubmit with wraning model open crashing', async () => {
    const initialState = { ...insitialStateObj };
    const store = mockStore(initialState);
    const { getByText, getByRole } = render(
      <CustomWrapper>
        <SelectChannelType store={store} {...mockObj} />
      </CustomWrapper>
    );
    const cardBtn = getByText('Email');
    const nextBtn = getByRole('button', {
      name: 'Next',
    });

    fireEvent.click(nextBtn);
    await waitFor(() => {
      fireEvent.click(cardBtn);

      const warningModelYesBtn = getByText('Yes');
      fireEvent.click(warningModelYesBtn);
      expect(warningModelYesBtn).toBeInTheDocument();

      expect(cardBtn).toBeInTheDocument();
      expect(getByText('Select Channel Type')).toBeInTheDocument();
    });
  });

  it('handle Subbmit without model and selecting channel type', async () => {
    insitialStateObj.campaignsApp.createCampaign.selectAudience.channelType =
      '';
    const initialState = { ...insitialStateObj };
    const store = mockStore(initialState);
    const { getByText, getByRole } = render(
      <CustomWrapper>
        <SelectChannelType store={store} {...mockObj} />
      </CustomWrapper>
    );
    const cardBtn = getByText('Email');
    fireEvent.click(cardBtn);
    await waitFor(() => {
      const nextBtn = getByRole('button', {
        name: 'Next',
      });
      fireEvent.click(nextBtn);
      expect(nextBtn).toBeInTheDocument();
      expect(cardBtn).toBeInTheDocument();
    });
  });
});
