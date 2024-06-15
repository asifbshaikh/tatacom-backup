import {
  ACCOUNT_GET,
  ACCOUNT_GET_SUCCESS,
  ACCOUNTS_GET,
  ACCOUNTS_GET_SUCCESS,
  ACCOUNTS_DELETE,
  ACCOUNTS_DELETE_SUCCESS,
  ACCOUNTS_DELETE_ERROR,
  ACCOUNTS_DELETE_CLEAN,
  ACCOUNTS_ADD,
  ACCOUNTS_ADD_SUCCESS,
  ACCOUNTS_ADD_ERROR,
  ACCOUNTS_ADD_CLEAN,
} from 'redux/constants';

export const getAccount = (userId) => ({
  type: ACCOUNT_GET,
  payload: userId,
});
export const getAccountSuccess = (items) => ({
  type: ACCOUNT_GET_SUCCESS,
  payload: items,
});

export const getAccounts = (userId) => ({
  type: ACCOUNTS_GET,
  payload: userId,
});
export const getAccountsSuccess = (items) => ({
  type: ACCOUNTS_GET_SUCCESS,
  payload: items,
});

export const deleteAccount = (item) => ({
  type: ACCOUNTS_DELETE,
  payload: item,
});

export const deleteAccountSuccess = (items) => ({
  type: ACCOUNTS_DELETE_SUCCESS,
  payload: items,
});

export const deleteAccountError = (error) => ({
  type: ACCOUNTS_DELETE_ERROR,
  payload: error,
});

export const deleteAccountClean = (item) => ({
  type: ACCOUNTS_DELETE_CLEAN,
  payload: item,
});

export const addAccount = (item) => ({
  type: ACCOUNTS_ADD,
  payload: item,
});

export const addAccountSuccess = (items) => ({
  type: ACCOUNTS_ADD_SUCCESS,
  payload: items,
});

export const addAccountError = (error) => ({
  type: ACCOUNTS_ADD_ERROR,
  payload: error,
});

export const addAccountClean = (item) => ({
  type: ACCOUNTS_ADD_CLEAN,
  payload: item,
});
