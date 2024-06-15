import { screen, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import S3ConfigureAndFormat from 'components/s3-sftp/S3ConfigureAndFormat';
import { CustomWrapper } from 'test-utils';
import { act } from 'react-dom/test-utils';

describe('S3ConfigureAndFormat component', () => {
  const commonProps = {};
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <S3ConfigureAndFormat {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <S3ConfigureAndFormat {...commonProps} />
      </CustomWrapper>
    );
    //check if the component renders the message
    expect(getByText('S3 Bucket Name')).toBeInTheDocument();
  });

  it('handlePreviousBtnClick should be called when the previous button is clicked', () => {
    const previousMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <S3ConfigureAndFormat previous={previousMock} />
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
        <S3ConfigureAndFormat next={nextMock} />
      </CustomWrapper>
    );

    const s3bucketname = screen.getByTestId('s3bucketname');
    fireEvent.change(s3bucketname, { target: { value: 'test' } });

    const accessKey = screen.getByTestId('accessKey');
    fireEvent.change(accessKey, { target: { value: 'abcxyz-2892982' } });

    const secretKey = screen.getByTestId('secretKey');
    fireEvent.change(secretKey, { target: { value: 'abc123@' } });

    const region = screen.getByTestId('region');
    fireEvent.change(region, { target: { value: '2' } });

    const folderPath = screen.getByTestId('folderPath');
    fireEvent.change(folderPath, { target: { value: 'https://api.test.com' } });

    const importName = screen.getByTestId('importName');
    fireEvent.change(importName, { target: { value: 'Import1' } });

    const submitButton = getByText('Next');
    act(() => {
      fireEvent.click(submitButton);
    });

    expect(nextMock).toBeCalledTimes(1);
  });

  it('handlePreviousBtnClick should be called when the previous button is clicked', () => {
    const previousMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <S3ConfigureAndFormat previous={previousMock} />
      </CustomWrapper>
    );

    const previousButton = getByText('Previous');

    act(() => {
      fireEvent.click(previousButton);
    });
    expect(previousMock).toHaveBeenCalled();
  });
});
