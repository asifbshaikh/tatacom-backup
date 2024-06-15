import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteSmsTemplateModal from 'containers/campaigns/sms-campaign/smsTemplate/DeleteSmsTemplateModal';
import { CustomWrapper } from 'test-utils';

describe('DeleteSmsTemplateModal Component', () => {
  const mockProps = {
    modalOpen: true,
    toggleModal: jest.fn(),
    formSuccess: false,
    formError: null,
    formLoading: false,
    deleteSmsTemplate: jest.fn(),
    deleteSmsTemplateClean: jest.fn(),
    editFormData: {},
  };

  it('renders component correctly', () => {
    render(
      <CustomWrapper>
        <DeleteSmsTemplateModal {...mockProps} />
      </CustomWrapper>
    );
  });
  it('closes the modal when Cancel button is clicked', () => {
    render(
      <CustomWrapper>
        <DeleteSmsTemplateModal {...mockProps} />
      </CustomWrapper>
    );
    fireEvent.click(screen.getByText('No, Keep'));
    expect(mockProps.toggleModal).toHaveBeenCalled();
  });

  it('calls deleteSmsTemplate when Yes button is clicked', async () => {
    render(
      <CustomWrapper>
        <DeleteSmsTemplateModal {...mockProps} />
      </CustomWrapper>
    );
    fireEvent.click(screen.getByText('Yes, Delete'));
  });
});
