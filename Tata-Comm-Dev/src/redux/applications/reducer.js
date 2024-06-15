import {
  APPLICATIONS_GET,
  APPLICATIONS_GET_SUCCESS,
  APPLICATIONS_DELETE,
  APPLICATIONS_DELETE_SUCCESS,
  APPLICATIONS_DELETE_ERROR,
  APPLICATIONS_DELETE_CLEAN,
  APPLICATIONS_ADD,
  APPLICATIONS_ADD_SUCCESS,
  APPLICATIONS_ADD_ERROR,
  APPLICATIONS_ADD_CLEAN,
  APPLICATIONS_GET_INTEGRATIONS,
  APPLICATIONS_GET_INTEGRATION,
} from 'redux/constants';

const INIT_STATE = {
  loadedApplications: false,
  applications: [],
  appIntegrations: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case APPLICATIONS_GET:
      return { ...state, loadedApplications: true };

    case APPLICATIONS_GET_SUCCESS:
      return { ...state, applications: action.payload.payload };

    case APPLICATIONS_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case APPLICATIONS_DELETE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const deletedApplications = state.applications.map((application) => {
        if (application.id === action.payload.payload.app_id) {
          return {
            ...application,
            hooks: application.hooks.filter(
              (item) => item.id !== action.payload.payload.id
            ),
          };
        }
        return application;
      });
      return {
        ...state,
        applications: deletedApplications,
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case APPLICATIONS_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case APPLICATIONS_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case APPLICATIONS_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case APPLICATIONS_ADD_SUCCESS:
      // // eslint-disable-next-line no-case-declarations
      // let newHooks = state.applications.hooks;
      // // add record in list
      // newHooks = [...newHooks, action.payload.response];

      // eslint-disable-next-line no-case-declarations
      const updatedApplications = state.applications.map((application) => {
        if (application.id === action.payload.response.app_id) {
          return {
            ...application,
            hooks: [...application.hooks, action.payload.response],
          };
        }
        return application;
      });
      return {
        ...state,
        applications: updatedApplications,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case APPLICATIONS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case APPLICATIONS_ADD_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    case APPLICATIONS_GET_INTEGRATIONS:
      return {
        ...state,
        appIntegrations: state.applications.filter(
          (item) => item.id === 'dialogflow'
        ),
      };

    case APPLICATIONS_GET_INTEGRATION:
      // eslint-disable-next-line no-case-declarations
      const [integration] = state.applications.filter(
        (item) => item.id === action.payload
      );
      return {
        ...state,
        integration: integration || {},
      };

    default:
      return { ...state };
  }
};
