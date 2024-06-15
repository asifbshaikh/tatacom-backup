import { describe, it } from '@jest/globals';
import {
  fireEvent,
  getByTestId,
  getByText,
  render,
  waitFor,
} from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import SmsTemplate from 'views/app/campaigns/SmsTemplate';
import configureMockStore from 'redux-mock-store';

describe('SMSTemplate component', () => {
  const mockObject = {
    match: {
      path: '',
    },
    getallTemplates: jest.fn(),

    getSearchTemplates: jest.fn(),
  };
  const mockStore = configureMockStore();

  const initialState = {
    campaignsApp: {
      loadedCampaigns: true,
      smsCampaignTemplates: {
        templates: [
          {
            id: 127,
            name: 'test',
            pe_id: '90',
            telemarketer_id: '90',
            registered_dlt: '90',
            sender_id: 'POLOP',
            description: 'TEST DESCRIPTION',
            message: 'hELLO',
            account_id: 1,
            template_type: 1,
            locale: 0,
            created_at: '2023-12-11T06:31:17.990Z',
            updated_at: '2023-12-11T06:31:17.990Z',
            template_id: '1',
            account_user_id: null,
          },
        ],
        totalCount: 1,
      },
    },
  };

  const store = mockStore(initialState);

  it('addTemplate Modal close', async () => {
    const { getByRole } = render(
      <CustomWrapper>
        <SmsTemplate {...mockObject} store={store} />
      </CustomWrapper>
    );

    const addTemplate = getByRole('button', {
      name: /create template/i,
    });

    await waitFor(() => {
      fireEvent.click(addTemplate);
    });

    const closeModal = getByRole('button', {
      name: /close/i,
    });

    expect(closeModal).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(closeModal);
    });
  });

  it('delete Modal for template delete and close the modal', async () => {
    const { getByRole, getByTestId } = render(
      <CustomWrapper>
        <SmsTemplate {...mockObject} store={store} />
      </CustomWrapper>
    );

    const deleteTemplateBtn = getByTestId('delete-template-modal');

    await waitFor(() => {
      fireEvent.click(deleteTemplateBtn);
    });

    const deleteBtn = getByRole('button', {
      name: /no, keep/i,
    });

    expect(deleteBtn).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(deleteBtn);
    });
  });

  it('loading of template list', async () => {
    initialState.campaignsApp.loadedCampaigns = false;
    const { container } = render(
      <CustomWrapper>
        <SmsTemplate {...mockObject} store={store} />
      </CustomWrapper>
    );

    expect(container.getElementsByClassName('loading').length).toBe(1);
  });
  it('search template from template list', async () => {
    initialState.campaignsApp.loadedCampaigns = true;
    const { getByRole, getByText } = render(
      <CustomWrapper>
        <SmsTemplate {...mockObject} store={store} />
      </CustomWrapper>
    );

    const searchTemplate = getByRole('textbox');
    await waitFor(() => {
      fireEvent.change(searchTemplate, { target: { value: 'test' } });
    });

    expect(searchTemplate).toBeInTheDocument();

    const pageChange = getByRole('button', {
      name: /10/i,
    });

    fireEvent.change(pageChange, { target: { value: 15 } });
    fireEvent.click(getByText('15'));
  });
});
