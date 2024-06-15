import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from 'helpers/TringAuth';
import {
  // adminRoot,
  // currentUser,
  loginPageURL,
  redirectToUrl,
} from 'constants/defaultValues';
import {
  arrangeDataAndSetCurrentUser,
  getCurrentUser,
  setCurrentUser,
} from 'helpers/Utils';
// import { setAuthCredentials } from 'helpers/UtilsApi';
import {
  apiUrlByType,
  commonRequestException,
  getHeaders,
} from 'helpers/ApiHelper';

import axios from 'axios';

import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  VALIDITY_CHECK,
  PROFILE_UPDATE,
  UPDATE_AVAILABILITY,
  PROFILE_AVATAR_DELETE,
  NOTIFICATION_SETTINGS_GET,
  NOTIFICATION_SETTINGS_POST,
} from 'redux/constants';

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
  validityCheckSuccess,
  validityCheckError,
  updateProfileSuccess,
  updateProfileError,
  updateAvailabilitySuccess,
  updateAvailabilityError,
  deleteProfileAvatarSuccess,
  getNotificationSettingsSuccess,
  postNotificationSettingsSuccess,
  postNotificationSettingsError,
  logoutSuccessOrFailure,
} from './actions';

export function* watchLoginUser() {
  // eslint-disable-next-line no-use-before-define
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

// const loginWithEmailPasswordAsync = async (email, password) =>
//   // eslint-disable-next-line no-return-await
//   await auth
//     .signInWithEmailAndPassword(email, password)
//     .then((user) => user)
//     .catch((error) => error);

const loginWithEmailPasswordAsync = async (email, password) =>
  // eslint-disable-next-line no-return-await
  await auth
    .signInWithEmailAndPassword(email, password)
    .then((user) => user)
    .catch((error) => error);

function* loginWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  // const { history } = payload;
  try {
    const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
    if (loginUser.data && loginUser.data.data) {
      const item = arrangeDataAndSetCurrentUser(
        loginUser.data.data,
        loginUser.headers
      );
      yield put(loginUserSuccess(item));
      const url = redirectToUrl('adminRoot');
      // history.push(url)
      if (window.location.href !== url && window.location.pathname !== url) {
        window.location.href = url;
      }
    } else {
      let message = 'LOGIN.API.ERROR_MESSAGE';
      if (loginUser && loginUser.status === 401) {
        const { errors } = loginUser.data;
        const hasAuthErrorMsg =
          errors && errors.length && errors[0] && typeof errors[0] === 'string';
        if (hasAuthErrorMsg) {
          [message] = errors;
        } else {
          message = 'LOGIN.API.UNAUTH';
        }
      }
      yield put(loginUserError(message));
    }
  } catch (error) {
    yield put(loginUserError(error));
  }
}

