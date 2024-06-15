import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SavedTemplates from 'containers/campaigns/email/SavedTemplates';
import { CustomWrapper } from 'test-utils';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);
describe('SavedTemplates Component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SavedTemplates />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders loading state', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SavedTemplates loading={true} />
      </CustomWrapper>
    );
    const loadingText = getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
  });
  it('filters templates based on search query (not matching)', async () => {
    const store = mockStore({
      campaignsApp: {
        loading: false,
        error: null,
        emailCampaignTemplates: {
          savedTemplates: [
            { id: 1, name: 'Template 1', body: '<p>Template content</p>' },
            { id: 2, name: 'Template 2', body: '<p>Another template</p>' },
          ],
          totalCount: 2,
        },
      },
    });

    render(
      <CustomWrapper>
        <SavedTemplates loading={false} store={store} />
      </CustomWrapper>
    );

    fireEvent.change(screen.getByPlaceholderText('Search for templates'), {
      target: { value: 'Non-existent Template' },
    });

    await waitFor(() => {
      expect(screen.queryByText('Template 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Template 2')).not.toBeInTheDocument();
    });
  });
});
