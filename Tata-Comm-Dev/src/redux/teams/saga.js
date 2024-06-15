import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';

import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import {
  TEAMS_GET,
  TEAM_GET,
  TEAM_ADD,
  TEAM_UPDATE,
  TEAM_DELETE,
  TEAM_ADD_AGENT,
  TEAM_GET_AGENTS,
  ASSIGN_TEAM,
} from '../constants';

import {
  getTeamsSuccess,
  getTeamSuccess,
  addTeamSuccess,
  addTeamError,
  updateTeamSuccess,
  updateTeamError,
  deleteTeamSuccess,
  deleteTeamError,
  addAgentsTeamSuccess,
  addAgentsTeamError,
  getTeamAgentsSuccess,
  assignTeamSucess,
  assignTeamError,
} from './actions';

const getTeamsAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}teams`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getTeams({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getTeamsAsync, payload);
    yield put(getTeamsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getTeamAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}teams/${param}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getTeam({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getTeamAsync, payload);
    yield put(getTeamSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getTeamAgentsAsync = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}teams/${param}/team_members`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getTeamAgents({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getTeamAgentsAsync, payload);
    yield put(getTeamAgentsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addTeamAsync = async (param) => {
  const postData = param;

  const itemIdStr = param.id ? `/${param.id}` : '';
  const method = param.id ? `patch` : 'post';
  const url = `${apiUrlNew()}teams${itemIdStr}`;
  return axios[method](url, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addTeam({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addTeamAsync, payload);
    yield put(addTeamSuccess({ payload, response }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addTeamError(errorMsg));
  }
}

function* updateTeam({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addTeamAsync, payload);
    yield put(updateTeamSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(updateTeamError(errorMsg));
  }
}

const deleteTeamAsync = async (param) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}teams/${param.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteTeam({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(deleteTeamAsync, payload);
    yield put(deleteTeamSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteTeamError(errorMsg));
  }
}

const addTeamRequest = async (param) => {
  const method = 'patch';
  const postData = {
    user_ids: param.selectedAgents.map((x) => x.value),
  };
  return axios[method](
    `${apiUrlNew()}teams/${param.id}/team_members`,
    postData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* addAgentsTeam({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(addTeamRequest, payload);
    yield put(addAgentsTeamSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addAgentsTeamError(errorMsg));
  }
}

const assignTeamRequest = async (postData) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/${postData.id}/assignments`,
    { team_id: postData.team_id },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* assignTeam({ payload }) {
  try {
    const response = yield call(assignTeamRequest, payload);
    yield put(assignTeamSucess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(assignTeamError(errorMsg));
  }
}

export function* watchAddTeam() {
  yield takeEvery(TEAMS_GET, getTeams);
  yield takeEvery(TEAM_GET, getTeam);
  yield takeEvery(TEAM_ADD, addTeam);
  yield takeEvery(TEAM_UPDATE, updateTeam);
  yield takeEvery(TEAM_DELETE, deleteTeam);
  yield takeEvery(TEAM_ADD_AGENT, addAgentsTeam);
  yield takeEvery(TEAM_GET_AGENTS, getTeamAgents);
  yield takeEvery(ASSIGN_TEAM, assignTeam);
}

export default function* rootSaga() {
  yield all([fork(watchAddTeam)]);
}
