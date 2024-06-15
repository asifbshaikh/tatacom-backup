import { describe, test } from '@jest/globals';
import { render } from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import ContactsDetail from 'views/app/contacts/details';
import configureMockStore from 'redux-mock-store';

const initialStore = {
  contactsApp: {
    item: {
      additional_attributes: {
        description: 'Contact Bio',
        company_name: 'PSL',
        social_profiles: {
          github: '',
          twitter: 'twitter',
          facebook: 'facebook',
          linkedin: 'linkedin',
        },
      },
      gender: 'male',
      city: 'Hyderabad',
      address: 'Ameenpur',
      country: 'IN',
      birth_date: '2000-02-30',
      availability_status: 'offline',
      email: 'test@gmail.com',
      id: 61598,
      name: 'PSL Test User',
      first_name: '',
      middle_name: '',
      last_name: '',
      phone_number: '+911234567890',
      identifier: null,
      thumbnail:
        'https://www.gravatar.com/avatar/03ca2952d111fd97953b82be0b97864a?d=404',
      custom_attributes: {
        user_location: 'Hyderabad',
      },
      last_activity_at: 0,
      contact_inboxes: [],
    },
    successDetails: true,
    loadingDetails: false,
    errorDetails: {},
    errorLabel: undefined,
    labelSelected: [{ label: 'test1', value: 'test1' }],
    labelSelectedLoaded: true,
    successLabel: true,
  },
  labelsApp: {
    labels: [{ title: 'test1' }, { title: 'test2' }],
    loadedLabels: true,
  },
};

jest.mock('react-select', () => {
  return function cb({ options, value, onChange, dataTestID }) {
    function handleChange(event) {
      const option = options.find(
        (option) => option.value === event.target.value
      );
      onChange([option]);
    }

    return (
      <select
        data-testid={dataTestID}
        value={value || []}
        onChange={handleChange}
        multiple
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  };
});

describe('Contact details component', () => {
  const mockStore = configureMockStore();

  const match = {
    path: '/app/accounts/95/contacts/details/:surveyid',
    url: '/app/accounts/95/contacts/details/61599',
    isExact: true,
    params: {
      surveyid: '61599',
    },
  };

  test('render without crashing', () => {
    const store = mockStore(initialStore);

    const { asFragment } = render(
      <CustomWrapper>
        <ContactsDetail match={match} store={store} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  test('check if the buttons appears in the document', async () => {
    const store = mockStore(initialStore);
    const { findByTestId } = render(
      <CustomWrapper>
        <ContactsDetail match={match} store={store} />
      </CustomWrapper>
    );
    const editBtn = await findByTestId('editContact');
    expect(editBtn).toBeInTheDocument();
    const mergeBtn = await findByTestId('mergeContact');
    expect(mergeBtn).toBeInTheDocument();
    const deleteBtn = await findByTestId('deleteContact');
    expect(deleteBtn).toBeInTheDocument();
  });
});
