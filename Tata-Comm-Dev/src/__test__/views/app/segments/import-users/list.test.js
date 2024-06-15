import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import ImportUserUploadList from 'views/app/segments/import-users/list';
import { CustomWrapper } from 'test-utils';

describe('Import Users listing component', () => {
  const match = { url: '/app/accounts/3/segments/import-users/list', path: '' };
  const commonProps = { match };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ImportUserUploadList {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
