import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';
import DBConnectionListing from 'containers/settings/db-connection/DBConnectionListing';
import configureMockStore from 'redux-mock-store';

describe('DBConnectionListing component', () => {
  const initialState = {
    s3sftpApp: {
      dbConnectionList: [
        {
          id: '53e143ff-071c-4343-88f9-da1830d470fa',
          name: 'dev_setup17',
          adapter: 'postgresql',
          encoding: 'unicode',
          host: 'crm-cdp-hdfc.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
          username: 'crm_hdfc_user',
          password: 'HDFC!1234!',
          database: 'crm_database',
          port: '5432',
          account_id: 1,
          created_at: 1701693578,
        },
        {
          id: 'f0efa026-db64-4e48-a2cf-76b4d7dc5c43',
          name: 'Parvesh',
          adapter: 'postgresql',
          encoding: 'unicode',
          host: 'crm-cdp-hdfc.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
          username: 'crm_hdfc_user',
          password: 'HDFC!1234!',
          database: 'crm_database',
          port: '5432',
          account_id: 1,
          created_at: 1701685044,
        },
        {
          id: 'ffb83a85-d750-46e3-bdcd-ab8163e3bf41',
          name: '1a',
          adapter: 'a',
          encoding: 'unicode',
          host: 'a',
          username: 'a',
          password: 'sds',
          database: 'a',
          port: 'a',
          account_id: 1,
          created_at: 1701351142,
        },
        {
          id: 'd59d9089-bd25-43fe-a882-94084d1c1854',
          name: '121',
          adapter: 's',
          encoding: 'a',
          host: 'a',
          username: 'a',
          password: 'asdsa',
          database: 'a',
          port: 'a',
          account_id: 1,
          created_at: 1701350415,
        },
        {
          id: '2466f3bf-f50a-49b9-b4b0-65cdf845850e',
          name: 'NewTest',
          adapter: 'postgresql',
          encoding: 'unicode',
          host: 'db-segmentation.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
          username: 'postgres',
          password: 'TataCom!1234!',
          database: 'dev_segmentation',
          port: '5432',
          account_id: 1,
          created_at: 1701346877,
        },
        {
          id: '04aeecad-bbe6-4733-9ada-d1e97a3bfb80',
          name: 'sad',
          adapter: 'sd',
          encoding: 'd',
          host: 'sd',
          username: 'sds',
          password: 'd',
          database: 'sd',
          port: 'd',
          account_id: 1,
          created_at: 1701336657,
        },
        {
          id: '935c0841-0c27-48a9-b977-570ffb91956d',
          name: 'poo',
          adapter: 's',
          encoding: 's',
          host: 's',
          username: 'apurva_naik@persistent.com',
          password: 'mm',
          database: 's',
          port: '5432',
          account_id: 1,
          created_at: 1701260464,
        },
        {
          id: '7f7b246a-7a7f-4221-a01e-608c86c951ce',
          name: 'amm',
          adapter: 's',
          encoding: 'unicode',
          host: 'a',
          username: 'apurva_naik@persistent.com',
          password: 'mmm',
          database: 'a',
          port: '5432',
          account_id: 1,
          created_at: 1701260397,
        },
        {
          id: '56d42719-b461-44c4-a692-871741109733',
          name: 'assssaaaaaaa',
          adapter: 's',
          encoding: 'saa',
          host: 'a',
          username: 'a',
          password: 'sss',
          database: 'a',
          port: 'a',
          account_id: 1,
          created_at: 1700830714,
        },
        {
          id: 'ce88b9d2-c15b-4010-b8f1-3241de80f97a',
          name: 'dev_setup2',
          adapter: 'postgresql',
          encoding: 'unicode',
          host: 'db-segmentation.cs36wjc4iyst.ap-south-1.rds.amazonaws.com',
          username: 'postgres',
          password: 'TataCom!1234!',
          database: 'dev_segmentation',
          port: '5432',
          account_id: 1,
          created_at: 1700743297,
        },
      ],
      pagination: {
        current_page: 1,
        prev_page: null,
        next_page: 2,
        total_pages: 4,
        limit_value: 10,
        total_count: 34,
      },
    },
  };

  const mockStore = configureMockStore();
  const store = mockStore(initialState);

  const commonProps = {};
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DBConnectionListing />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <DBConnectionListing />
      </CustomWrapper>
    );
    //check if the component renders the message
    expect(getByText('Connection Name')).toBeInTheDocument();
  });

  it('change the number of rows to be displayed', () => {
    const { getByText } = render(
      <CustomWrapper>
        <DBConnectionListing />
      </CustomWrapper>
    );
    //check if the component renders the message
    expect(getByText('Connection Name')).toBeInTheDocument();
    const btn = screen.getAllByText('10')[0];
    fireEvent.click(btn);
    fireEvent.click(screen.getByText('20'));
  });

  it('click on the edit button', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <DBConnectionListing store={store} />
      </CustomWrapper>
    );
    expect(getByText('Connection Name')).toBeInTheDocument();
    const btn = screen.getAllByRole('button', {
      name: /actionBtn/i,
    });

    fireEvent.click(btn[0]);

    const actionBtn = screen.getByTestId(
      'actionBtnce88b9d2-c15b-4010-b8f1-3241de80f97a'
    );
    fireEvent.click(actionBtn);

    await waitFor(() => {
      const editPopover = screen.getByTestId(
        'popover-editce88b9d2-c15b-4010-b8f1-3241de80f97a'
      );
      fireEvent.click(editPopover);
    });

    const editBtn = screen.getByTestId(
      'editBtnce88b9d2-c15b-4010-b8f1-3241de80f97a'
    );

    fireEvent.click(editBtn);
  });

  it('click on the next page', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <DBConnectionListing store={store} />
      </CustomWrapper>
    );
    expect(getByText('Connection Name')).toBeInTheDocument();

    const page2 = getByText('2');
    expect(page2).toBeInTheDocument();
    fireEvent.click(page2);
  });

  it('click on the delete button', async () => {
    const { getByText, queryByText } = render(
      <CustomWrapper>
        <DBConnectionListing store={store} />
      </CustomWrapper>
    );
    expect(getByText('Connection Name')).toBeInTheDocument();
    const btn = screen.getAllByRole('button', {
      name: /actionBtn/i,
    });

    fireEvent.click(btn[0]);

    const actionBtn = screen.getByTestId(
      'actionBtnce88b9d2-c15b-4010-b8f1-3241de80f97a'
    );
    fireEvent.click(actionBtn);

    await waitFor(() => {
      const editPopover = screen.getByTestId(
        'popover-editce88b9d2-c15b-4010-b8f1-3241de80f97a'
      );
      fireEvent.click(editPopover);
    });

    const deleteBtn = screen.getByTestId(
      'deleteBtnce88b9d2-c15b-4010-b8f1-3241de80f97a'
    );

    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(getByText('Delete Database Connection')).toBeInTheDocument();
      fireEvent.click(document.body);
      const closeBtn = screen.getByRole('button', {
        name: /Close/i,
      });
      fireEvent.click(closeBtn);
    });
  });

  it('click on yes, delete', async () => {
    const { getByText, queryByText } = render(
      <CustomWrapper>
        <DBConnectionListing store={store} />
      </CustomWrapper>
    );
    expect(getByText('Connection Name')).toBeInTheDocument();
    const btn = screen.getAllByRole('button', {
      name: /actionBtn/i,
    });

    fireEvent.click(btn[0]);

    const actionBtn = screen.getByTestId(
      'actionBtnce88b9d2-c15b-4010-b8f1-3241de80f97a'
    );
    fireEvent.click(actionBtn);

    await waitFor(() => {
      const editPopover = screen.getByTestId(
        'popover-editce88b9d2-c15b-4010-b8f1-3241de80f97a'
      );
      fireEvent.click(editPopover);
    });

    const deleteBtn = screen.getByTestId(
      'deleteBtnce88b9d2-c15b-4010-b8f1-3241de80f97a'
    );

    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(getByText('Delete Database Connection')).toBeInTheDocument();
      fireEvent.click(document.body);
      const deleteBtn = screen.getByRole('button', {
        name: /Yes, Delete/i,
      });
      fireEvent.click(deleteBtn);
    });
  });
});
