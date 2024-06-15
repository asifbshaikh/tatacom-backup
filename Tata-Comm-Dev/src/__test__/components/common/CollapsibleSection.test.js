import { describe, expect, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import CollapsibleSection from 'components/common/CollapsibleSection';
import { CustomWrapper } from 'test-utils';

describe('Collapse section Component', () => {
  test('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <CollapsibleSection title="contacts.contact_attributes">
          <div>Collapse Content</div>
        </CollapsibleSection>
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('Open collapsed body', async () => {
    const { getByText, getByRole, container } = render(
      <CustomWrapper>
        <CollapsibleSection title="contacts.contact_attributes">
          <div>Collapse Content</div>
        </CollapsibleSection>
      </CustomWrapper>
    );
    expect(getByText('Collapse Content')).toBeInTheDocument();
    const header = getByRole('heading', { level: 6 });
    fireEvent.click(header);
    await waitFor(() => {
      const showCollapse = container.querySelector('.show');
      expect(showCollapse).toBeInTheDocument();
    });
  });
});
