import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import SmsTemplatesListing from 'containers/campaigns/sms-campaign/smsTemplate/SmsTemplatesListing';

describe('SmsTemplatesListing Component', () => {
  const mockItems = [
    {
      name: 'Template 1',
      template_id: 1,
      pe_id: 123,
      telemarketer_id: 456,
      sender_id: 'Sender1',
      registered_dlt: true,
      action: {},
    },
  ];
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SmsTemplatesListing
          items={mockItems}
          setModalOpen={jest.fn()}
          setModalOpenDelete={jest.fn()}
          setEditFormData={jest.fn()}
          setViewData={jest.fn()}
          onChangePage={jest.fn()}
          currentPage={1}
          totalPage={1}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with provided items', () => {
    render(
      <CustomWrapper>
        <SmsTemplatesListing
          items={mockItems}
          setModalOpen={jest.fn()}
          setModalOpenDelete={jest.fn()}
          setEditFormData={jest.fn()}
          setViewData={jest.fn()}
          onChangePage={jest.fn()}
          currentPage={1}
          totalPage={1}
        />
      </CustomWrapper>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Template Id')).toBeInTheDocument();

    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.template_id.toString())).toBeInTheDocument();
    });
  });

  it('triggers setModalOpen and setEditFormData when edit button is clicked', () => {
    const setModalOpenMock = jest.fn();
    const setEditFormDataMock = jest.fn();

    render(
      <CustomWrapper>
        <SmsTemplatesListing
          items={mockItems}
          setModalOpen={setModalOpenMock}
          setModalOpenDelete={jest.fn()}
          setEditFormData={setEditFormDataMock}
          setViewData={jest.fn()}
          onChangePage={jest.fn()}
          currentPage={1}
          totalPage={1}
        />
      </CustomWrapper>
    );

    fireEvent.click(screen.getAllByTestId('edit-template-modal')[0]);

    expect(setModalOpenMock).toHaveBeenCalledWith(true);
    expect(setEditFormDataMock).toHaveBeenCalledWith(mockItems[0]);
  });
  it('triggers setModalOpen and setViewData when view button is clicked', () => {
    const setModalOpenMock = jest.fn();
    const setViewDataMock = jest.fn();

    render(
      <CustomWrapper>
        <SmsTemplatesListing
          items={mockItems}
          setModalOpen={setModalOpenMock}
          setModalOpenDelete={jest.fn()}
          setEditFormData={jest.fn()}
          setViewData={setViewDataMock}
          onChangePage={jest.fn()}
          currentPage={1}
          totalPage={1}
        />
      </CustomWrapper>
    );

    fireEvent.click(screen.getAllByTestId('view-template-modal')[0]);

    expect(setModalOpenMock).toHaveBeenCalledWith(true);
    expect(setViewDataMock).toHaveBeenCalledWith(true);
  });

  it('triggers setModalOpenDelete and setEditFormData when delete button is clicked', () => {
    const setModalOpenDeleteMock = jest.fn();
    const setEditFormDataMock = jest.fn();

    render(
      <CustomWrapper>
        <SmsTemplatesListing
          items={mockItems}
          setModalOpen={jest.fn()}
          setModalOpenDelete={setModalOpenDeleteMock}
          setEditFormData={setEditFormDataMock}
          setViewData={jest.fn()}
          onChangePage={jest.fn()}
          currentPage={1}
          totalPage={1}
        />
      </CustomWrapper>
    );

    fireEvent.click(screen.getAllByTestId('delete-template-modal')[0]);

    expect(setModalOpenDeleteMock).toHaveBeenCalledWith(true);
    expect(setEditFormDataMock).toHaveBeenCalledWith(mockItems[0]);
  });
});
