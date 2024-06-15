import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import CreateCampaignAccordion from 'containers/campaigns/CreateCampaignAccordion';
import React from 'react';

describe('CreateCampaignAccordion component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <CreateCampaignAccordion />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('OnClick Accordion Heading', () => {
    const setSateMock = jest.fn();
    const openAccordion = true;
    const useStateMock = (useState) => [openAccordion, setSateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    const { getByTestId } = render(
      <CustomWrapper>
        <CreateCampaignAccordion />
      </CustomWrapper>
    );

    const header = getByTestId('accordionHeading');
    fireEvent.click(header);
    expect(setSateMock).toBeCalledTimes(0);
  });
});
