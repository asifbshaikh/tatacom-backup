import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import ImportUserUploads from 'views/app/segments/import-users/upload';
import { CustomWrapper } from 'test-utils';

describe('Import Users Upload component', () => {
  const match = { url: '/app/accounts/3/segments/import-users/list', path: '' };
  const commonProps = { match };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ImportUserUploads {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
