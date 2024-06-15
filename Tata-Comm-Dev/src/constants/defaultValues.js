import { currentAccount } from 'helpers/Utils';

// export const UserRole = {
//   Admin: 0,
//   Editor: 1,
// };
export const UserRole = {
  Admin: 'administrator',
  Agent: 'agent',
};

/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = 'menu-default';

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = 'en';
export const localeOptions = [
  { id: 'en', name: 'English - LTR', direction: 'ltr' },
];

export const currentUser = {
  id: 1,
  title: 'Sarah Kortney',
  img: '/assets/img/profiles/l-1.jpg',
  date: 'Last seen today 15:24',
  role: UserRole.Admin,
};

export let adminRoot = '/app';
const accountId = currentAccount();
if (accountId) {
  adminRoot = `/app/accounts/${accountId}`;
}

export const loginPageURL = '/user/login';

export const redirectToUrl = (redirectTo) => {
  if (redirectTo === 'adminRoot') {
    const accountIdNew = currentAccount();
    if (accountIdNew) {
      adminRoot = `/app/accounts/${accountIdNew}`;
    }
  }
  return adminRoot;
};

export const buyUrl = 'https://1.envato.market/k4z0';
export const searchPath = `${adminRoot}/pages/miscellaneous/search`;
export const servicePath = 'https://api.coloredstrategies.com';

export const developedBY = 'TATA Communications 2023';

export const themeColorStorageKey = '__theme_selected_color';
export const isMultiColorActive = false;
export const defaultColor = 'light.digored';
export const isDarkSwitchActive = false;
export const defaultDirection = 'ltr';
export const themeRadiusStorageKey = '__theme_radius';
export const isAuthGuardActive = true;
export const colors = [
  'bluenavy',
  'blueyale',
  'blueolympic',
  'greenmoss',
  'greenlime',
  'purplemonster',
  'orangecarrot',
  'redruby',
  'yellowgranola',
  'greysteel',
];

export const globalConfig = {
  installationName: 'Engage',
};

export const termsURL = 'https://www.engage.com/terms-of-service';
export const privacyURL = 'https://www.engage.com/privacy-policy';

export const baseApiUrl = process.env.REACT_APP_API_BASE_URL;
export const appVersion = process?.env?.REACT_APP_TAG_VERSION
  ? process?.env?.REACT_APP_TAG_VERSION
  : 'NA';
export const webSocketURL = process.env.REACT_APP_WEB_SOCKET;