export function* watchRegisterUser() {
  // eslint-disable-next-line no-use-before-define
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

/*
const registerWithEmailPasswordAsync = async (email, password) =>
  // eslint-disable-next-line no-return-await
  await auth
    .createUserWithEmailAndPassword(email, password)
    .then((user) => user)
    .catch((error) => error);

function* registerWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;
  try {
    const registerUser = yield call(
      registerWithEmailPasswordAsync,
      email,
      password
    );
    if (!registerUser.message) {
      const item = { uid: registerUser.user.uid, ...currentUser };
      setCurrentUser(item);
      yield put(registerUserSuccess(item));
      history.push(adminRoot);
    } else {
      yield put(registerUserError(registerUser.message));
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}
*/

const registerWithEmailPasswordAsync = async (payload) => {
  // eslint-disable-next-line no-return-await
  return await auth
    .registerUserWithDetails(payload)
    .then((user) => user)
    .catch((error) => error);
};

function* registerWithEmailPassword({ payload }) {
  try {
    const resetPasswordStatus = yield call(
      registerWithEmailPasswordAsync,
      payload
    );

    if (
      resetPasswordStatus.response &&
      resetPasswordStatus.response.data &&
      resetPasswordStatus.response.data.message
    ) {
      yield put(registerUserError(resetPasswordStatus.response.data.message));
    } else if (resetPasswordStatus.message) {
      yield put(registerUserError(resetPasswordStatus.message));
    } else if (resetPasswordStatus.status === 200) {
      yield put(registerUserSuccess('success'));
    }
    // else if (resetPasswordStatus.response.data.message) {
    //   yield put(registerUserError(resetPasswordStatus.response.data.message));
    // }
    else {
      console.warn(resetPasswordStatus.response);
      if (
        resetPasswordStatus.response &&
        resetPasswordStatus.response.statusText
      ) {
        yield put(registerUserError(resetPasswordStatus.response.statusText));
      } else {
        throw new Error('Error in request');
      }
    }

    // if (!resetPasswordStatus) {
    //   yield put(resetPasswordSuccess('success'));
    // } else {
    //   yield put(resetPasswordError(resetPasswordStatus.message));
    // }
  } catch (error) {
    // yield put(resetPasswordError(error));
    const errorMsg = commonRequestException(error);
    yield put(forgotPasswordError(errorMsg.errorMsg));
  }
}

export function* watchLogoutUser() {
  // eslint-disable-next-line no-use-before-define
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
  return await auth.signOut();
};

function* logout({ payload }) {
  const { history } = payload;
  try {
    const response = yield call(logoutAsync, history);
    if (response.data.success) {
      yield put(logoutSuccessOrFailure(true));
      history.push(loginPageURL);
    } else {
      throw new Error('Error in request');
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(logoutSuccessOrFailure(false));
    yield put(forgotPasswordError(errorMsg.errorMsg));
  }
}

export function* watchForgotPassword() {
  // eslint-disable-next-line no-use-before-define
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
  // eslint-disable-next-line no-return-await
  return await auth
    .sendPasswordResetEmail(email)
    .then((user) => user)
    .catch((error) => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    if (
      forgotPasswordStatus.data &&
      forgotPasswordStatus.data.message &&
      forgotPasswordStatus.status === 200
    ) {
      yield put(forgotPasswordSuccess(forgotPasswordStatus.data.message));
    } else if (forgotPasswordStatus.response.data.message) {
      yield put(
        forgotPasswordError(forgotPasswordStatus.response.data.message)
      );
    } else {
      console.warn(forgotPasswordStatus.response);
      if (
        forgotPasswordStatus.response &&
        forgotPasswordStatus.response.statusText
      ) {
        yield put(
          forgotPasswordError(forgotPasswordStatus.response.statusText)
        );
      } else {
        throw new Error('Error in request');
      }
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(forgotPasswordError(errorMsg.errorMsg));
  }
}

export function* watchResetPassword() {
  // eslint-disable-next-line no-use-before-define
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (payload) => {
  // eslint-disable-next-line no-return-await
  return await auth
    .confirmPasswordReset(payload)
    .then((user) => user)
    .catch((error) => error);
};

function* resetPassword({ payload }) {
  try {
    const resetPasswordStatus = yield call(resetPasswordAsync, payload);

    if (
      resetPasswordStatus.response &&
      resetPasswordStatus.response.data &&
      resetPasswordStatus.response.data.message
    ) {
      yield put(resetPasswordError(resetPasswordStatus.response.data.message));
    } else if (resetPasswordStatus.message) {
      yield put(resetPasswordError(resetPasswordStatus.message));
    } else if (resetPasswordStatus.status === 200) {
      yield put(resetPasswordSuccess('success'));
    }
    // else if (resetPasswordStatus.response.data.message) {
    //   yield put(resetPasswordError(resetPasswordStatus.response.data.message));
    // }
    else {
      console.warn(resetPasswordStatus.response);
      if (
        resetPasswordStatus.response &&
        resetPasswordStatus.response.statusText
      ) {
        yield put(resetPasswordError(resetPasswordStatus.response.statusText));
      } else {
        throw new Error('Error in request');
      }
    }

    // if (!resetPasswordStatus) {
    //   yield put(resetPasswordSuccess('success'));
    // } else {
    //   yield put(resetPasswordError(resetPasswordStatus.message));
    // }
  } catch (error) {
    // yield put(resetPasswordError(error));
    const errorMsg = commonRequestException(error);
    yield put(forgotPasswordError(errorMsg.errorMsg));
  }
}

export function* watchValidityCheck() {
  // eslint-disable-next-line no-use-before-define
  yield takeEvery(VALIDITY_CHECK, validityCheck);
}

const validityCheckAsync = async () =>
  // eslint-disable-next-line no-return-await
  await auth
    .validityCheck()
    .then((user) => user)
    .catch((error) => error);

function* validityCheck() {
  try {
    const validityCheckResp = yield call(validityCheckAsync);
    if (
      validityCheckResp.data &&
      validityCheckResp.data.payload &&
      validityCheckResp.data.payload.success
    ) {
      const userDataNew = validityCheckResp.data.payload.data;
      const userData = getCurrentUser();
      if (userData.account_id_choosen) {
        userDataNew.account_id_choosen = userData.account_id_choosen;
      }
      const item = arrangeDataAndSetCurrentUser(
        userDataNew,
        validityCheckResp.headers
      );
      yield put(validityCheckSuccess(item));
    } else {
      const message = 'LOGIN.API.TOKEN.ERROR_MESSAGE';
      yield put(validityCheckError(message));
      window.location.href = loginPageURL;
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(validityCheckError(errorMsg));
  }
}

const buildProfileUpdateData = ({
  password,
  password_confirmation: passwordConfirmation,
  displayName,
  avatar,
  ...profileAttributes
}) => {
  const formData = new FormData();
  Object.keys(profileAttributes).forEach((key) => {
    const hasValue = profileAttributes[key] === undefined;
    if (!hasValue) {
      formData.append(`profile[${key}]`, profileAttributes[key]);
    }
  });
  if (typeof displayName !== 'undefined') {
    formData.append('profile[display_name]', displayName || '');
  }
  if (password && passwordConfirmation) {
    formData.append('profile[password]', password);
    formData.append('profile[password_confirmation]', passwordConfirmation);
  }
  if (avatar) {
    formData.append('profile[avatar]', avatar);
  }
  return formData;
};

const updateProfileAsync = async (param) => {
  const postData =
    param.formData !== false ? buildProfileUpdateData(param) : param;

  const method = `put`;
  return axios[method](apiUrlByType('profile'), postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* updateProfile({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(updateProfileAsync, payload);
    yield put(updateProfileSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(updateProfileError(errorMsg));
  }
}

const updateAvailabilityAsync = async (param) =>
  // eslint-disable-next-line no-return-await
  await auth
    .updateAvailability(param)
    .then((user) => user)
    .catch((error) => error);
// const updateAvailabilityAsync = async (param) => {
//   const postData = param;

//   const method = `post`;
//   return axios
//   [method](
//     apiUrlByType('profile/availability'),
//     postData,
//     {
//       headers: getHeaders(),
//     }
//   ).then((res) => {
//     return res.data;
//   })
// }

function* updateAvailability({ payload }) {
  try {
    const validityCheckResp = yield call(updateAvailabilityAsync, payload);
    if (
      validityCheckResp.data &&
      validityCheckResp.data &&
      validityCheckResp.data.account_id
    ) {
      const userDataNew = validityCheckResp.data;
      const userData = getCurrentUser();
      if (userData.account_id_choosen) {
        userDataNew.account_id_choosen = userData.account_id_choosen;
      }
      const item = arrangeDataAndSetCurrentUser(
        userDataNew,
        validityCheckResp.headers
      );
      yield put(updateAvailabilitySuccess(item));
    } else {
      const message = 'API.TOKEN.ERROR_MESSAGE';
      yield put(updateAvailabilityError(message));
      // window.location.href = loginPageURL;
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(updateAvailabilityError(errorMsg));
  }

  // try {
  //   // eslint-disable-next-line no-use-before-define
  //   const response = yield call(updateAvailabilityAsync, payload);
  //   yield put(updateAvailabilitySuccess(response));
  // } catch (error) {
  //   const errorMsg = commonRequestException(error);
  //   yield put(updateAvailabilityError(errorMsg));
  // }
}

const deleteProfileAvatarAsync = async () => {
  const method = 'delete';
  return axios[method](apiUrlByType('profile/avatar'), {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteProfileAvatar({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(deleteProfileAvatarAsync, payload);
    yield put(deleteProfileAvatarSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getNotificationSettingsAsync = async () => {
  const method = 'get';
  return axios[method](apiUrlByType('profile/notificationSettings'), {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};
function* getNotificationSettings({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(getNotificationSettingsAsync, payload);
    yield put(getNotificationSettingsSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const postNotificationSettingsAsync = async (param) => {
  const postData = {
    notification_settings: param,
  };

  const method = `put`;
  return axios[method](apiUrlByType('profile/notificationSettings'), postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};
function* postNotificationSettings({ payload }) {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(postNotificationSettingsAsync, payload);
    yield put(postNotificationSettingsSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(postNotificationSettingsError(errorMsg));
  }
}

export function* watchProfile() {
  // eslint-disable-next-line no-use-before-define
  yield takeEvery(PROFILE_UPDATE, updateProfile);
  yield takeEvery(UPDATE_AVAILABILITY, updateAvailability);
  yield takeEvery(PROFILE_AVATAR_DELETE, deleteProfileAvatar);
  yield takeEvery(NOTIFICATION_SETTINGS_GET, getNotificationSettings);
  yield takeEvery(NOTIFICATION_SETTINGS_POST, postNotificationSettings);
}

export default function* rootSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgotPassword),
    fork(watchResetPassword),
    fork(watchValidityCheck),
    fork(watchProfile),
  ]);
}
