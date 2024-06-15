import { adminRoot } from './defaultValues';

const data = [
  {
    id: 'dashboards',
    icon: 'iconsminds-shop-4',
    label: 'menu.dashboards',
    to: `${adminRoot}/dashboards`,
    // roles: [UserRole.Admin, UserRole.Editor],
    subs: [
      {
        label: 'menu.dashboard_campaigns',
        to: `${adminRoot}/dashboards/campaigns`,
        // roles: [UserRole.Admin],
      },
      // {
      //   icon: 'simple-icon-pie-chart',
      //   label: 'menu.analytics',
      //   to: `${adminRoot}/dashboards/analytics`,
      //   // roles: [UserRole.Admin],
      // },
      // {
      //   icon: 'simple-icon-basket-loaded',
      //   label: 'menu.ecommerce',
      //   to: `${adminRoot}/dashboards/ecommerce`,
      //   // roles: [UserRole.Editor],
      // },
      // {
      //   icon: 'simple-icon-doc',
      //   label: 'menu.content',
      //   to: `${adminRoot}/dashboards/content`,
      //   // roles: [UserRole.Editor],
      // },
    ],
  },
  {
    id: 'pages-contacts',
    icon: 'iconsminds-address-book-2',
    label: 'menu.contacts',
    to: `${adminRoot}/pages/contacts/list`,
  },
];
export default data;
