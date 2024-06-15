import { FLOWS_NAME } from 'redux/constants';
import { ADD_FLOW_DETAILS } from 'redux/constants';

export const setFlowName = (item) => ({
  type: FLOWS_NAME,
  payload: item,
});

export const setFlowDetails = (item) => ({
  type: ADD_FLOW_DETAILS,
  payload: item,
});
