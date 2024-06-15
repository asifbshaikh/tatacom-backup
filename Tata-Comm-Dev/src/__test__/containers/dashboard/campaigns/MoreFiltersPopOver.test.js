import React from 'react';
 import { fireEvent, render, screen } from '@testing-library/react';
 import { CustomWrapper } from 'test-utils';
 import userEvent from '@testing-library/user-event';
 import DashboadCampaignsList from 'views/app/dashboards/campaigns/list';

 describe('Help Center Form testing', () => {
    const commonProps = {
        heading: 'menu.import-users',
        match: { url: '/app/accounts/3/segments/import-users/list', path: '' },
      };
         it('adds values to the each field', () => {
             const {container} = render(
                 <CustomWrapper>
                     <DashboadCampaignsList {...commonProps} />
                 </CustomWrapper>
             );
            const filterBtn = screen.getByRole('button',{
                name: 'More Filters',
            });
            fireEvent.click(filterBtn);  
            expect(screen.getAllByText('More Filters')[1]).toBeInTheDocument();

            const status = screen.getByText(/Select status/i);
            fireEvent.click(status);  
            const status_value = screen.getByText(/Draft/i);
            fireEvent.click(status_value);  
            
            const created_By = screen.getByText(/Created by/i);
            userEvent.type(created_By,'tirouvengadaramanane2@persistent.com');
 
             const submitButton = screen.getByText('Apply');
             fireEvent.click(submitButton);
         });
         it('click on cancel', () => {
            const {container} = render(
                <CustomWrapper>
                    <DashboadCampaignsList {...commonProps} />
                </CustomWrapper>
            );
        const filterBtn = screen.getByRole('button',{
            name: 'More Filters',
        });
        fireEvent.click(filterBtn);         

            const cancelButton = screen.getByText('Cancel');
            fireEvent.click(cancelButton);
        });
	 });