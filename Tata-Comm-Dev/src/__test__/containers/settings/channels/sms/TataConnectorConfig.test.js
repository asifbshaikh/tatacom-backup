import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import TataConnectorConfig from 'containers/settings/channels/sms/TataConnectorConfig';

describe('TataConnectorConfig component', () => {
  it('render TataConnectorConfig without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <TataConnectorConfig/>
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });


  it('handle provider dropdown change', () => {
   render(
      <CustomWrapper>
        <TataConnectorConfig/>
      </CustomWrapper>
    );
    const selector = screen.getByTestId("providerSelect");

    //default value should be tata
    expect(selector.value).toBe('tata')
    fireEvent.change(selector, { target: { value: 'Kaleyra' } })
    //onChange value should change
    expect(selector.value).toBe('Kaleyra')
  });
});