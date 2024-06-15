import React from 'react';
import { render } from '@testing-library/react';
import SavedTemplatesWrapper from 'containers/campaigns/email/SavedTemplatesWrapper';
import { CustomWrapper } from 'test-utils';

const mockOnChooseExistingTemplate = jest.fn();

const sampleSavedTemplates = [
  { id: 1, name: 'Template 1', body: '<p>Template 1 content</p>' },
  { id: 2, name: 'Template 2', body: '<p>Template 2 content</p>' },
];

describe('SavedTemplatesWrapper Component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SavedTemplatesWrapper
          onChooseExistingTemplate={mockOnChooseExistingTemplate}
          savedTemplates={sampleSavedTemplates}
          searchQuery=""
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('filters templates based on search query', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SavedTemplatesWrapper
          onChooseExistingTemplate={mockOnChooseExistingTemplate}
          savedTemplates={sampleSavedTemplates}
          searchQuery=""
        />
      </CustomWrapper>
    );

    const template2Button = getByText('Template 2');
    expect(template2Button).toBeInTheDocument();
  });
});
