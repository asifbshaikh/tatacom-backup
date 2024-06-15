import {
  INTEGRATIONS_GET,
  INTEGRATIONS_GET_SUCCESS,
  INTEGRATIONS_DELETE,
  INTEGRATIONS_DELETE_SUCCESS,
  INTEGRATIONS_DELETE_ERROR,
  INTEGRATIONS_DELETE_CLEAN,
  INTEGRATIONS_ADD,
  INTEGRATIONS_ADD_SUCCESS,
  INTEGRATIONS_ADD_ERROR,
  INTEGRATIONS_ADD_CLEAN,
} from 'redux/constants';

const INIT_STATE = {
  loadedIntegrations: false,
  integrations: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case INTEGRATIONS_GET:
      return { ...state, loadedIntegrations: true };

    case INTEGRATIONS_GET_SUCCESS:
      return { ...state, integrations: action.payload.payload.webhooks };

    case INTEGRATIONS_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case INTEGRATIONS_DELETE_SUCCESS:
      return {
        ...state,
        integrations: state.integrations.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case INTEGRATIONS_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case INTEGRATIONS_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case INTEGRATIONS_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case INTEGRATIONS_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let newIntegrations = state.integrations;
      if (action.payload.payload.id) {
        // update record in list
        newIntegrations = newIntegrations.map((item) =>
          item.id === action.payload.payload.id
            ? action.payload.response.payload.webhook
            : item
        );
      } else {
        // add record in list
        newIntegrations = [
          ...newIntegrations,
          action.payload.response.payload.webhook,
        ];
      }
      return {
        ...state,
        integrations: newIntegrations,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case INTEGRATIONS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case INTEGRATIONS_ADD_CLEAN:
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
