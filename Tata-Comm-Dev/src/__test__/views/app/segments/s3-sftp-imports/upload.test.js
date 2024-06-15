import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import S3SFTPUploads from 'views/app/segments/s3-sftp-imports/upload';
jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});
describe('S3SFTP Upload component', () => {
  const match = { url: '/app/accounts/3/segments/db-imports/upload', path: '' };
  const commonProps = { match };

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <S3SFTPUploads {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
