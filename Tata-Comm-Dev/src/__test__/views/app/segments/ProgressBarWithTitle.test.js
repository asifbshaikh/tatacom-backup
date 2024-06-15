import { render, within } from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import ProgressBarWithTitle from 'views/app/segments/ProgressBarWithTitle';

describe('List All segments headings component', () => {
  const mockObj = {
    title: 'PUSH',
    percent: 80,
    total: 100,
    outOfValue: 50,
  };

  test('render ProgressBarWithTitle component ', () => {
    const mockObj1 = { ...mockObj, endIndex: 8 };
    const { getByText } = render(
      <CustomWrapper>
        <ProgressBarWithTitle {...mockObj1} />
      </CustomWrapper>
    );
    const titleText = getByText('PUSH');
    within(titleText).getByText(/50\/100/i);
    expect(titleText).toBeInTheDocument();
  });
  test('render ProgressBarWithTitle component ', () => {
    const { getByText } = render(
      <CustomWrapper>
        <ProgressBarWithTitle />
      </CustomWrapper>
    );
    const valueoutOfTotalCount = getByText(/0\/0/i);
    expect(valueoutOfTotalCount).toBeInTheDocument();
  });
});
