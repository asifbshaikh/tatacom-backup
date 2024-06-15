import { describe } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import DeleteModal from 'containers/contacts/DeleteModal';
import configureMockStore from 'redux-mock-store';
import { CustomWrapper } from 'test-utils';

const initialStore = {
  contactsApp: {
    successDelete: false,
    errorDelete: false,
    loadingDelete: false,
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
describe('DeleteModal Component', () => {
  const mockStore = configureMockStore();
  test('render without crashing', () => {
    const store = mockStore(initialStore);
    const { asFragment } = render(
      <CustomWrapper>
        <DeleteModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={false}
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
        <DeleteModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
          onDeleteSuccess={deleteSuccess}
        />
      </CustomWrapper>
    );
    const cancelBtn = getByText('No, Keep');
    fireEvent.click(cancelBtn);
    expect(mockToggle).toHaveBeenCalled();
  });
  test('Delete has been called', async () => {
    const initialStoreForDelete = {
      contactsApp: {
        successDelete: true,
        errorDelete: false,
        loadingDelete: false,
      },
    };
    const store = mockStore(initialStoreForDelete);
    const mockToggle = jest.fn();
    const deleteSuccess = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <DeleteModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
          onDeleteSuccess={deleteSuccess}
          reloadList={0}
          setReloadList={jest.fn()}
        />
      </CustomWrapper>
    );
    const deleteBtn = getByText('Yes, Delete');
    await act(async () => {
      fireEvent.click(deleteBtn);
    });
    expect(deleteSuccess).toHaveBeenCalled();
  });
  test('Check error message appears', () => {
    const initialStoreForDelete = {
      contactsApp: {
        successDelete: false,
        errorDelete: { errorMsg: 'Unable to delete.' },
        loadingDelete: false,
      },
    };
    const store = mockStore(initialStoreForDelete);
    const mockToggle = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <DeleteModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
        />
      </CustomWrapper>
    );
    expect(getByText('Unable to delete.')).toBeInTheDocument();
  });
});
