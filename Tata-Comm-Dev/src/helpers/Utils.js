/* eslint-disable no-use-before-define */
import {
  defaultDirection,
  defaultLocale,
  defaultColor,
  localeOptions,
  themeColorStorageKey,
  themeRadiusStorageKey,
} from 'constants/defaultValues';
import fromUnixTime from 'date-fns/fromUnixTime';
import differenceInDays from 'date-fns/differenceInDays';
import moment from 'moment';
import {
  COMMA_SEPERATED_FULL_DATE_TIME_FORMAT,
  matchTextRegex,
  mentionsRegex,
} from 'constants/appConstant';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import { smsCampaignSteps } from 'constants/CampaignStepperConstants';
import { intlDirectMessage } from './IntlMessages';
import CommonEnums from 'enums/commonEnums';

const Cookies = {};

export const mapOrder = (array, order, key) => {
  // eslint-disable-next-line func-names
  array.sort(function (a, b) {
    const A = a[key];
    const B = b[key];
    if (order.indexOf(`${A}`) > order.indexOf(`${B}`)) {
      return 1;
    }
    return -1;
  });
  return array;
};

export const getDateWithFormat = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // January is 0!

  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${dd}.${mm}.${yyyy}`;
};

export const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
};

export const getDirection = () => {
  let direction = defaultDirection;

  try {
    if (localStorage.getItem('direction')) {
      const localValue = localStorage.getItem('direction');
      if (localValue === 'rtl' || localValue === 'ltr') {
        direction = localValue;
      }
    }
  } catch {
    direction = defaultDirection;
  }
  return {
    direction,
    isRtl: direction === 'rtl',
  };
};
export const setDirection = (localValue) => {
  let direction = 'ltr';
  if (localValue === 'rtl' || localValue === 'ltr') {
    direction = localValue;
  }
  try {
    localStorage.setItem('direction', direction);
  } catch (error) {
    console.warn('error', error);
  }
};

export const getCurrentColor = () => {
  let currentColor = defaultColor;
  try {
    if (localStorage.getItem(themeColorStorageKey)) {
      currentColor = localStorage.getItem(themeColorStorageKey);
    }
  } catch {
    currentColor = defaultColor;
  }
  return currentColor;
};

export const setCurrentColor = (color) => {
  try {
    localStorage.setItem(themeColorStorageKey, color);
  } catch (error) {
    console.warn('error', error);
  }
};

export const getCurrentRadius = () => {
  let currentRadius = 'rounded';
  try {
    if (localStorage.getItem(themeRadiusStorageKey)) {
      currentRadius = localStorage.getItem(themeRadiusStorageKey);
    }
  } catch {
    currentRadius = 'rounded';
  }
  return currentRadius;
};
export const setCurrentRadius = (radius) => {
  try {
    localStorage.setItem(themeRadiusStorageKey, radius);
  } catch (error) {
    console.warn('error', error);
  }
};

export const getCurrentLanguage = () => {
  let language = defaultLocale;
  try {
    language =
      localStorage.getItem('currentLanguage') &&
      localeOptions.filter(
        (x) => x.id === localStorage.getItem('currentLanguage')
      ).length > 0
        ? localStorage.getItem('currentLanguage')
        : defaultLocale;
  } catch {
    language = defaultLocale;
  }
  return language;
};
export const setCurrentLanguage = (locale) => {
  try {
    localStorage.setItem('currentLanguage', locale);
  } catch (error) {
    console.warn('error', error);
  }
};

export function getCurrentUser() {
  let user = null;
  try {
    user =
      localStorage.getItem('gogo_current_user') != null
        ? JSON.parse(localStorage.getItem('gogo_current_user'))
        : null;
  } catch {
    user = null;
  }
  return user;
}

export function currentAccount() {
  let accountid = '';
  const user = getCurrentUser();
  if (user && user.account_id_choosen) {
    accountid = user.account_id_choosen;
    // if(window.location.href) {
    // if account id is different in url, check it should exists in url
    // "accounts": [
    //   {
    //     "id": 2,
    // }
  }
  return accountid;
}

export const getCurrentUserAccount = () => {
  const { accounts = [], account_id_choosen: accountIdChoosen = null } =
    getCurrentUser() ?? {};

  const [currentAccountDetails = {}] = accounts?.filter(
    (account) => account.id === accountIdChoosen
  );
  return currentAccountDetails || {};
};

export const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem('gogo_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gogo_current_user');
    }
  } catch (error) {
    console.warn('error', error);
  }
};

export const switchAccount = (accountId) => {
  const user = getCurrentUser();
  user.account_id_choosen = accountId;
  setCurrentUser(user);

  // const userData = getCurrentUser();

  // return userData;
  return user;
};

export const arrangeDataAndSetCurrentUser = (data, headers) => {
  const userData = {
    uid: data.id,
    headers,
    ...data,
  };
  if (data.account_id_choosen) {
    if (data.accounts && data.accounts.length) {
      let isAccountIdValid = false;
      let { role } = data;
      data.accounts.map((item) => {
        if (data.account_id_choosen === item.id) {
          isAccountIdValid = true;
          role = item.role;
        }
        return false;
      });
      if (!isAccountIdValid) {
        userData.account_id_choosen = data.account_id;
      }
      userData.role = role;
    }
  } else {
    userData.account_id_choosen = data.account_id;
  }
  setCurrentUser(userData);
  return userData;
};

export const arrangeDataAndSetCurrentUserNew = (response) => {
  setAuthCredentials(response);
  return response.data.data;
};

export const flattenMessages = (nestedMessages, prefix = '') => {
  if (nestedMessages === null) {
    return {};
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    // if (typeof prefixedKey === "string" && prefixedKey.includes('REPORT.DATE_RANGE')) {
    // }

    if (typeof value === 'string' || typeof value === 'number') {
      Object.assign(messages, { [prefixedKey]: value });
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
};

export const isLoggedIn = () => {
  const hasAuthCookie = !!Cookies.getJSON('auth_data');
  const hasUserCookie = !!Cookies.getJSON('user');
  return hasAuthCookie && hasUserCookie;
};

export const getAuthData = () => {
  if (isLoggedIn()) {
    return Cookies.getJSON('auth_data');
  }
  return false;
};

// export const getPubSubToken = () => {
//   if (isLoggedIn()) {
//     const user = Cookies.getJSON('user') || {};
//     const { pubsub_token: pubsubToken } = user;
//     return pubsubToken;
//   }
//   return null;
// };

export const getCurrentUserFromCookie = () => {
  if (isLoggedIn()) {
    return Cookies.getJSON('user');
  }
  return null;
};

export const setUser = (user, expiryDate) => {
  // if (options && options.setUserInSDK) {
  //   window.bus.$emit(TRING_SET_USER, { user });
  //   window.bus.$emit(ANALYTICS_IDENTITY, { user });
  // }
  Cookies.set('user', user, {
    expires: differenceInDays(expiryDate, new Date()),
  });
};

export const getHeaderExpiry = (response) =>
  fromUnixTime(response.headers.expiry);

export const setAuthCredentials = (response) => {
  const expiryDate = getHeaderExpiry(response);
  Cookies.set('auth_data', response.headers, {
    expires: differenceInDays(expiryDate, new Date()),
  });
  setUser(response.data.data, expiryDate);
};

export const clearBrowserSessionCookies = () => {
  Cookies.remove('auth_data');
  Cookies.remove('user');
};

export const clearCookiesOnLogout = () => {
  // window.bus.$emit(TRING_RESET);
  // window.bus.$emit(ANALYTICS_RESET);
  clearBrowserSessionCookies();
  const globalConfig = window.globalConfig || {};
  const logoutRedirectLink = globalConfig.LOGOUT_REDIRECT_LINK || '/app/login';
  window.location = logoutRedirectLink;
};

export const convertCSVFileDataToArray = (str) => {
  let csvHeader = str.slice(0, str.indexOf('\n')).split(',');
  csvHeader = csvHeader.map((e) =>
    e.replace(/["]/g, '').replace(/\r/g, '').trim()
  );
  const foundIdentifier = checkForIdentifier(
    [
      'customer id',
      'customer_id',
      'email',
      'phone',
      'phone number',
      'phone_number',
      'moblie',
      'mobile_number',
      'mobile number',
    ],
    csvHeader
  );
  const csvHeaderData = foundIdentifier
    ? csvHeader
    : Array(csvHeader.length).fill('');
  const csvRows = foundIdentifier
    ? str.slice(str.indexOf('\n') + 1).split('\n')
    : str.split('\n');
  const csvdata = csvRows.map((i) => {
    const values = i?.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const objToReturn = csvHeaderData.reduce((obj, header, index) => {
      const ob = obj;
      if (header) {
        ob[header] = values[index];
      } else {
        ob[`${index}_${index}`] = values[index];
      }
      return ob;
    }, []);
    return objToReturn;
  });

  return csvdata;
};

export const currentUserID = () => {
  let currentUserId = '';
  const user = getCurrentUser();
  if (user && user.id) {
    currentUserId = user.id;
  }
  return currentUserId;
};

export const getDateTimeWithFormat = (epochTime) => {
  const date = new Date(0);
  const setUTC = date.setUTCSeconds(epochTime);
  return moment(setUTC).format(COMMA_SEPERATED_FULL_DATE_TIME_FORMAT);
};

export const getStartDateTimeWithFormat = (time) => {
  const dateObject = new Date(time);
  const options = {
    weekday: CommonEnums.SHORT,
    month: CommonEnums.SHORT,
    day: CommonEnums.NUMERIC,
    hour: CommonEnums.NUMERIC,
    minute: CommonEnums.TWO_DIGIT,
    second: CommonEnums.TWO_DIGIT,
    hour12: true,
  };
  return dateObject.toLocaleDateString(CommonEnums.EN_US, options);
};

export const checkForIdentifier = (isIdentifierList, hasIdentifierList) => {
  const isIdentifierListLowerCase = isIdentifierList.map((e) =>
    e.toLowerCase()
  );
  const hasIdentifierListLowerCase = hasIdentifierList.map((e) =>
    e.toLowerCase()
  );
  return hasIdentifierListLowerCase.some((r) =>
    isIdentifierListLowerCase.includes(r)
  );
};

export const downloadHTMLTemplate = (html) => {
  const blob = new Blob([html], { type: ContentConfigurationEnums.HTML });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ContentConfigurationEnums.DOWNLOAD_NAME;
  a.style.display = ContentConfigurationEnums.HTML_STYLE;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const networkStatus = () => {
  if (navigator.onLine) {
    return DashboardEnums.ONLINE;
  }
  return DashboardEnums.OFFLINE;
};

export const getStepIndex = (stepId) => {
  const index = smsCampaignSteps.findIndex((step) => step.route === stepId);
  return index !== -1 ? index : 0;
};

export function getPubsubToken() {
  let pubsubToken = '';
  const user = getCurrentUser();
  if (user && user.pubsub_token) {
    pubsubToken = user.pubsub_token;
  }
  return pubsubToken;
}

export function getTypingUsersText(users = []) {
  const count = users?.length;
  if (count === 1) {
    const [user] = users;
    return `${user?.name} ${intlDirectMessage({
      id: 'CONVERSATION.TYPING.LABEL_IS_TYPING',
    })}`;
  }
  const textAnd = intlDirectMessage({
    id: 'CONVERSATION.TYPING.LABEL_AND',
  });
  const textAreTyping = intlDirectMessage({
    id: 'CONVERSATION.TYPING.LABEL_ARE_TYPING',
  });
  if (count === 2) {
    const [first, second] = users;
    return `${first?.name} ${textAnd} ${second?.name} ${textAreTyping}`;
  }
  if (count > 2) {
    const textOthers = intlDirectMessage({
      id: 'CONVERSATION.TYPING.LABEL_OTHERS',
    });
    const [user] = users;
    const rest = users?.length - 1;
    return `${user?.name} ${textAnd} ${rest} ${textOthers} ${textAreTyping}`;
  }
}

export function getContent(content, HTMLReactParser) {
  let parsedString = '';
  parsedString = content;
  let matchText = parsedString?.match(mentionsRegex);
  const sanitizeAndConvertToReact = (text) => {
    const sanitizedReactElement = HTMLReactParser(text);
    return sanitizedReactElement;
  };
  if (matchText?.length > 0) {
    matchText.forEach((text) => {
      let replaceMatchText = text?.match(matchTextRegex);
      parsedString = parsedString?.replace(
        text,
        `<strong>${replaceMatchText[0]}</strong>`
      );
    });
  }
  const parsedText = parsedString
    ? sanitizeAndConvertToReact(parsedString)
    : parsedString;
  return parsedText;
}
