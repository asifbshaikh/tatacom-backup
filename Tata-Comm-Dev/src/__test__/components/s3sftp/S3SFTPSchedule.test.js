import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import S3SFTPSchedule from 'components/s3-sftp/S3SFTPSchedule';
import { CustomWrapper } from 'test-utils';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});

describe('Db Import Scheduler Component', () => {
  const commonProps = {
    formRef: {},
    sourceType: 'Database',
    audienceType: 'registered_audience',
    previous: jest.fn(),
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <S3SFTPSchedule {...commonProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
