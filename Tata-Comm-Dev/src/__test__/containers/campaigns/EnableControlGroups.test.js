import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import userEvent from '@testing-library/user-event';
const {
  default: EnableControlGroups,
} = require('containers/campaigns/EnableControlGroups');
const { CustomWrapper } = require('test-utils');

describe('render component with initial values', () => {
  const form = {
    values: {
      globalControlGroup: false,
      campaignControlGroup: false,
    },
    setFieldValue: jest.fn(),
  };
  it('render heading and switches', () => {
    render(
      <CustomWrapper>
        <EnableControlGroups form={form} />
      </CustomWrapper>
    );

    expect(
      screen.getByRole('heading', {
        name: /enable control groups/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/global control group/i));
    expect(screen.getByText(/campaign control group/i));
  });
  it('click on global control switch', () => {
    render(
      <CustomWrapper>
        <EnableControlGroups form={form} />
      </CustomWrapper>
    );

    userEvent.click(screen.getByTestId('globalControlGroup'));
    expect(form.setFieldValue).toHaveBeenCalledTimes(1);
  });
  it('click on campaign control switch', () => {
    render(
      <CustomWrapper>
        <EnableControlGroups form={form} />
      </CustomWrapper>
    );

    userEvent.click(screen.getByTestId('campaignControlGroup'));
    expect(form.setFieldValue).toHaveBeenCalledTimes(1);
  });
});
