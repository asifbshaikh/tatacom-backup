import { screen, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import DeleteDBImportModal from 'components/s3-sftp/DeleteDBImportModal';
import { act } from 'react-dom/test-utils';
import configureMockStore from 'redux-mock-store';

const commonProps = {};

const initialState = {
  s3sftpApp: {
    errorImportDeleteAdd: { errors: 'Error message' },
    successImportDeleteAdd: true,
  },
};
const mockStore = configureMockStore();

const store = mockStore(initialState);
const storeError = mockStore({
  s3sftpApp: {
    errorImportDeleteAdd: { errorMsg: 'Error message' },
    successImportDeleteAdd: { message: 'Success message' },
  },
});

describe('DeleteDBImportModal component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DeleteDBImportModal {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <DeleteDBImportModal {...commonProps} />
      </CustomWrapper>
    );
  });

  it('test deactivate submit button click', () => {
    const { getByText } = render(
      <CustomWrapper>
        <DeleteDBImportModal
          {...commonProps}
          modalOpen={true}
          toggleModal={jest.fn()}
          store={store}
        />
      </CustomWrapper>
    );

    expect(getByText('Deactivate Database Import')).toBeInTheDocument();
    const yesButton = getByText('Yes, Deactivate');

    act(() => {
      fireEvent.click(yesButton);
    });
  });

  it('test cancel deactivate button click', () => {
    const { getByText } = render(
      <CustomWrapper>
        <DeleteDBImportModal
          {...commonProps}
          modalOpen={true}
          toggleModal={jest.fn()}
          store={storeError}
        />
      </CustomWrapper>
    );

    expect(getByText('Deactivate Database Import')).toBeInTheDocument();
    const noButton = getByText('No, Keep');

    act(() => {
      fireEvent.click(noButton);
    });
  });
});
