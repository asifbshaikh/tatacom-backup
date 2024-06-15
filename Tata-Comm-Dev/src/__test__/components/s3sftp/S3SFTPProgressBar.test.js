import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import S3SFTPProgressBar from 'components/s3-sftp/S3SFTPProgressBar';
import { CustomWrapper } from 'test-utils';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});

const dbImportSteps = [
  {
    id: 'source',
    name: 'Source',
  },
  {
    id: 'format',
    name: 'Format',
  },
  {
    id: 'schedule',
    name: 'Schedule',
  },
];

const pushed = jest.fn();
describe('Form component', () => {
  const commonProps = {
    match: { url: '', path: '' },
    next: jest.fn(),
    dbImportSteps,
    formatStep: { route: 'format' },
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <S3SFTPProgressBar {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
