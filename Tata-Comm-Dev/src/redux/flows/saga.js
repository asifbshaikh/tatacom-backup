import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';

export function* watchFlows() {}

export default function* rootSaga() {
  yield all([fork(watchFlows)]);
}
