import { describe, it } from '@jest/globals';
import { render } from '@testing-library/react';
import SaveAndDeleteModal from 'containers/inbox/SaveAndDeleteModal';
import { CustomWrapper } from 'test-utils';

describe('saveAndDeleteModal component', () => {
  const mockObject = {
    header: 'Delete Filter',
    children: <h1>Are you sure you want to deelete filter</h1>,
    leftHandleOnClick: jest.fn(),
    rightHandleOnClick: jest.fn(),
    filterIsOpen: true,
    inputToggle: jest.fn(),
    formSuccess: true,
    formError: { error: 'unhandled response' },
    successMsg: 'Filter Deleted Success',
  };

  it('render saveAndDeleteModal with Heading', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <SaveAndDeleteModal {...mockObject} />
      </CustomWrapper>
    );
    expect(getByText('Delete Filter'));
  });

  it('render saveAndDeleteModal with Heading', async () => {
    mockObject.formSuccess = false;
    mockObject.formError = {};
    const { getByText } = render(
      <CustomWrapper>
        <SaveAndDeleteModal {...mockObject} />
      </CustomWrapper>
    );
    expect(getByText('Are you sure you want to deelete filter'));
  });
});
