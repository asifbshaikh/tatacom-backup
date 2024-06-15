import { FLOWS_NAME, ADD_FLOW_DETAILS } from 'redux/constants';

const INIT_STATE = {
  flowName: '',
  flowTag: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FLOWS_NAME:
      return {
        ...state,
        flowName: action.payload,
      };

    case ADD_FLOW_DETAILS:
      return {
        ...state,
        flowName: action.payload.flowName,
        flowTag: action.payload.flowTag,
      };

    default:
      return { ...state };
  }
};
