import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import DashboadCampaignsList from 'views/app/dashboards/campaigns/list';
import { act } from 'react-dom/test-utils';

describe('ListImport component', () => {
  const commonProps = {
    heading: 'menu.import-users',
    match: { url: '/app/accounts/3/segments/import-users/list', path: '' },
  };
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DashboadCampaignsList {...commonProps} />
      </CustomWrapper>
    );
    const exportBtn = screen.getByText('Export');
    fireEvent.click(exportBtn);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });
  it('click on download without inputs', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <DashboadCampaignsList {...commonProps} />
      </CustomWrapper>
    );
    const exportBtn = screen.getByText('Export');
    fireEvent.click(exportBtn);
    act(() => {
      fireEvent.click(screen.getByText('Download'));
    });
  });
  it('click on download with inputs', () => {
    const { container } = render(
      <CustomWrapper>
        <DashboadCampaignsList {...commonProps} />
      </CustomWrapper>
    );
    const exportBtn = screen.getByText('Export');
    fireEvent.click(exportBtn);
    const startDate = screen.getByText('Custom Campaign Start Date');
    fireEvent.click(startDate);
    const targetDate = screen.getAllByText('15');
    fireEvent.click(targetDate[1]);

    const endDate = screen.getByText('Custom Campaign End Date');
    fireEvent.click(endDate);
    const endTargetDate = screen.getAllByText('16');
    fireEvent.click(endTargetDate[1]);

    const format = screen.getByText('Format');
    fireEvent.click(format);

    const cancel = screen.getByText('Cancel');
    fireEvent.click(cancel);
  });
});
