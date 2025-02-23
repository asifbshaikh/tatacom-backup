import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import HelpCenterForm from 'views/app/helpCenter/HelpCenterForm';
import HelpCenter from 'views/app/helpCenter';
import userEvent from '@testing-library/user-event';

describe('Help Center Form testing', () => {
  const commonProps = {
    match: { url: '/app/accounts/3/helpCenter', path: '' },
  };
  it('adds values to the each field', () => {
    const { container } = render(
      <CustomWrapper>
        <HelpCenter {...commonProps}>
          <HelpCenterForm />
        </HelpCenter>
      </CustomWrapper>
    );
    const email = container.querySelector(`input[name="emailID"]`);
    fireEvent.change(email, { target: { value: 'test@gmail.com' } });
    expect(screen.getByText(/^CC$/i)).toBeInTheDocument();

    const AdditionalEmail = container.querySelector(
      `input[name="addtionalEmails"]`
    );
    fireEvent.change(AdditionalEmail, { target: { value: 'test2@gmail.com' } });
    expect(screen.getByText(/Additional Emails/i)).toBeInTheDocument();

    const subject = container.querySelector(`input[name="subject"]`);
    fireEvent.change(subject, { target: { value: 'test mail' } });
    expect(screen.getByText(/Subject/i)).toBeInTheDocument();

    const description = container.querySelector(`textarea[name="description"]`);
    fireEvent.change(description, { target: { value: 'test mail testing' } });
    expect(screen.getByText(/Descritpion/i)).toBeInTheDocument();

    const product = container.querySelector(`select[name="product"]`);
    fireEvent.change(product, { target: { value: 'Campaigns' } });

    const priority = container.querySelector(`select[name="priority"]`);
    fireEvent.change(priority, { target: { value: 'Low' } });

    expect(screen.getByText(/Attachment/i)).toBeInTheDocument();
    const dropzone = container.querySelector(
      `input[name="dropzone-upload-file"]`
    );
    const file = new File(['dummy content'], 'test-document.csv', {
      type: 'text/csv',
    });
    userEvent.upload(dropzone, file);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
  });
});
