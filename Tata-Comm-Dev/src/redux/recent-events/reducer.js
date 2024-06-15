import { GET_RECENT_EVENTS, GET_RECENT_EVENTS_SUCCESS } from 'redux/constants';

const INIT_STATE = {
  eventList: [],
  pagination: {},
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RECENT_EVENTS:
      return {
        ...state,
      };
    case GET_RECENT_EVENTS_SUCCESS:
      return {
        ...state,
        eventList: action?.payload?.result,
        pagination: action?.payload?.pagination,
      };
    default:
      return { ...state };
  }
};
