import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import TemplateDragAndDrop from 'containers/campaigns/email/TemplateDragAndDrop';
import configureStore from 'redux-mock-store';
import templateDefaultData from 'data/templateDefaultData';
import { getEmailTemplateById } from 'redux/actions';
jest.mock('redux/actions', () => {
  return {
    ...jest.requireActual('redux/actions'),
    getEmailTemplateById: jest.fn(),
  };
});

describe('TemplateDragAndDrop component', () => {
  const mockStore = configureStore([]);
  const initialState = {
    campaignsApp: {
      emailTemplate: {
        success: true,
        id: 'exampleId',
        name: 'Example Template',
        body: '<p>Example Body</p>',
        design: templateDefaultData,
      },
    },
  };
  const store = mockStore(initialState);
  const loadDesignFn = jest.fn();
  const emailEditorRef = {
    current: { editor: { exportHtml: jest.fn(), loadDesign: loadDesignFn } },
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <TemplateDragAndDrop emailEditorRef={emailEditorRef} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should open and close the dropdown menu', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <TemplateDragAndDrop emailEditorRef={emailEditorRef} />
      </CustomWrapper>
    );
    const toggleButton = getByText('Template Actions');
    const dropdownItem = getByText('Save Template');
    const downloadFile = getByText('Download');
    const changeTemplate = getByText('Change Template');

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(toggleButton).toBeInTheDocument();
    });

    fireEvent.click(toggleButton);
    expect(dropdownItem).not.toBeInTheDocument();
    expect(downloadFile).not.toBeInTheDocument();
    expect(changeTemplate).not.toBeInTheDocument();
  });
  it('should open and close the modal dialog', () => {
    const { getByText } = render(
      <CustomWrapper>
        <TemplateDragAndDrop emailEditorRef={emailEditorRef} />
      </CustomWrapper>
    );
    const saveTemplateButton = getByText('Save Template');

    fireEvent.click(saveTemplateButton);
    const modalTitle = getByText('Save');
    expect(modalTitle).toBeInTheDocument();
    const modalCancel = getByText('Save');
    fireEvent.click(getByText('Cancel'));
    expect(modalCancel).toBeInTheDocument();
  });
  it('handleChangeTemplateConfirmation resets state and closes modal', () => {
    const mockToggleChangeTemplateModal = jest.fn();
    const mockResetSelectedTemplateData = jest.fn();
    const mockTemplatePageChangeFnRef = { current: jest.fn() };
    const { getByText } = render(
      <CustomWrapper>
        <TemplateDragAndDrop
          isChoose={true}
          setIsChoose={jest.fn()}
          resetSelectedTemplateData={mockResetSelectedTemplateData}
          setChangeTemplateModalOpen={mockToggleChangeTemplateModal}
          emailEditorRef={emailEditorRef}
          templatePageChangeRef={mockTemplatePageChangeFnRef}
        />
      </CustomWrapper>
    );

    const changeTemplateButton = getByText('Change Template');
    fireEvent.click(changeTemplateButton);
    const confirmButton = getByText('Confirm');
    fireEvent.click(confirmButton);
    expect(mockTemplatePageChangeFnRef.current).toHaveBeenCalled();
  });
  it('calls downloadHTMLTemplate when clicking the download button', () => {
    const downloadHTMLTemplate = jest.fn();
    render(
      <CustomWrapper>
        <TemplateDragAndDrop store={store} emailEditorRef={emailEditorRef} />
      </CustomWrapper>
    );

    fireEvent.click(screen.getByText('Download'));

    waitFor(() => {
      expect(downloadHTMLTemplate).toHaveBeenCalled();
      expect(downloadHTMLTemplate).toHaveBeenCalledWith(expect.any(String));
    });
  });
  it('Show error notification if there is error message', async () => {
    const newInitialState = {
      campaignsApp: {
        emailTemplate: {
          success: false,
          id: '123',
          name: 'Example Template',
          body: '<p>Example Body</p>',
          design: templateDefaultData,
          error: ['Name already taken'],
        },
      },
    };
    const updatedStore = mockStore(newInitialState);
    render(
      <CustomWrapper>
        <TemplateDragAndDrop
          store={updatedStore}
          emailEditorRef={emailEditorRef}
        />
      </CustomWrapper>
    );
    waitFor(() => {
      expect(screen.getByText('Name already taken')).toBeInTheDocument();
    });
  });

  it('Call getEmailTemplateById action if there is ID in redux and no other template date. This is for draft case.', async () => {
    const newInitialState = {
      campaignsApp: {
        emailTemplate: {
          success: false,
          id: '123',
        },
      },
    };
    const updatedStore = mockStore(newInitialState);
    render(
      <CustomWrapper>
        <TemplateDragAndDrop
          store={updatedStore}
          emailEditorRef={emailEditorRef}
        />
      </CustomWrapper>
    );
    waitFor(() => {
      expect(getEmailTemplateById).toHaveBeenCalled();
    });
  });
  it('If template data already exist save template confirmation button should have update button', () => {
    const { getByText } = render(
      <CustomWrapper>
        <TemplateDragAndDrop emailEditorRef={emailEditorRef} store={store} />
      </CustomWrapper>
    );
    const saveTemplateButton = getByText('Save Template');
    fireEvent.click(saveTemplateButton);
    const updateBtn = getByText('Update');
    fireEvent.click(updateBtn);
    expect(updateBtn).toBeInTheDocument();
  });
});
