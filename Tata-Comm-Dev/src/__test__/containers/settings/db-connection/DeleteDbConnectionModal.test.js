import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';
import DBConnectionListing from 'containers/settings/db-connection/DBConnectionListing';
import configureMockStore from 'redux-mock-store';
import DeleteDbConnectionModal from 'containers/settings/db-connection/DeleteDbConnectionModal';

describe('DBConnectionListing component', () => {
  const initialState = {
    s3sftpApp: {
      successDelete: true,
      errorDelete: { errorMsg: 'Error' },
      loadingDelete: false,
    },
  };

  const errorState = {
    s3sftpApp: {
      successDelete: false,
      errorDelete: { errorMsg: 'Error' },
      loadingDelete: true,
    },
  };

  const editFormData = {
    id: '7f7b246a-7a7f-4221-a01e-608c86c951ce',
    name: 'amm',
    adapter: 's',
    encoding: 'unicode',
    host: 'a',
    username: 'aaa@test.com',
    password: 'mmm',
    database: 'a',
    port: '5432',
    account_id: 1,
    created_at: 1701260397,
  };

  const mockStore = configureMockStore();
  const store = mockStore(initialState);
  const errorStore = mockStore(errorState);

  const commonProps = {};
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DeleteDbConnectionModal modalOpen={true} toggleModal={jest.fn()} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <DeleteDbConnectionModal
          store={store}
          modalOpen={true}
          toggleModal={jest.fn()}
        />
      </CustomWrapper>
    );

    //check if the component renders the message
    expect(getByText('Delete Database Connection')).toBeInTheDocument();
  });

  it('click on the No, keep', async () => {
    const { getByText, queryByText } = render(
      <CustomWrapper>
        <DeleteDbConnectionModal
          store={store}
          modalOpen={true}
          toggleModal={jest.fn()}
        />
      </CustomWrapper>
    );

    expect(getByText('Delete Database Connection')).toBeInTheDocument();
    expect(getByText('Yes, Delete')).toBeInTheDocument();
    fireEvent.click(getByText('No, Keep'));
  });

  it('click on close modal', async () => {
    const { getByText, queryByText } = render(
      <CustomWrapper>
        <DeleteDbConnectionModal
          store={store}
          modalOpen={true}
          toggleModal={jest.fn()}
        />
      </CustomWrapper>
    );

    await waitFor(() => {
      expect(getByText('Delete Database Connection')).toBeInTheDocument();
      fireEvent.click(document.body);
      const closeBtn = screen.getByRole('button', {
        name: /Close/i,
      });
      fireEvent.click(closeBtn);
    });
  });

  it('click on the Yes, Delete', async () => {
    const { getByText, queryByText } = render(
      <CustomWrapper>
        <DeleteDbConnectionModal
          store={store}
          modalOpen={true}
          toggleModal={jest.fn()}
          editFormData={editFormData}
          setReloadList={jest.fn()}
          onDeleteSuccess={jest.fn()}
        />
      </CustomWrapper>
    );

    await waitFor(() => {
      expect(getByText('Delete Database Connection')).toBeInTheDocument();
      expect(getByText('Yes, Delete')).toBeInTheDocument();
      fireEvent.click(getByText('Yes, Delete'));
    });
  });

  it('click on the Yes, Delete with error state', async () => {
    const { getByText, queryByText } = render(
      <CustomWrapper>
        <DeleteDbConnectionModal
          store={errorStore}
          modalOpen={true}
          toggleModal={jest.fn()}
          editFormData={editFormData}
          setReloadList={jest.fn()}
        />
      </CustomWrapper>
    );

    await waitFor(() => {
      expect(getByText('Delete Database Connection')).toBeInTheDocument();
      expect(getByText('Yes, Delete')).toBeInTheDocument();
      fireEvent.click(getByText('Yes, Delete'));
    });
  });
});
