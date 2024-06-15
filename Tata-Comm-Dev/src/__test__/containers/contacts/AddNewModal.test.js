import { describe, test } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import AddNewModal from 'containers/contacts/AddNewModal';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';
import { addContactItem } from 'redux/actions';
import moment from 'moment';

const countries = [
  {
    name: 'Israel',
    phone_code: '972',
    country_code: 'IL',
  },
  {
    name: 'Isle of Man',
    phone_code: '44',
    country_code: 'IM',
  },
  {
    name: 'India',
    phone_code: '91',
    country_code: 'IN',
  },
];
const initialFormValues = {
  name: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  gender: '',
  city: '',
  address: '',
  country: '',
  birth_date: '',
  additional_attributes: {
    company_name: '',
    description: '',
    social_profiles: {
      github: '',
      twitter: '',
      facebook: '',
      linkedin: '',
    },
  },
};
const initialFormWithValues = {
  id: 123,
  name: 'Test User',
  first_name: '',
  middle_name: '',
  last_name: '',
  email: 'test@testmail.com',
  phone_number: '+911111111111',
  gender: 'male',
  city: 'Hyderabad',
  address: 'Ameenpur',
  country: 'IN',
  birth_date: '',
  additional_attributes: {
    company_name: 'PSL',
    description: 'Test',
    social_profiles: {
      github: 'github',
      twitter: 'twitter',
      facebook: 'facebook',
      linkedin: 'linkedin',
    },
  },
};
const initialStore = {
  settingsChannels: {
    countryList: countries,
  },
  contactsApp: {
    successAdd: false,
    errorAdd: {},
    loadingAdd: false,
  },
};
jest.mock('redux/actions', () => {
  return {
    ...jest.requireActual('redux/actions'),
    addContactItem: jest.fn(),
  };
});
describe('AddNewModal Component', () => {
  const mockStore = configureMockStore();
  test('render without crashing', () => {
    const store = mockStore(initialStore);
    const { asFragment } = render(
      <CustomWrapper>
        <AddNewModal
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
    const { getByText } = render(
      <CustomWrapper>
        <AddNewModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
        />
      </CustomWrapper>
    );
    const cancelBtn = getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(mockToggle).toHaveBeenCalled();
  });
  test('Check error message appears', () => {
    const initialStoreForEdit = {
      settingsChannels: {
        countryList: countries,
      },
      contactsApp: {
        successAdd: false,
        errorAdd: { errorMsg: 'Unable to update.' },
        loadingAdd: false,
      },
    };
    const store = mockStore(initialStoreForEdit);
    const mockToggle = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <AddNewModal
          editFormData={initialFormValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
        />
      </CustomWrapper>
    );
    expect(getByText('Unable to update.')).toBeInTheDocument();
  });
  test('Add new contact', () => {
    const initialStoreForEdit = {
      settingsChannels: {
        countryList: countries,
      },
      contactsApp: {
        successAdd: false,
        errorAdd: { errorMsg: 'Unable to update.' },
        loadingAdd: false,
      },
    };
    const store = mockStore(initialStoreForEdit);
    const mockToggle = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <AddNewModal
          editFormData={{}}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
        />
      </CustomWrapper>
    );
    expect(getByText('Unable to update.')).toBeInTheDocument();
  });
  test('Submit click action called', async () => {
    const store = mockStore(initialStore);
    const mockToggle = jest.fn();
    const { getByText } = render(
      <CustomWrapper>
        <AddNewModal
          editFormData={initialFormWithValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
        />
      </CustomWrapper>
    );
    const submitBtn = getByText('Submit');
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(addContactItem).toHaveBeenCalled();
    });
  });
  test('OnSave callback called', async () => {
    const initialUpdatedStore = {
      settingsChannels: {
        countryList: countries,
      },
      contactsApp: {
        successAdd: true,
        errorAdd: {},
        loadingAdd: false,
      },
    };
    const store = mockStore(initialUpdatedStore);
    const mockToggle = jest.fn();
    const onSave = jest.fn();
    const reloadList = jest.fn();
    render(
      <CustomWrapper>
        <AddNewModal
          editFormData={initialFormWithValues}
          store={store}
          modalOpen={true}
          toggleModal={mockToggle}
          onSaveSuccess={onSave}
          setReloadList={reloadList}
        />
      </CustomWrapper>
    );
    expect(onSave).toHaveBeenCalled();
    expect(reloadList).toHaveBeenCalled();
  });
});
