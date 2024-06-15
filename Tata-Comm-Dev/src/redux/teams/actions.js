import {
  TEAMS_GET,
  TEAMS_GET_SUCCESS,
  TEAM_GET,
  TEAM_GET_SUCCESS,
  TEAM_GET_CLEAN,
  TEAM_ADD,
  TEAM_ADD_SUCCESS,
  TEAM_ADD_ERROR,
  TEAM_ADD_CLEAN,
  TEAM_UPDATE,
  TEAM_UPDATE_SUCCESS,
  TEAM_UPDATE_ERROR,
  TEAM_UPDATE_CLEAN,
  TEAM_DELETE,
  TEAM_DELETE_SUCCESS,
  TEAM_DELETE_ERROR,
  TEAM_DELETE_CLEAN,
  TEAM_GET_AGENTS,
  TEAM_GET_AGENTS_SUCCESS,
  TEAM_ADD_AGENT,
  TEAM_ADD_AGENT_SUCCESS,
  TEAM_ADD_AGENT_ERROR,
  TEAM_ADD_AGENT_CLEAN,
  ASSIGN_TEAM,
  ASSIGN_TEAM_SUCCESS,
  ASSIGN_TEAM_ERROR,
} from '../constants';

export const getTeams = (userId) => ({
  type: TEAMS_GET,
  payload: userId,
});
export const getTeamsSuccess = (items) => ({
  type: TEAMS_GET_SUCCESS,
  payload: items,
});

export const getTeam = (userId) => ({
  type: TEAM_GET,
  payload: userId,
});
export const getTeamSuccess = (items) => ({
  type: TEAM_GET_SUCCESS,
  payload: items,
});
export const getTeamClean = (items) => ({
  type: TEAM_GET_CLEAN,
  payload: items,
});

export const addTeam = (userId) => ({
  type: TEAM_ADD,
  payload: userId,
});
export const addTeamSuccess = (items) => ({
  type: TEAM_ADD_SUCCESS,
  payload: items,
});
export const addTeamError = (error) => ({
  type: TEAM_ADD_ERROR,
  payload: error,
});
export const addTeamClean = (error) => ({
  type: TEAM_ADD_CLEAN,
  payload: error,
});

export const updateTeam = (userId) => ({
  type: TEAM_UPDATE,
  payload: userId,
});
export const updateTeamSuccess = (items) => ({
  type: TEAM_UPDATE_SUCCESS,
  payload: items,
});
export const updateTeamError = (error) => ({
  type: TEAM_UPDATE_ERROR,
  payload: error,
});
export const updateTeamClean = (error) => ({
  type: TEAM_UPDATE_CLEAN,
  payload: error,
});

export const deleteTeam = (userId) => ({
  type: TEAM_DELETE,
  payload: userId,
});
export const deleteTeamSuccess = (items) => ({
  type: TEAM_DELETE_SUCCESS,
  payload: items,
});
export const deleteTeamError = (error) => ({
  type: TEAM_DELETE_ERROR,
  payload: error,
});
export const deleteTeamClean = (item) => ({
  type: TEAM_DELETE_CLEAN,
  payload: item,
});

export const getTeamAgents = (userId) => ({
  type: TEAM_GET_AGENTS,
  payload: userId,
});
export const getTeamAgentsSuccess = (items) => ({
  type: TEAM_GET_AGENTS_SUCCESS,
  payload: items,
});

export const addAgentsTeam = (userId) => ({
  type: TEAM_ADD_AGENT,
  payload: userId,
});
export const addAgentsTeamSuccess = (items) => ({
  type: TEAM_ADD_AGENT_SUCCESS,
  payload: items,
});
export const addAgentsTeamError = (error) => ({
  type: TEAM_ADD_AGENT_ERROR,
  payload: error,
});
export const addAgentsTeamClean = (error) => ({
  type: TEAM_ADD_AGENT_CLEAN,
  payload: error,
});

export const assignTeam = (item) => ({
  type: ASSIGN_TEAM,
  payload: item,
});

export const assignTeamSucess = (items) => ({
  type: ASSIGN_TEAM_SUCCESS,
  payload: items,
});

export const assignTeamError = (error) => ({
  type: ASSIGN_TEAM_ERROR,
  payload: error,
});
