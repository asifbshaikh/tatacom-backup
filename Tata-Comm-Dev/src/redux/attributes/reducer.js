import {
  ATTRIBUTES_GET,
  ATTRIBUTES_GET_SUCCESS,
  ATTRIBUTES_DELETE,
  ATTRIBUTES_DELETE_SUCCESS,
  ATTRIBUTES_DELETE_ERROR,
  ATTRIBUTES_DELETE_CLEAN,
  ATTRIBUTES_ADD,
  ATTRIBUTES_ADD_SUCCESS,
  ATTRIBUTES_ADD_ERROR,
  ATTRIBUTES_ADD_CLEAN,
} from 'redux/constants';

const INIT_STATE = {
  loadedAttributes: false,
  attributes: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case ATTRIBUTES_GET:
      return { ...state, loadedAttributes: true };

    case ATTRIBUTES_GET_SUCCESS:
      return { ...state, attributes: action.payload };

    case ATTRIBUTES_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case ATTRIBUTES_DELETE_SUCCESS:
      return {
        ...state,
        attributes: state.attributes.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case ATTRIBUTES_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case ATTRIBUTES_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case ATTRIBUTES_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case ATTRIBUTES_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let newAttributes = state.attributes;
      if (action.payload.payload.id) {
        // update record in list
        newAttributes = newAttributes.map((item) =>
          item.id === action.payload.payload.id ? action.payload.response : item
        );
      } else {
        // add record in list
        newAttributes = [...newAttributes, action.payload.response];
      }
      return {
        ...state,
        attributes: newAttributes,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case ATTRIBUTES_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case ATTRIBUTES_ADD_CLEAN:
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
