import { screen, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import ConfigureAndFormat from 'components/s3-sftp/ConfigureAndFormat';
import { CustomWrapper } from 'test-utils';
const commonProps = {};

describe('ConfigureAndFormat component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ConfigureAndFormat {...commonProps} />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('renders the component', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ConfigureAndFormat {...commonProps} />
      </CustomWrapper>
    );
  });
});
