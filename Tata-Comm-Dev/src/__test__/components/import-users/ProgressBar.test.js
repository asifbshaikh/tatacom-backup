import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import ProgressBar from 'components/import-user/ProgressBar';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';

describe('ProgressBar component', () => {
  const mockStore = configureMockStore();

  const initialState = {
    importusersApp: {
      selectUser: 'Anonymous',
      skippedColumns: [],
      segmentName: '',
      updateExistingUsers: false,
      firstRowHeaders: false,
      colAttributeWithType: {},
      errorUpload: false,
      successUpload: true,
      loadingUpload: true,
      customAttributeName: [],
    },
  };

  it('render Previous button and onClick functionality', () => {
    const store = mockStore(initialState);
    const { getByText, getByRole } = render(
      <CustomWrapper>
        <ProgressBar store={store} />
      </CustomWrapper>
    );

    expect(getByText(/select audience type/i)).toBeInTheDocument();
    const previousBtn = getByRole('button', {
      name: /previous/i,
    });
    fireEvent.click(previousBtn);
  });
  it('render next button and upload csv file and redirect to select audience step', async () => {
    const file = new File(['test'], 'test.csv', { type: 'csv' });
    initialState.importusersApp.successUpload = false;
    initialState.importusersApp.errorUpload = { errorMsg: 'Unhandled Error' };
    const store = mockStore(initialState);
    const { getByTestId, getByRole } = render(
      <CustomWrapper>
        <ProgressBar store={store} />
      </CustomWrapper>
    );

    const nextBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const uploadFile = getByTestId('uploadCsv');
      fireEvent.click(uploadFile);
      userEvent.upload(uploadFile, file);
      expect(uploadFile).toBeInTheDocument();
    });

    const getFirstRow = getByTestId('check-headers');
    fireEvent.click(getFirstRow);

    const previousBtn = getByRole('button', {
      name: /previous/i,
    });
    fireEvent.click(previousBtn);
  });
  it('render finish the import Audience steps', async () => {
    const file = new File(['test'], 'test.csv', { type: 'csv' });
    initialState.importusersApp.successUpload = false;
    initialState.importusersApp.errorUpload = { errorMsg: 'Unhandled Error' };
    initialState.importusersApp.loadingUpload = false;
    const store = mockStore(initialState);
    const { getByText, getByTestId, getByRole } = render(
      <CustomWrapper>
        <ProgressBar store={store} />
      </CustomWrapper>
    );

    const nextBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const uploadFile = getByTestId('uploadCsv');
      fireEvent.click(uploadFile);
      userEvent.upload(uploadFile, file);
      expect(uploadFile).toBeInTheDocument();
    });

    const lastStepBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(lastStepBtn);
    expect(getByText('Map Columns')).toBeInTheDocument();

    const finishBtn = getByRole('button', {
      name: /finish/i,
    });

    expect(finishBtn).toBeInTheDocument();
    fireEvent.click(finishBtn);
  });
  it('render Progress modal yes button click', async () => {
    const file = new File(['test'], 'test.csv', { type: 'csv' });
    initialState.importusersApp.selectUser = 'Registered';
    const store = mockStore(initialState);
    const { getByText, getByTestId, getByRole } = render(
      <CustomWrapper>
        <ProgressBar store={store} />
      </CustomWrapper>
    );

    const nextBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const uploadFile = getByTestId('uploadCsv');
      fireEvent.click(uploadFile);
      userEvent.upload(uploadFile, file);
      expect(uploadFile).toBeInTheDocument();
    });

    const lastStepBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(lastStepBtn);

    const previousBtn = getByRole('button', {
      name: /previous/i,
    });

    fireEvent.click(previousBtn);

    expect(getByText(/Warning/i)).toBeInTheDocument();
    const yesBtn = getByRole('button', {
      name: /yes/i,
    });
    expect(yesBtn).toBeInTheDocument();
    fireEvent.click(yesBtn);
  });
  it('render Progress modal no button click', async () => {
    const file = new File(['test'], 'test.csv', { type: 'csv' });
    initialState.importusersApp.selectUser = 'Registered';
    const store = mockStore(initialState);
    const { getByText, getByTestId, getByRole } = render(
      <CustomWrapper>
        <ProgressBar store={store} />
      </CustomWrapper>
    );

    const nextBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const uploadFile = getByTestId('uploadCsv');
      fireEvent.click(uploadFile);
      userEvent.upload(uploadFile, file);
      expect(uploadFile).toBeInTheDocument();
    });

    const lastStepBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(lastStepBtn);

    const previousBtn = getByRole('button', {
      name: /previous/i,
    });

    fireEvent.click(previousBtn);

    expect(getByText(/Warning/i)).toBeInTheDocument();
    const noBtn = getByRole('button', {
      name: /no/i,
    });
    expect(noBtn).toBeInTheDocument();
    fireEvent.click(noBtn);
  });
  it('remove CSV file uploaded', async () => {
    const file = new File(['test'], 'test.csv', { type: 'csv' });
    initialState.importusersApp.selectUser = 'Registered';
    const store = mockStore(initialState);
    const { getByText, getByTestId, getByRole } = render(
      <CustomWrapper>
        <ProgressBar store={store} />
      </CustomWrapper>
    );

    const nextBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const uploadFile = getByTestId('uploadCsv');
      fireEvent.click(uploadFile);
      userEvent.upload(uploadFile, file);
      expect(uploadFile).toBeInTheDocument();
    });

    const removeCSV = getByTestId('removeCsv');
    expect(removeCSV).toBeInTheDocument();
    fireEvent.click(removeCSV);
  });
  it('check update audience checkbox', async () => {
    const file = new File(['test'], 'test.csv', { type: 'csv' });
    initialState.importusersApp.selectUser = 'Registered';
    const store = mockStore(initialState);
    const { getByText, getByTestId, getByRole } = render(
      <CustomWrapper>
        <ProgressBar store={store} />
      </CustomWrapper>
    );

    const nextBtn = getByRole('button', {
      name: 'Next',
    });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const uploadFile = getByTestId('uploadCsv');
      fireEvent.click(uploadFile);
      userEvent.upload(uploadFile, file);
      expect(uploadFile).toBeInTheDocument();
    });

    const checkUserUpdate = getByTestId('check-update-users');
    fireEvent.click(checkUserUpdate);

    expect(checkUserUpdate).toBeInTheDocument();
  });
});
