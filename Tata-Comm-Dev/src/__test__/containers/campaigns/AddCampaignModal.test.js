import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import AddCampaignModal from 'containers/campaigns/AddCampaignModal';

describe('Add Campaign Modal component', () => {
  it('render without crashing', () => {
    const props = {
      modalOpen: true,
      toggleModal: jest.fn(),
      isOngoingType: jest.fn(),
      editFormData: {},
    };
    const { asFragment } = render(
      <CustomWrapper>
        <AddCampaignModal {...props} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
