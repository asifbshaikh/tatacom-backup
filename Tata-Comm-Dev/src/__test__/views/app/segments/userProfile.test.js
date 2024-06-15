import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import UserProfile from 'views/app/segments/userProfile';

describe('user profile test cases', () => {
  it('render without crashing', () => {
    const { getByText } = render(
      <CustomWrapper>
        <UserProfile />
      </CustomWrapper>
    );

    const firstNameText = screen.getByText(/first name/i);
    expect(firstNameText).toBeInTheDocument();

    const lastNameText = screen.getByText(/last name/i);
    expect(lastNameText).toBeInTheDocument();

    const emailText = screen.getByText(/email/i);
    expect(emailText).toBeInTheDocument();

    const mobileNumberText = screen.getByText(/mobile number/i);
    expect(mobileNumberText).toBeInTheDocument();

    const digoEngageIdText = screen.getByText(/digo engage id/i);
    expect(digoEngageIdText).toBeInTheDocument();
  });
});
