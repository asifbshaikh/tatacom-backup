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

const INIT_STATE = {
  loadedAccounts: false,
  accounts: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_GET:
      return { ...state };

    case ACCOUNT_GET_SUCCESS:
      return { ...state, account: action.payload };

    case ACCOUNTS_GET:
      return { ...state, loadedAccounts: true };

    case ACCOUNTS_GET_SUCCESS:
      return { ...state, accounts: action.payload };

    case ACCOUNTS_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case ACCOUNTS_DELETE_SUCCESS:
      return {
        ...state,
        accounts: state.accounts.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case ACCOUNTS_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case ACCOUNTS_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case ACCOUNTS_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case ACCOUNTS_ADD_SUCCESS:
      return {
        ...state,
        account: action.payload.response,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case ACCOUNTS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case ACCOUNTS_ADD_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    default:
      return { ...state };
  }
};
