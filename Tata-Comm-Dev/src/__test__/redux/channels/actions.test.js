import * as actions from 'redux/channels/actions';
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
import { describe, it, expect } from '@jest/globals';

describe('Channels Actions', () => {
  const item = {};

  it.each([
    [actions.getChannel, CHANNEL_GET],
    [actions.getChannelSuccess, CHANNEL_GET_SUCCESS],
    [actions.addChannel, CHANNEL_ADD],
    [actions.addChannelSuccess, CHANNEL_ADD_SUCCESS],
    [actions.addChannelError, CHANNEL_ADD_ERROR],
    [actions.addChannelClean, CHANNEL_ADD_CLEAN],
    [actions.updateChannel, CHANNEL_UPDATE],
    [actions.updateChannelSuccess, CHANNEL_UPDATE_SUCCESS],
    [actions.updateChannelError, CHANNEL_UPDATE_ERROR],
    [actions.updateChannelClean, CHANNEL_UPDATE_CLEAN],
    [actions.deleteChannelAvatar, CHANNEL_AVATAR_DELETE],
    [actions.deleteChannelAvatarSuccess, CHANNEL_AVATAR_DELETE_SUCCESS],
    [actions.getChannelAgents, CHANNEL_GET_AGENTS],
    [actions.getChannelAgentsSuccess, CHANNEL_GET_AGENTS_SUCCESS],
    [actions.addAgentsChannel, CHANNEL_ADD_AGENT],
    [actions.addAgentsChannelSuccess, CHANNEL_ADD_AGENT_SUCCESS],
    [actions.addAgentsChannelError, CHANNEL_ADD_AGENT_ERROR],
    [actions.addAgentsChannelClean, CHANNEL_ADD_AGENT_CLEAN],
  ])('should create %p action', (actionCreator, expectedType) => {
    expect(actionCreator(item)).toEqual({
      type: expectedType,
      payload: item,
    });
  });
});
