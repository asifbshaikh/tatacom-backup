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
} from 'redux/constants';

const INIT_STATE = {
  teams: [],
  successAdd: false,
  errorAdd: {},
  loadingAdd: false,
  successAddAgents: false,
  errorAddAgents: {},
  loadingAddAgents: false,
  loadedTeam: false,
  editFormData: {},
  loadedTeamAgents: false,
  teamAgents: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TEAMS_GET:
      return {
        ...state,
        loadedTeams: true,
        loadedTeam: false,
        loadedTeamAgents: false,
      };
    case TEAMS_GET_SUCCESS:
      return { ...state, teams: action.payload };

    case TEAM_GET:
      return { ...state, loadedTeam: true, loadedTeamAgents: false };

    case TEAM_GET_SUCCESS:
      return { ...state, editFormData: action.payload };

    case TEAM_GET_CLEAN:
      return {
        ...state,
        loadedTeam: false,
        loadedTeamAgents: false,
        editFormData: [],
      };

    case TEAM_ADD:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: true };

    case TEAM_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let newItems = state.teams;
      if (action.payload.payload.id) {
        // update record in list
        newItems = newItems.map((item) =>
          item.id === action.payload.payload.id ? action.payload.response : item
        );
      } else {
        // add record in list
        newItems = [...newItems, action.payload.response];
      }
      return {
        ...state,
        teams: newItems,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
        addData: action.payload.response,
      };

    case TEAM_ADD_ERROR:
      return {
        ...state,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case TEAM_ADD_CLEAN:
      return { ...state, errorAdd: {}, successAdd: false, loadingAdd: false };

    case TEAM_UPDATE:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: true,
      };

    case TEAM_UPDATE_SUCCESS:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: true,
        loadingUpdate: false,
        editFormData: action.payload,
      };

    case TEAM_UPDATE_ERROR:
      return {
        ...state,
        errorUpdate: action.payload,
        successUpdate: false,
        loadingUpdate: false,
      };

    case TEAM_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case TEAM_DELETE_SUCCESS:
      return {
        ...state,
        teams: state.teams.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case TEAM_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case TEAM_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case TEAM_UPDATE_CLEAN:
      return {
        ...state,
        errorUpdate: {},
        successUpdate: false,
        loadingUpdate: false,
      };

    case TEAM_GET_AGENTS:
      return { ...state, loadedTeamAgents: true };

    case TEAM_GET_AGENTS_SUCCESS:
      return { ...state, teamAgents: action.payload };

    case TEAM_ADD_AGENT:
      return {
        ...state,
        errorAddAgents: {},
        successAddAgents: false,
        loadingAddAgents: true,
      };

    case TEAM_ADD_AGENT_SUCCESS:
      return {
        ...state,
        errorAddAgents: {},
        successAddAgents: true,
        loadingAddAgents: false,
      };

    case TEAM_ADD_AGENT_ERROR:
      return {
        ...state,
        errorAddAgents: action.payload,
        successAddAgents: false,
        loadingAddAgents: false,
      };

    case TEAM_ADD_AGENT_CLEAN:
      return {
        ...state,
        errorAddAgents: {},
        successAddAgents: false,
        loadingAddAgents: false,
      };

    default:
      return { ...state };
  }
};
