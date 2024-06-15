import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import AddCommentsContact from 'containers/contacts/AddCommentsContact';

describe('AddCommentsContact component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <AddCommentsContact />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('submits the form and triggers success notification', async () => {
    const addCommentsContactItemAction = jest.fn();
    const addCommentsContactItemCleanAction = jest.fn();

    render(
      <CustomWrapper>
        <AddCommentsContact
          id="1"
          formSuccess={false}
          formError={null}
          formLoading={false}
          addCommentsContactItemAction={addCommentsContactItemAction}
          addCommentsContactItemCleanAction={addCommentsContactItemCleanAction}
        />
      </CustomWrapper>
    );

    const textarea = screen.getByPlaceholderText('Add a note');
    const submitButton = screen.getByText('Add');

    fireEvent.change(textarea, { target: { value: 'Test comment' } });
    fireEvent.click(submitButton);
  });
});
