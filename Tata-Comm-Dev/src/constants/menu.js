import { getCurrentUserAccount } from 'helpers/Utils';
import { adminRoot, UserRole } from './defaultValues';
import CommonEnums from 'enums/commonEnums';
const currentAccountDetails = getCurrentUserAccount();

let data = [
  {
    id: 'contacts',
    icon: 'iconsminds-address-book-2',
    label: 'menu.contacts',
    to: `${adminRoot}/contacts`,
  },
  {
    id: 'reports',
    icon: 'simple-icon-chart',
    label: 'menu.reports',
    to: `${adminRoot}/reports`,
    roles: [UserRole.Admin],
    subs: [
      {
        label: 'menu.overview',
        to: `${adminRoot}/reports/overview`,
      },
      {
        label: 'menu.csat',
        to: `${adminRoot}/reports/csat`,
      },
      {
        label: 'menu.agent',
        to: `${adminRoot}/reports/agent`,
      },
      {
        label: 'menu.label',
        to: `${adminRoot}/reports/label`,
      },
      {
        label: 'menu.inbox_report',
        to: `${adminRoot}/reports/inbox`,
      },
      {
        label: 'menu.team',
        to: `${adminRoot}/reports/team`,
      },
      {
        label: 'menu.users',
        to: `${adminRoot}/reports/users`,
      },
    ],
  },
  {
    id: 'inbox',
    icon: 'simple-icon-bubbles',
    label: 'menu.inbox',
    to: `${adminRoot}/inbox`,
  },
  {
    id: 'campaigns',
    icon: 'iconsminds-megaphone',
    label: 'menu.campaigns',
    to: `${adminRoot}/campaigns`,
    roles: [UserRole.Admin],
    subs: [
      {
        label: 'menu.create-campaign',
        to: `${adminRoot}/campaigns/create-campaign`,
      },
      {
        label: 'menu.sms-template',
        to: `${adminRoot}/campaigns/sms-template`,
      },
      {
        label: 'menu.flows',
        to: `${adminRoot}/campaigns/flows`,
      },
    ],
  },
  {
    id: 'settings',
    icon: 'simple-icon-settings',
    label: 'menu.settings',
    to: `${adminRoot}/settings`,
    roles: [UserRole.Admin, UserRole.Agent],
    subs: [
      {
        label: 'menu.settings_agents_list',
        to: `${adminRoot}/settings/agents`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_teams_list',
        to: `${adminRoot}/settings/teams`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_inboxes_list',
        to: `${adminRoot}/settings/inboxes`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_labels_list',
        to: `${adminRoot}/settings/labels`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_attributes_list',
        to: `${adminRoot}/settings/attributes`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_canneds_list',
        to: `${adminRoot}/settings/canneds`,
        roles: [UserRole.Admin, UserRole.Agent],
      },
      {
        label: 'menu.settings_integrations_list',
        to: `${adminRoot}/settings/integrations`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_applications_list',
        to: `${adminRoot}/settings/applications`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_accounts_list',
        to: `${adminRoot}/settings/accounts`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_channels_list',
        to: `${adminRoot}/settings/channels`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.db-connection-setup',
        to: `${adminRoot}/settings/db-connection-setup`,
        roles: [UserRole.Admin],
      },
      {
        label: 'menu.settings_sdk_configuration',
        to: `${adminRoot}/settings/sdk-configuration`,
        roles: [UserRole.Admin],
      },
    ],
  },
];

if (currentAccountDetails.role !== CommonEnums.AGENT) {
  data.unshift({
    id: 'dashboards',
    icon: 'iconsminds-shop-4',
    label: 'menu.dashboards',
    to: `${adminRoot}/dashboards`,
    subs: [
      {
        label: 'menu.dashboard_campaigns',
        to: `${adminRoot}/dashboards/all-campaigns`,
      },
      {
        label: 'menu.ab-comparison',
        to: `${adminRoot}/dashboards/ab-comparison`,
      },
    ],
  });
  data.splice(data.length - 2, 0, {
    id: 'segments',
    icon: 'simple-icon-pie-chart',
    label: 'menu.segments',
    to: `${adminRoot}/segments`,
    subs: [
      {
        label: 'segment.allsegment',
        to: `${adminRoot}/segments/all-segments`,
      },
      {
        label: 'segment.createsegment',
        to: `${adminRoot}/segments/create-segment`,
      },
      {
        label: 'segment.importusers',
        to: `${adminRoot}/segments/import-users`,
      },
      {
        label: 'segment.s3imports',
        to: `${adminRoot}/segments/db-imports`,
      },
      {
        label: 'segment.recentEvents',
        to: `${adminRoot}/segments/recent-events`,
      },
    ],
  });
}

export default data;
