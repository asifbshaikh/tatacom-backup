import { fireEvent, render } from '@testing-library/react';
import { describe, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import SmsTemplateHeading from 'containers/campaigns/sms-campaign/smsTemplate/SmsTemplateHeading';

describe('SMSTemplateHeading component', () => {
  const match = {
    url: 'app/accounts/20/campaigns/sms-template',
    path: 'app/accounts/20/campaigns/sms-template',
  };
  const mockProps = {
    heading: 'SMS_TEMPLATE.HEADING',
    toggleModal: jest.fn(),
    changePageSize: jest.fn(),
    selectedPageSize: 10,
    totalItemCount: 50,
    startIndex: 0,
    endIndex: 10,
    pageSizes: [10, 20, 30],
    onSearchKey: jest.fn(),
    searchValue: '',
    setSearchValue: jest.fn(),
  };
  it('render SMSTemplateHeading without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <SmsTemplateHeading match={match} {...mockProps} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('calls the toggleModal function when the primary button is clicked', () => {
    const { getByText } = render(
      <CustomWrapper>
        <SmsTemplateHeading match={match} {...mockProps} />
      </CustomWrapper>
    );
    fireEvent.click(getByText('Create Template'));
    expect(mockProps.toggleModal).toHaveBeenCalled();
  });
  it('calls the onSearchKey function with the input value when the search input is changed', () => {
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <SmsTemplateHeading match={match} {...mockProps} />
      </CustomWrapper>
    );
    const searchInput = getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(mockProps.setSearchValue).toHaveBeenCalledWith('test');
    expect(mockProps.onSearchKey).toHaveBeenCalledWith('test');
  });
  it('clears the search input and calls onSearchKey with an empty string when the search input is clicked', () => {
    const { getByPlaceholderText } = render(
      <CustomWrapper>
        <SmsTemplateHeading match={match} {...mockProps} />
      </CustomWrapper>
    );
    const searchInput = getByPlaceholderText('Search');
    fireEvent.click(searchInput);
    expect(mockProps.setSearchValue).toHaveBeenCalledWith('');
    expect(mockProps.onSearchKey).toHaveBeenCalledWith('');
  });
});
