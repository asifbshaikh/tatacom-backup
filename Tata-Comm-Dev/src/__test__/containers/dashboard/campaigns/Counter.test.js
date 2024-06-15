import { describe, it } from '@jest/globals';
import { render, waitFor } from '@testing-library/react';
import Counter from 'containers/dashboards/campaigns/Counter';
import { CustomWrapper } from 'test-utils';

describe('Counter component', () => {
  it('Render Counter', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <Counter totalCount={20} />
      </CustomWrapper>
    );

    await waitFor(() => {
      const text = getByText('4');
      expect(text).toBeInTheDocument();
    });
  });
});
