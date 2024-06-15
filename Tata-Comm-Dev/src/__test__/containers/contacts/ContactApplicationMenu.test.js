import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';

describe('ContactApplicationMenu component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ContactApplicationMenu />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
