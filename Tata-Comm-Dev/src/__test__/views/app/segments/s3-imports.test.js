import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import S3SFTPImports from 'views/app/segments/s3-sftp-imports';
import { CustomWrapper } from 'test-utils';

describe('S3Imports component', () => {
  const match = { url: '/app/accounts/95/segments/db-imports/' };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <S3SFTPImports match={match} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
