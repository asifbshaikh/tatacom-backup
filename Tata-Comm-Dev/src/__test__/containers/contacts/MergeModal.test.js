import { describe } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import MergeModal from 'containers/contacts/MergeModal';
import configureMockStore from 'redux-mock-store';
import { CustomWrapper } from 'test-utils';

const initialStore = {
  contactsApp: {
    successMerge: false,
    errorMerge: false,
    loadingMerge: false,
  },
};
const initialFormValues = {
  id: 123,
  name: 'Test User',
  first_name: '',
  middle_name: '',
  last_name: '',
  email: 'test@testmail.com',
  phone_number: '+911234567890',
  gender: 'male',
  city: '',
  address: '',
  country: '',
  birth_date: '',
  additional_attributes: {
    company_name: 'Persistent',
    description: 'Test',
    social_profiles: {
      github: 'github',
      twitter: 'twitter',
      facebook: 'facebook',
      linkedin: 'linkedin',
    },
  },
};
describe('MergeModal Component', () => {
  const mockStore = configureMockStore();
  test('render without crashing', () => {
    const store = mockStore(initialStore);
    const { asFragment } = render(
      <CustomWrapper>
        <MergeModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  test('close modal on cancel', () => {
    const store = mockStore(initialStore);
    const mockToggle = jest.fn();
    const deleteSuccess = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <MergeModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
          onDeleteSuccess={deleteSuccess}
          setSelectedSuggestion={jest.fn()}
        />
      </CustomWrapper>
    );
    const cancelBtn = getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(mockToggle).toHaveBeenCalled();
  });
  test('Check error message appears', () => {
    const initialStoreForDelete = {
      contactsApp: {
        successMerge: false,
        errorMerge: { errorMsg: 'Unable to merge.' },
        loadingMerge: false,
      },
    };
    const store = mockStore(initialStoreForDelete);
    const mockToggle = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <MergeModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
        />
      </CustomWrapper>
    );
    expect(getByText('Unable to merge.')).toBeInTheDocument();
  });
  test('Submit merge modal', async () => {
    const initialSubmitStore = {
      contactsApp: {
        successMerge: true,
        errorMerge: false,
        loadingMerge: false,
      },
    };
    const store = mockStore(initialSubmitStore);
    const mockToggle = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <MergeModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
          setSelectedSuggestion={jest.fn()}
          selectedSuggestion={{ id: '2' }}
        />
      </CustomWrapper>
    );
    const submitBtn = getByText('Submit');
    await waitFor(() => {
      fireEvent.click(submitBtn);
    });
  });
});
