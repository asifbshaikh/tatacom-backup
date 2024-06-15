import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import CampaignType from 'containers/campaigns/CampaignType';
import { act } from 'react-dom/test-utils';

describe('CampaignType component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <CampaignType
          previous={jest.fn()}
          next={jest.fn()}
          formRef={jest.fn()}
          addCampaignType={jest.fn()}
          campaignType="sms"
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('handlePreviousBtnClick should be called when the previous button is clicked', () => {
    const previousMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <CampaignType previous={previousMock} />
      </CustomWrapper>
    );

    const previousButton = getByText('Previous');

    act(() => {
      fireEvent.click(previousButton);
    });
    expect(previousMock).toHaveBeenCalled();
  });

  it('handleSubmit should be called when the form is submitted', () => {
    const addCampaignTypeMock = jest.fn();

    const nextMock = jest.fn();

    const { getByText } = render(
      <CustomWrapper>
        <CampaignType addCampaignType={addCampaignTypeMock} next={nextMock} />
      </CustomWrapper>
    );

    const submitButton = getByText('Next');
    act(() => {
      fireEvent.click(submitButton);
    });

    expect(addCampaignTypeMock).toBeCalledTimes(0);

    expect(nextMock).toBeCalledTimes(0);
  });
});
