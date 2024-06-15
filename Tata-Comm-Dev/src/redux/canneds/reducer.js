import {
  CANNEDS_GET,
  CANNEDS_GET_SUCCESS,
  CANNEDS_DELETE,
  CANNEDS_DELETE_SUCCESS,
  CANNEDS_DELETE_ERROR,
  CANNEDS_DELETE_CLEAN,
  CANNEDS_ADD,
  CANNEDS_ADD_SUCCESS,
  CANNEDS_ADD_ERROR,
  CANNEDS_ADD_CLEAN,
} from 'redux/constants';

const INIT_STATE = {
  loadedCanneds: false,
  canneds: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CANNEDS_GET:
      return { ...state, loadedCanneds: true };

    case CANNEDS_GET_SUCCESS:
      return { ...state, canneds: action.payload };

    case CANNEDS_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case CANNEDS_DELETE_SUCCESS:
      return {
        ...state,
        canneds: state.canneds.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case CANNEDS_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case CANNEDS_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case CANNEDS_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case CANNEDS_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let newCanneds = state.canneds;
      if (action.payload.payload.id) {
        // update record in list
        newCanneds = newCanneds.map((item) =>
          item.id === action.payload.payload.id ? action.payload.response : item
        );
      } else {
        // add record in list
        newCanneds = [...newCanneds, action.payload.response];
      }
      return {
        ...state,
        canneds: newCanneds,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case CANNEDS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case CANNEDS_ADD_CLEAN:
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
