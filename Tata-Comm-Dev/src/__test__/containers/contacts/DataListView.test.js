import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import DataListView from 'containers/contacts/DataListView';

describe('DataListView component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DataListView />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
