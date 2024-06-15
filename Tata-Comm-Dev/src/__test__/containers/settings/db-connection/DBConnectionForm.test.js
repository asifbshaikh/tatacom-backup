import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';
import DBConnectionForm from 'containers/settings/db-connection/DBConnectionForm';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { createRef } from 'react';
import routeData from 'react-router';
import configureMockStore from 'redux-mock-store';

describe('DBConnectionForm component', () => {
  const history = createMemoryHistory();

  const ref = createRef(null);

  const initialState = {
    s3sftpApp: {
      selectSource: {
        sourceType: 'audience',
        audienceType: 'registered_audience',
      },
      successSaveAdd: true,
      errorAdd: { errors: 'Error Msg', errorMsg: 'Error msg' },
      loadingAdd: false,
      successTestAdd: true,
      errorTestAdd: {
        error: 'true',
        errorMsg: 'Error msg',
        errors: 'Error msg',
      },
      loadingTestAdd: false,
      errorShowAdd: { error: 'true', errorMsg: 'Error msg', errors: 'true' },
      successShowAdd: true,
      dbConfigData: {},
      successEditAdd: true,
      errorEditAdd: { errors: 'true', errorMsg: 'Error msg' },
      loadingEditAdd: false,
    },
  };

  const mockStore = configureMockStore();
  const store = mockStore(initialState);

  const commonProps = {};
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DBConnectionForm />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the component', () => {
    const { getByText } = render(
      <Router history={history} formRef={ref}>
        <CustomWrapper>
          <DBConnectionForm store={store} />
        </CustomWrapper>
      </Router>
    );
    //check if the component renders the message
    expect(getByText('Connection Name')).toBeInTheDocument();
  });

  it('Test Connection button click', async () => {
    render(
      <Router history={history} formRef={ref}>
        <CustomWrapper>
          <DBConnectionForm />
        </CustomWrapper>
      </Router>
    );

    const connectionName = screen.getByTestId('connectionName');
    fireEvent.change(connectionName, { target: { value: 'conect' } });

    const host = screen.getByTestId('host');
    fireEvent.change(host, { target: { value: 'abc' } });

    const database = screen.getByTestId('database');
    fireEvent.change(database, { target: { value: 'db' } });

    const port = screen.getByTestId('port');
    fireEvent.change(port, { target: { value: '2' } });

    const adapter = screen.getByTestId('adapter');
    fireEvent.change(adapter, { target: { value: 'adap1' } });

    const encoding = screen.getByTestId('encoding');
    fireEvent.change(encoding, { target: { value: 'encod1' } });

    const username = screen.getByTestId('username');
    fireEvent.change(username, { target: { value: 'user' } });

    const password = screen.getByTestId('password');
    fireEvent.change(password, { target: { value: 'pass@word' } });

    const test = screen.getByText('Test Connection');
    fireEvent.click(test);

    await waitFor(() => {
      expect(test).toBeValid();
      const tableName = screen.getByTestId('tableName');
      fireEvent.change(tableName, { target: { value: 'conect' } });
      const save = screen.getByText('Save');
      fireEvent.click(save);
      expect(save).toBeValid();
    });
  });

  it('Cancel Test Connection button click', async () => {
    render(
      <Router history={history} formRef={ref}>
        <CustomWrapper>
          <DBConnectionForm store={store} />
        </CustomWrapper>
      </Router>
    );

    const connectionName = screen.getByTestId('connectionName');
    fireEvent.change(connectionName, { target: { value: 'conect' } });

    const host = screen.getByTestId('host');
    fireEvent.change(host, { target: { value: 'abc' } });

    const database = screen.getByTestId('database');
    fireEvent.change(database, { target: { value: 'db' } });

    const port = screen.getByTestId('port');
    fireEvent.change(port, { target: { value: '2' } });

    const adapter = screen.getByTestId('adapter');
    fireEvent.change(adapter, { target: { value: 'adap1' } });

    const encoding = screen.getByTestId('encoding');
    fireEvent.change(encoding, { target: { value: 'encod1' } });

    const username = screen.getByTestId('username');
    fireEvent.change(username, { target: { value: 'user' } });

    const password = screen.getByTestId('password');
    fireEvent.change(password, { target: { value: 'pass@word' } });

    const test = screen.getByText('Test Connection');
    fireEvent.click(test);

    await waitFor(() => {
      expect(test).toBeValid();
      const cancel = screen.getByText('Cancel');
      fireEvent.click(cancel);
      expect(cancel).toBeValid();
    });
  });

  it('handle Reset button click', async () => {
    const { getByText } = render(
      <Router history={history} formRef={ref}>
        <CustomWrapper>
          <DBConnectionForm store={store} />
        </CustomWrapper>
      </Router>
    );

    const connectionName = screen.getByTestId('connectionName');
    fireEvent.change(connectionName, { target: { value: 'conect' } });

    const host = screen.getByTestId('host');
    fireEvent.change(host, { target: { value: 'abc' } });

    const database = screen.getByTestId('database');
    fireEvent.change(database, { target: { value: 'db' } });

    const port = screen.getByTestId('port');
    fireEvent.change(port, { target: { value: '2' } });

    const adapter = screen.getByTestId('adapter');
    fireEvent.change(adapter, { target: { value: 'adap1' } });

    const encoding = screen.getByTestId('encoding');
    fireEvent.change(encoding, { target: { value: 'encod1' } });

    const username = screen.getByTestId('username');
    fireEvent.change(username, { target: { value: 'user' } });

    const password = screen.getByTestId('password');
    fireEvent.change(password, { target: { value: 'pass@word' } });

    const reset = getByText('Reset');
    act(() => {
      fireEvent.click(reset);
    });
    expect(reset).toBeValid();
  });

  it('Edit Connection button click', async () => {
    render(
      <Router history={history} formRef={ref}>
        <CustomWrapper>
          <DBConnectionForm store={store} />
        </CustomWrapper>
      </Router>
    );

    const connectionName = screen.getByTestId('connectionName');
    fireEvent.change(connectionName, { target: { value: 'conect' } });

    const host = screen.getByTestId('host');
    fireEvent.change(host, { target: { value: 'abc' } });

    const database = screen.getByTestId('database');
    fireEvent.change(database, { target: { value: 'db' } });

    const port = screen.getByTestId('port');
    fireEvent.change(port, { target: { value: '2' } });

    const adapter = screen.getByTestId('adapter');
    fireEvent.change(adapter, { target: { value: 'adap1' } });

    const encoding = screen.getByTestId('encoding');
    fireEvent.change(encoding, { target: { value: 'encod1' } });

    const username = screen.getByTestId('username');
    fireEvent.change(username, { target: { value: 'user' } });

    const password = screen.getByTestId('password');
    fireEvent.change(password, { target: { value: 'pass@word' } });

    const test = screen.getByText('Test Connection');
    fireEvent.click(test);

    await waitFor(() => {
      expect(test).toBeValid();
      const tableName = screen.getByTestId('tableName');
      fireEvent.change(tableName, { target: { value: 'conect' } });
      const save = screen.getByText('Save');
      fireEvent.click(save);
      expect(save).toBeValid();
      const editBtn = screen.getAllByText('Edit Connection')[1];
      fireEvent.click(editBtn);

      expect(editBtn).toBeValid();
    });
  });

  it('Modal outside click', async () => {
    render(
      <Router history={history} formRef={ref}>
        <CustomWrapper>
          <DBConnectionForm store={store} />
        </CustomWrapper>
      </Router>
    );

    const connectionName = screen.getByTestId('connectionName');
    fireEvent.change(connectionName, { target: { value: 'conect' } });

    const host = screen.getByTestId('host');
    fireEvent.change(host, { target: { value: 'abc' } });

    const database = screen.getByTestId('database');
    fireEvent.change(database, { target: { value: 'db' } });

    const port = screen.getByTestId('port');
    fireEvent.change(port, { target: { value: '2' } });

    const adapter = screen.getByTestId('adapter');
    fireEvent.change(adapter, { target: { value: 'adap1' } });

    const encoding = screen.getByTestId('encoding');
    fireEvent.change(encoding, { target: { value: 'encod1' } });

    const username = screen.getByTestId('username');
    fireEvent.change(username, { target: { value: 'user' } });

    const password = screen.getByTestId('password');
    fireEvent.change(password, { target: { value: 'pass@word' } });

    const test = screen.getByText('Test Connection');
    fireEvent.click(test);

    await waitFor(() => {
      expect(test).toBeValid();
      fireEvent.click(document.body);
      const cancel = screen.getByText('Cancel');
      expect(cancel).toBeValid();
    });
  });

  it('Save Connection button click', async () => {
    const mockLocation = {
      location: {
        state: {
          from: 'new',
        },
      },
    };

    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockLocation);

    render(
      <Router history={history} formRef={ref}>
        <CustomWrapper>
          <DBConnectionForm />
        </CustomWrapper>
      </Router>
    );

    const connectionName = screen.getByTestId('connectionName');
    fireEvent.change(connectionName, { target: { value: 'connect1' } });

    const host = screen.getByTestId('host');
    fireEvent.change(host, {
      target: {
        value: 'db-segmentation.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
      },
    });

    const database = screen.getByTestId('database');
    fireEvent.change(database, { target: { value: 'crm_database' } });

    const port = screen.getByTestId('port');
    fireEvent.change(port, { target: { value: '5432' } });

    const adapter = screen.getByTestId('adapter');
    fireEvent.change(adapter, { target: { value: 'postgresql' } });

    const encoding = screen.getByTestId('encoding');
    fireEvent.change(encoding, { target: { value: 'unicode' } });

    const username = screen.getByTestId('username');
    fireEvent.change(username, { target: { value: 'crm_hdfc_user' } });

    const password = screen.getByTestId('password');
    fireEvent.change(password, { target: { value: 'HDFC!1234!' } });

    const test = screen.getByText('Test Connection');
    fireEvent.click(test);

    await waitFor(() => {
      expect(test).toBeValid();
      const tableName = screen.getByTestId('tableName');
      fireEvent.change(tableName, { target: { value: 'db_contacts' } });
      const save = screen.getByText('Save');
      fireEvent.click(save);
      expect(save).toBeValid();
    });

    const saveBtn = screen.getByText('Save Connection');
    fireEvent.click(saveBtn);
  });
});
