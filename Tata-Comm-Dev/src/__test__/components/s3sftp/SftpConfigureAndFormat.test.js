import { screen, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import SFTPConfigureAndFormat from 'components/s3-sftp/SFTPConfigureAndFormat';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';

describe('SftpConfigureAndFormat component', () => {
  const commonProps = {};
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SFTPConfigureAndFormat {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SFTPConfigureAndFormat {...commonProps} />
      </CustomWrapper>
    );
    //check if the component renders the message
    expect(getByText('Configure SFTP')).toBeInTheDocument();
  });

  it('handlePreviousBtnClick should be called when the previous button is clicked', () => {
    const previousMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <SFTPConfigureAndFormat previous={previousMock} />
      </CustomWrapper>
    );

    const previousButton = getByText('Previous');

    act(() => {
      fireEvent.click(previousButton);
    });
    expect(previousMock).toHaveBeenCalled();
  });

  it('handleSubmit should be called when the form is submitted', () => {
    const nextMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <SFTPConfigureAndFormat next={nextMock} />
      </CustomWrapper>
    );

    const username = screen.getByTestId('username');
    fireEvent.change(username, { target: { value: 'test' } });

    const password = screen.getByTestId('password');
    fireEvent.change(password, { target: { value: 'abcxyz-2892982' } });

    const folderUrl = screen.getByTestId('folderUrl');
    fireEvent.change(folderUrl, { target: { value: 'https://api.test.com' } });

    const importName = screen.getByTestId('importName');
    fireEvent.change(importName, { target: { value: 'Import1' } });

    const submitButton = getByText('Next');
    act(() => {
      fireEvent.click(submitButton);
    });

    expect(nextMock).toBeCalledTimes(1);
  });
});
