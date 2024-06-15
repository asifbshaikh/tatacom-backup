import reducer from 'redux/channels/reducer';
import {
  CHANNEL_GET,
  CHANNEL_GET_SUCCESS,
  CHANNEL_ADD,
  CHANNEL_ADD_SUCCESS,
  CHANNEL_ADD_ERROR,
  CHANNEL_ADD_CLEAN,
  CHANNEL_UPDATE,
  CHANNEL_UPDATE_SUCCESS,
  CHANNEL_UPDATE_ERROR,
  CHANNEL_UPDATE_CLEAN,
  CHANNEL_AVATAR_DELETE,
  CHANNEL_AVATAR_DELETE_SUCCESS,
  CHANNEL_GET_AGENTS,
  CHANNEL_GET_AGENTS_SUCCESS,
  CHANNEL_ADD_AGENT,
  CHANNEL_ADD_AGENT_SUCCESS,
  CHANNEL_ADD_AGENT_ERROR,
  CHANNEL_ADD_AGENT_CLEAN,
} from 'redux/constants';
import { describe, expect, it } from '@jest/globals';

describe('DB Import Reducer', () => {
  const INIT_STATE = {
    successAdd: false,
    errorAdd: {},
    loadingAdd: false,
    successAddAgents: false,
    errorAddAgents: {},
    loadingAddAgents: false,
    loadedChannel: false,
    editFormData: {},
    channelAgents: [],
    loadedChannelAgents: false,
  };

  const createAction = (type, payload) => ({ type, payload });

  it.each([
    [CHANNEL_GET, { loadedChannel: true, loadedChannelAgents: false }],
    [CHANNEL_GET_SUCCESS, {}],
    [CHANNEL_ADD, { errorAdd: {}, successAdd: false, loadingAdd: true }],
    [
      CHANNEL_ADD_SUCCESS,
      { errorAdd: {}, successAdd: true, loadingAdd: false, addData: {} },
    ],
    [CHANNEL_ADD_ERROR, { successAdd: false, loadingAdd: false }],
    [CHANNEL_ADD_CLEAN, { errorAdd: {}, successAdd: false, loadingAdd: false }],
    [
      CHANNEL_UPDATE,
      { errorUpdate: {}, successUpdate: false, loadingUpdate: true },
    ],
    [
      CHANNEL_UPDATE_SUCCESS,
      { errorUpdate: {}, successUpdate: true, loadingUpdate: false },
    ],
    [
      CHANNEL_UPDATE_ERROR,
      {
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: false,
      },
    ],
    [CHANNEL_AVATAR_DELETE, {}],
    [
      CHANNEL_AVATAR_DELETE_SUCCESS,
      { errorUpdate: {}, successUpdate: true, loadingUpdate: false },
    ],
    [
      CHANNEL_UPDATE_CLEAN,
      { errorUpdate: {}, successUpdate: false, loadingUpdate: false },
    ],
    [CHANNEL_GET_AGENTS, { loadedChannelAgents: true }],
    [
      CHANNEL_ADD_AGENT,
      { errorAddAgents: {}, successAddAgents: false, loadingAddAgents: true },
    ],
    [
      CHANNEL_ADD_AGENT_SUCCESS,
      { errorAddAgents: {}, successAddAgents: true, loadingAddAgents: false },
    ],
    [
      CHANNEL_ADD_AGENT_ERROR,
      { successAddAgents: false, loadingAddAgents: false },
    ],
    [
      CHANNEL_ADD_AGENT_CLEAN,
      { errorAddAgents: {}, successAddAgents: false, loadingAddAgents: false },
    ],
  ])('should handle %p', (actionType, expectedState) => {
    const action = createAction(actionType, {});
    expect(reducer(INIT_STATE, action)).toEqual({
      ...INIT_STATE,
      ...expectedState,
    });
  });
});
