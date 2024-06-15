import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoalsDeliveryControl from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsDeliveryControl';

describe('ScheduleAndGoalsDeliveryControl component', () => {
  const form = {
    values: {
      deliveryControl: {
        countFrequencyCapping: false,
        ignoreFrequencyCapping: false,
      },
      requestLimit: '',
    },
    setFieldValue: jest.fn(),
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ScheduleAndGoalsDeliveryControl form={form} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('switch buttons click without crashing', () => {
    render(
      <CustomWrapper>
        <ScheduleAndGoalsDeliveryControl form={form} />
      </CustomWrapper>
    );
    const ignoreFrequencyCapping = screen.getByTestId('ignoreFrequencyCapping');
    fireEvent.click(ignoreFrequencyCapping);
    const countFrequencyCapping = screen.getByTestId('countFrequencyCapping');
    fireEvent.click(countFrequencyCapping);
    const requestLimit = screen.getByTestId('requestLimit');
    fireEvent.change(requestLimit, { target: { value: '10' } });
  });
});
