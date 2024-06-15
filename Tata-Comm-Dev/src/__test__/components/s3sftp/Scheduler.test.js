import React, { createRef } from 'react';
import { describe, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import Scheduler from 'components/s3-sftp/Scheduler';
import { CustomWrapper } from 'test-utils';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});

describe('Schedule Component', () => {
  const formRef = React.createRef(null);

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <Scheduler formRef={formRef} previous={jest.fn()} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('render one time component', () => {
    const formError = { errorMsg: 'render failed' };
    const { getByText } = render(
      <CustomWrapper>
        <Scheduler
          formRef={formRef}
          previous={jest.fn()}
          campaignType="one_time"
          formSuccess={true}
          formError={formError}
        />
      </CustomWrapper>
    );
    expect(getByText(/Start DB import immediately/i)).toBeInTheDocument();
  });

  it('render periodic component', () => {
    const item = 'periodic';
    if (item === 'periodic') {
      const { getByText } = render(
        <CustomWrapper>
          <Scheduler
            formRef={formRef}
            previous={jest.fn()}
            campaignType="periodic"
          />
        </CustomWrapper>
      );
      expect(getByText(/Start DB import immediately/i)).toBeInTheDocument();
    }
  });

  it('pervious and publish buttons click', () => {
    const { getByRole } = render(
      <CustomWrapper>
        <Scheduler
          formRef={formRef}
          previous={jest.fn()}
          campaignType="one_time"
        />
      </CustomWrapper>
    );

    const previousBtn = getByRole('button', {
      name: /Previous/i,
    });
    const publishBtn = getByRole('button', {
      name: /Publish/i,
    });

    fireEvent.click(previousBtn);
    fireEvent.click(publishBtn);

    expect(previousBtn).toBeValid();
    expect(publishBtn).toBeValid();
  });

  it('set default active tab as One Time', () => {
    const { getByText } = render(
      <CustomWrapper>
        <Scheduler formRef={formRef} />
      </CustomWrapper>
    );
    const schedulerTab = getByText('One Time');
    expect(schedulerTab).toHaveClass('active');
  });

  it('changes active tab when clicked', () => {
    const { getByText } = render(
      <CustomWrapper>
        <Scheduler formRef={formRef} />
      </CustomWrapper>
    );
    const scheduleTab = getByText('Periodic');
    fireEvent.click(scheduleTab);
    expect(scheduleTab).toHaveClass('active');
  });
});
