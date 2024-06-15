import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_ERROR,
  REGISTER_USER_ERROR,
  REGISTER_USER_CLEAN,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  FORGOT_PASSWORD_CLEAN,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_CLEAN,
  VALIDITY_CHECK,
  VALIDITY_CHECK_SUCCESS,
  VALIDITY_CHECK_ERROR,
  PROFILE_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_ERROR,
  PROFILE_UPDATE_CLEAN,
  UPDATE_AVAILABILITY,
  UPDATE_AVAILABILITY_SUCCESS,
  UPDATE_AVAILABILITY_ERROR,
  UPDATE_AVAILABILITY_CLEAN,
  PROFILE_AVATAR_DELETE,
  PROFILE_AVATAR_DELETE_SUCCESS,
  NOTIFICATION_SETTINGS_GET,
  NOTIFICATION_SETTINGS_GET_SUCCESS,
  NOTIFICATION_SETTINGS_POST,
  NOTIFICATION_SETTINGS_POST_SUCCESS,
  NOTIFICATION_SETTINGS_POST_ERROR,
  NOTIFICATION_SETTINGS_POST_CLEAN,
  LOGOUT_SUCCESS_OR_FAILURE,
  SET_CURRENT_USER_AVAILABILITY,
} from 'redux/constants';

export const loginUser = (user, history) => ({
  type: LOGIN_USER,
  payload: { user, history },
});
export const loginUserSuccess = (user) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});
export const loginUserError = (message) => ({
  type: LOGIN_USER_ERROR,
  payload: { message },
});

export const forgotPassword = (forgotUserMail) => ({
  type: FORGOT_PASSWORD,
  payload: forgotUserMail,
});
export const forgotPasswordSuccess = (forgotUserMail) => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: forgotUserMail,
});
export const forgotPasswordError = (message) => ({
  type: FORGOT_PASSWORD_ERROR,
  payload: { message },
});
export const forgotPasswordClean = (message) => ({
  type: FORGOT_PASSWORD_CLEAN,
  payload: { message },
});

export const resetPassword = (payload) => ({
  type: RESET_PASSWORD,
  payload,
});
export const resetPasswordSuccess = (newPassword) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: newPassword,
});
export const resetPasswordError = (message) => ({
  type: RESET_PASSWORD_ERROR,
  payload: { message },
});
export const resetPasswordClean = (message) => ({
  type: RESET_PASSWORD_CLEAN,
  payload: { message },
});

// export const registerUser = (user, history) => ({
//   type: REGISTER_USER,
//   payload: { user, history },
// });
export const registerUser = (payload) => ({
  type: REGISTER_USER,
  payload,
});
export const registerUserSuccess = (user) => ({
  type: REGISTER_USER_SUCCESS,
  payload: user,
});
export const registerUserError = (message) => ({
  type: REGISTER_USER_ERROR,
  payload: { message },
});
export const registerUserClean = (message) => ({
  type: REGISTER_USER_CLEAN,
  payload: { message },
});

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload: { history },
});

export const validityCheck = (params) => ({
  type: VALIDITY_CHECK,
  payload: params,
});
export const validityCheckSuccess = (user) => ({
  type: VALIDITY_CHECK_SUCCESS,
  payload: user,
});
export const validityCheckError = (message) => ({
  type: VALIDITY_CHECK_ERROR,
  payload: { message },
});

export const updateProfile = (userId) => ({
  type: PROFILE_UPDATE,
  payload: userId,
});
export const updateProfileSuccess = (items) => ({
  type: PROFILE_UPDATE_SUCCESS,
  payload: items,
});
export const updateProfileError = (error) => ({
  type: PROFILE_UPDATE_ERROR,
  payload: error,
});
export const updateProfileClean = (error) => ({
  type: PROFILE_UPDATE_CLEAN,
  payload: error,
});

export const updateAvailability = (userId) => ({
  type: UPDATE_AVAILABILITY,
  payload: userId,
});
export const updateAvailabilitySuccess = (items) => ({
  type: UPDATE_AVAILABILITY_SUCCESS,
  payload: items,
});
export const updateAvailabilityError = (error) => ({
  type: UPDATE_AVAILABILITY_ERROR,
  payload: error,
});
export const updateAvailabilityClean = (error) => ({
  type: UPDATE_AVAILABILITY_CLEAN,
  payload: error,
});

export const deleteProfileAvatar = (userId) => ({
  type: PROFILE_AVATAR_DELETE,
  payload: userId,
});
export const deleteProfileAvatarSuccess = (items) => ({
  type: PROFILE_AVATAR_DELETE_SUCCESS,
  payload: items,
});

export const getNotificationSettings = (userId) => ({
  type: NOTIFICATION_SETTINGS_GET,
  payload: userId,
});
export const getNotificationSettingsSuccess = (items) => ({
  type: NOTIFICATION_SETTINGS_GET_SUCCESS,
  payload: items,
});

export const postNotificationSettings = (userId) => ({
  type: NOTIFICATION_SETTINGS_POST,
  payload: userId,
});
export const postNotificationSettingsSuccess = (items) => ({
  type: NOTIFICATION_SETTINGS_POST_SUCCESS,
  payload: items,
});
export const postNotificationSettingsError = (error) => ({
  type: NOTIFICATION_SETTINGS_POST_ERROR,
  payload: error,
});
export const postNotificationSettingsClean = (error) => ({
  type: NOTIFICATION_SETTINGS_POST_CLEAN,
  payload: error,
});
export const logoutSuccessOrFailure = (items) => ({
  type: LOGOUT_SUCCESS_OR_FAILURE,
  payload: items,
});

export const setCUrrentUserAvailability = (items) => ({
  type: SET_CURRENT_USER_AVAILABILITY,
  payload: items,
});
