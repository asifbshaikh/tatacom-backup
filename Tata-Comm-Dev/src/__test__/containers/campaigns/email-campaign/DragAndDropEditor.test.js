import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DragAndDropEditor from 'containers/campaigns/email/DragAndDropEditor';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
describe('DragAndDropEditor component', () => {
  const loadDesignFn = jest.fn();
  const emailEditorRef = {
    current: { editor: { exportHtml: jest.fn(), loadDesign: loadDesignFn } },
  };

  const initialState = {
    campaignsApp: {
      loading: true,
      error: null,
      emailCampaignTemplates: {
        savedTemplates: [],
        totalCount: 0,
      },
      emailTemplate: null,
    },
  };

  const store = mockStore(initialState);

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DragAndDropEditor
          emailEditorRef={emailEditorRef}
          setDisableNextButton={jest.fn()}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders CardContentConfiguration after clicking on a TemplateCard', () => {
    const formRef = { formError: { errorMsg: 'error message' } };

    render(
      <CustomWrapper>
        <DragAndDropEditor
          formRef={formRef}
          setEnableButton={jest.fn()}
          emailEditorRef={emailEditorRef}
          setDisableNextButton={jest.fn()}
        />
      </CustomWrapper>
    );
    const templateCard = screen.getByText('BLANK TEMPLATE');

    expect(templateCard).toBeInTheDocument();
    const chooseBtn = screen.getByText('Choose');
    fireEvent.click(chooseBtn);
  });

  it('allows searching for templates', async () => {
    const { getByTestId, getByText } = render(
      <CustomWrapper>
        <DragAndDropEditor
          store={store}
          emailEditorRef={emailEditorRef}
          setDisableNextButton={jest.fn()}
        />
      </CustomWrapper>
    );

    const searchInput = getByTestId('search-input').querySelector('input');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(getByText('Loading...')).toBeInTheDocument();
    });
  });
});
