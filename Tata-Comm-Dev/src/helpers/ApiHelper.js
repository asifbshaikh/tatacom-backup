import { baseApiUrl } from 'constants/defaultValues';
import { getCurrentUser, currentAccount } from './Utils';

export const apiUrlBase = () => baseApiUrl;
export const apiUrlNew = () =>
  `${baseApiUrl}api/v1/accounts/${currentAccount()}/`;
export const apiUrlNewV2 = () =>
  `${baseApiUrl}api/v2/accounts/${currentAccount()}/`;
export const apiUrlNewV3 = () =>
  `${baseApiUrl}api/v3/accounts/${currentAccount()}/`;
export const apiUrlNewSurvey = () => `${baseApiUrl}public/api/v1/`;
export const apiUrlByType = (type) => {
  switch (type) {
    case 'profile':
      return `${apiUrlBase()}api/v1/profile`;
    case 'profile/avatar':
      return `${apiUrlBase()}api/v1/profile/avatar`;
    case 'profile/notificationSettings':
      return `${apiUrlNew()}notification_settings`;
    case 'profile/availability':
      return `${apiUrlBase()}api/v1/profile/availability`;
    case 'register':
      return `${apiUrlBase()}api/v1/accounts.json`;
    default:
      return `${apiUrlBase()}`;
  }
};

export const getHeadersBase = () => {
  return {
    // 'access-token': 'y5sO7QqcS_DuvyZcHYkx6Q',
    // 'uid': 'ankur.jain@tatacommunications.com',
    // 'Referer': 'https://engage.digo.link/app/accounts/3/contacts?page=1',
    // 'token-type': 'Bearer',
    // 'client': 'ChNHIf29h3IG8Krn3bYKJA', // 'unA7nxWGaPFEK9-n8UUZAg',
    // 'expiry': '1672805342',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'Host': 'engage.digo.link',
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Origin' : '*',
    // "Access-Control-Max-Age": "1800",
    // 'Access-Control-Allow-Credentials' : 'true',
    // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    // 'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept, Authorization, expiry',
    // 'Access-Control-Allow-Credentials': true,
  };
};

export const getHeaders = () => {
  // let accessToken = 'y5sO7QqcS_DuvyZcHYkx6Q';
  // let uid = 'ankur.jain@tatacommunications.com';
  // let expiry = '1672805342';
  // let client = 'ChNHIf29h3IG8Krn3bYKJA';

  let accessToken = '';
  let uid = '';
  let expiry = '';
  let client = '';
  const user = getCurrentUser();
  // if(user && user.access_token) {
  //     accessToken = user.access_token;
  // }
  if (user && user.headers) {
    accessToken = user.headers['access-token'];
    uid = user.headers.uid;
    expiry = user.headers.expiry;
    client = user.headers.client;
  }
  return {
    'access-token': accessToken,
    uid: uid,
    // 'Referer': 'https://engage.digo.link/app/accounts/3/contacts?page=1',
    'token-type': 'Bearer',
    client: client, // 'unA7nxWGaPFEK9-n8UUZAg',
    expiry: expiry,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'Host': 'engage.digo.link.',
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Origin' : '*',
    // "Access-Control-Max-Age": "1800",
    // 'Access-Control-Allow-Credentials' : 'true',
    // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    // 'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    // 'Access-Control-Allow-Credentials': true,
  };
};

export const commonRequestException = (error) => {
  const errorMsg = { errorMsg: 'Unhandled Error from API' };
  if (error.response) {
    // Request made and server responded
    if (error.response.data.message) {
      errorMsg.errorMsg = error.response.data.message;
    } else if (error.response.data.error) {
      errorMsg.errorMsg = error.response.data.error;
    } else if (
      error.response.data.errors &&
      typeof error.response.data.errors == 'string'
    ) {
      errorMsg.errorMsg = error.response.data.errors;
    } else if (
      error.response.data.errors &&
      Array.isArray(error.response.data.errors) &&
      error.response.data.errors?.length > 0
    ) {
      errorMsg.errorMsg = error.response.data.errors[0];
    }
  } else if (error.request) {
    // The request was made but no response was received
  } else {
    // Something happened in setting up the request that triggered an Error
  }
  return errorMsg;
};
