import {
  AGENTS_GET,
  AGENTS_GET_SUCCESS,
  AGENTS_DELETE,
  AGENTS_DELETE_SUCCESS,
  AGENTS_DELETE_ERROR,
  AGENTS_DELETE_CLEAN,
  AGENTS_ADD,
  AGENTS_ADD_SUCCESS,
  AGENTS_ADD_ERROR,
  AGENTS_ADD_CLEAN,
  ASSIGN_AGENT,
  ASSIGN_AGENT_SUCCESS,
  UPDATE_AGENTS_PRESENCE,
} from '../constants';

const INIT_STATE = {
  loadedAgents: false,
  agents: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case AGENTS_GET:
      return { ...state, loadedAgents: true };

    case AGENTS_GET_SUCCESS:
      return { ...state, agents: action.payload };

    case AGENTS_DELETE:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case AGENTS_DELETE_SUCCESS:
      return {
        ...state,
        agents: state.agents.filter(
          (item) => item.id !== action.payload.payload.id
        ),
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case AGENTS_DELETE_ERROR:
      return {
        ...state,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case AGENTS_DELETE_CLEAN:
      return {
        ...state,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case AGENTS_ADD:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case AGENTS_ADD_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let newAgents = state.agents;
      if (action.payload.payload.id) {
        // update record in list
        newAgents = newAgents.map((item) =>
          item.id === action.payload.payload.id ? action.payload.response : item
        );
      } else {
        // add record in list
        newAgents = [...newAgents, action.payload.response];
      }
      return {
        ...state,
        agents: newAgents,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case AGENTS_ADD_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case AGENTS_ADD_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    case ASSIGN_AGENT_SUCCESS:
      return { ...state, loaded: true };

    case ASSIGN_AGENT:
      return { ...state, loaded: true };

    case UPDATE_AGENTS_PRESENCE:
      // eslint-disable-next-line no-case-declarations
      const agentList = [...state.agents];
      agentList.forEach((element, index) => {
        if (action.payload[element.id]) {
          agentList[index].availability_status = action.payload[element.id];
        } else {
          delete agentList[index].availability_status;
        }
      });
      return {
        ...state,
        loaded: true,
        agents: agentList,
      };

    default:
      return { ...state };
  }
};
