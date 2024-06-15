import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';
import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
} from 'helpers/ApiHelper';

import {
  AGENTS_GET,
  AGENTS_DELETE,
  AGENTS_ADD,
  ASSIGN_AGENT,
} from '../constants';

import {
  getAgentsSuccess,
  deleteAgentSuccess,
  deleteAgentError,
  addAgentSuccess,
  addAgentError,
  assignAgentSucess,
  assignAgentError,
} from './actions';

const getAgentsAsync = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}agents`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getAgents({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getAgentsAsync, payload);
    yield put(getAgentsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const deleteAgentRequest = async (postData) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}agents/${postData.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

const assignAgentRequest = async (postData) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/${postData.id}/assignments?assignee_id=${
      postData.assignee_id
    }`,
    { assignee_id: postData.assignee_id },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* assignAgent({ payload }) {
  try {
    const response = yield call(assignAgentRequest, payload);
    yield put(assignAgentSucess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(assignAgentError(errorMsg));
  }
}

function* deleteAgent({ payload }) {
  try {
    const response = yield call(deleteAgentRequest, payload);
    yield put(deleteAgentSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteAgentError(errorMsg));
  }
}

const addAgentRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  const itemIdStr = postData.id ? `/${postData.id}` : '';
  return axios[method](`${apiUrlNew()}agents${itemIdStr}`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addAgent({ payload }) {
  try {
    const response = yield call(addAgentRequest, payload);
    yield put(addAgentSuccess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addAgentError(errorMsg));
  }
}

export function* watchGetAgents() {
  yield takeEvery(AGENTS_GET, getAgents);
  yield takeEvery(AGENTS_DELETE, deleteAgent);
  yield takeEvery(AGENTS_ADD, addAgent);
  yield takeEvery(ASSIGN_AGENT, assignAgent);
}

export default function* rootSaga() {
  yield all([fork(watchGetAgents)]);
}
