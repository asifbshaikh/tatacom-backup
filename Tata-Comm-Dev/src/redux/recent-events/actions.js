import { GET_RECENT_EVENTS, GET_RECENT_EVENTS_SUCCESS } from 'redux/constants';

export const getRecentEventList = (payload) => ({
  type: GET_RECENT_EVENTS,
  payload,
});

export const getRecentEventListSuccess = (items) => ({
  type: GET_RECENT_EVENTS_SUCCESS,
  payload: items,
});
