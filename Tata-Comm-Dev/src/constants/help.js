import { adminRoot, UserRole } from './defaultValues';

const helpData = [
  {
    id: 'Contact',
    icon: '',
    label: 'SIDEBAR_ITEMS.CONTACT_SUPPORT',
    to: `${adminRoot}/helpCenter`,
    subs: [
      {
        label: 'SMS_TEMPLATE_FORM.FORM.SUBMIT',
        to: `${adminRoot}/helpCenter`,
      },
    ],
  },
];
export default helpData;
