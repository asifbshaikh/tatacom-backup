import {
  LABELS_GET,
  LABELS_GET_SUCCESS,
  LABELS_DELETE,
  LABELS_DELETE_SUCCESS,
  LABELS_DELETE_ERROR,
  LABELS_DELETE_CLEAN,
  LABELS_ADD,
  LABELS_ADD_SUCCESS,
  LABELS_ADD_ERROR,
  LABELS_ADD_CLEAN,
} from 'redux/constants';

const INIT_STATE = {
  loadedLabels: false,
  labels: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LABELS_GET:
      return { ...state, loadedLabels: true };

    case LABELS_GET_SUCCESS:
      return { ...state, labels: action.payload.payload };

    case LABELS_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case LABELS_DELETE_SUCCESS:
      return {
        ...state,
        labels: state.labels.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case LABELS_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case LABELS_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case LABELS_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case LABELS_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let newLabels = state.labels;
      if (action.payload.payload.id) {
        // update record in list
        newLabels = newLabels.map((item) =>
          item.id === action.payload.payload.id ? action.payload.response : item
        );
      } else {
        // add record in list
        newLabels = [...newLabels, action.payload.response];
      }
      return {
        ...state,
        labels: newLabels,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case LABELS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case LABELS_ADD_CLEAN:
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
