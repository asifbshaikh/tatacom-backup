import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoalsContainer from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsContainer';
import { createRef } from 'react';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});
describe('ScheduleAndGoalsContainer component', () => {
  const ref = createRef(null);
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ScheduleAndGoalsContainer
          formRef={ref}
          channelType="sms"
          campaignType="one_time"
          previous={jest.fn()}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('render timezone component', () => {
    const { getByTestId } = render(
      <CustomWrapper>
        <ScheduleAndGoalsContainer
          formRef={ref}
          channelType="sms"
          campaignType="one_time"
          previous={jest.fn()}
        />
      </CustomWrapper>
    );
    const timeZoneSelect = getByTestId('react-timezone-mock');
    expect(timeZoneSelect).toBeInTheDocument();
  });
  it('render other channel type', () => {
    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoalsContainer
          formRef={ref}
          channelType="email"
          campaignType="one_time"
          previous={jest.fn()}
        />
      </CustomWrapper>
    );
    const heading = getByRole('heading', {
      name: /Schedule Campaign/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
