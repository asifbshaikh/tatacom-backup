import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import WhatsAppListing from 'containers/settings/channels/WhatsAppListing';

describe('WhatsApp listing component test case', () => {
  it('Checking the aviliability of connector config and fc & dnd', () => {
    render(
      <CustomWrapper>
        <WhatsAppListing />
      </CustomWrapper>
    );

    const ConnetorConfigText = screen.getByText(/connector config/i);
    expect(ConnetorConfigText).toBeInTheDocument();

    const FcAndDndText = screen.getByText(/fc & dnd/i);
    expect(FcAndDndText).toBeInTheDocument();
  });

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <WhatsAppListing />
      </CustomWrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
