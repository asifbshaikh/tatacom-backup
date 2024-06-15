import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import AddSmsTemplateModal from 'containers/campaigns/sms-campaign/smsTemplate/AddSmsTemplateModal';

describe('AddSmsTemplate component', () => {
  const mockToggleModal = jest.fn();
  const mockGetSenderId = jest.fn();
  const mockAddSmsTemplate = jest.fn();
  const mockAddSmsTemplateClean = jest.fn();
  const mockUpdateSmsTemplate = jest.fn();
  const mockUpdateSmsTemplateClean = jest.fn();

  const mockProps = {
    modalOpen: true,
    formLoading: false,
    toggleModal: mockToggleModal,
    editFormData: { id: 123 },
    viewData: false,
    addSmsTemplateClean: mockAddSmsTemplateClean,
    updateSmsTemplateClean: mockUpdateSmsTemplateClean,
    updateSmsTemplate: mockUpdateSmsTemplate,
    addSmsTemplate: mockAddSmsTemplate,
    formSuccess: false,
    formError: null,
    senderIdsList: [],
    getSenderId: mockGetSenderId,
  };

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <AddSmsTemplateModal {...mockProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('modal is closed initially', () => {
    render(
      <CustomWrapper>
        <AddSmsTemplateModal {...mockProps} modalOpen={false} />
      </CustomWrapper>
    );
    expect(screen.queryByTestId('add-sms-template-modal')).toBeNull();
  });
  it('calls updateSmsTemplate when editFormData has an id', () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <AddSmsTemplateModal {...mockProps} />
      </CustomWrapper>
    );

    const formData = {
      name: 'Test Name',
      description: 'Test Description',
    };

    fireEvent.input(getByTestId('name-input'), {
      target: { value: formData.name },
    });
    fireEvent.input(getByTestId('description-input'), {
      target: { value: formData.description },
    });
    fireEvent.submit(getByTestId('add-sms-template-modal'));

    waitFor(() => {
      expect(mockUpdateSmsTemplate).toHaveBeenCalledWith(formData);
      expect(mockAddSmsTemplate).not.toHaveBeenCalled();
    });
  });
  it('calls addSmsTemplate when editFormData does not have an id', () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <AddSmsTemplateModal {...mockProps} editFormData={{}} />
      </CustomWrapper>
    );

    const formData = {
      name: 'Test Name',
      description: 'Test Description',
      sender_id: 'sender123',
      template_id: 'template456',
      registered_dlt: 'registered_dlt789',
      telemarketer_id: 'telemarketerID',
      pe_id: 'peID',
      message: 'Test Message',
    };

    fireEvent.input(getByTestId('name-input'), {
      target: { value: formData.name },
    });
    fireEvent.input(getByTestId('description-input'), {
      target: { value: formData.description },
    });
    fireEvent.input(getByTestId('dropdown-values'), {
      target: { value: formData.sender_id },
    });
    fireEvent.input(getByTestId('template_id-input'), {
      target: { value: formData.template_id },
    });
    fireEvent.input(getByTestId('registered_dlt-input'), {
      target: { value: formData.registered_dlt },
    });
    fireEvent.input(getByTestId('telemarketer_id-input'), {
      target: { value: formData.telemarketer_id },
    });
    fireEvent.input(getByTestId('pe_id-input'), {
      target: { value: formData.pe_id },
    });
    fireEvent.input(getByTestId('message-input'), {
      target: { value: formData.message },
    });
    fireEvent.submit(getByTestId('add-sms-template-modal'));

    waitFor(() => {
      expect(mockAddSmsTemplate).toHaveBeenCalledWith(formData);
      expect(mockUpdateSmsTemplate).not.toHaveBeenCalled();
    });
  });
  it('assigns heading for viewData', () => {
    const { getByText } = render(
      <CustomWrapper>
        <AddSmsTemplateModal {...mockProps} viewData={true} />
      </CustomWrapper>
    );
    expect(getByText('Template')).toBeInTheDocument();
  });

  it('assigns heading for edit existing data', () => {
    const { getByText } = render(
      <CustomWrapper>
        <AddSmsTemplateModal {...mockProps} />
      </CustomWrapper>
    );
    expect(getByText('Update Template')).toBeInTheDocument();
  });
  it('calls cleanup functions and toggles modal when modal is open', () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <AddSmsTemplateModal {...mockProps} />
      </CustomWrapper>
    );
    fireEvent.click(getByTestId('cancel-button'));
  });
});
