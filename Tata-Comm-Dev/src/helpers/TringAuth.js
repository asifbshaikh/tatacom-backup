import axios from 'axios';
import {
  apiUrlBase,
  apiUrlByType,
  getHeaders,
  getHeadersBase,
} from 'helpers/ApiHelper';

const auth = {
  signInWithEmailAndPassword: (email, password) => {
    const postData = { email, password };
    return axios.post(`${apiUrlBase()}auth/sign_in`, postData, {
      headers: getHeadersBase(),
    });
  },
  signOut: () => {
    return axios.delete(`${apiUrlBase()}auth/sign_out`, {
      headers: getHeaders(),
    });
  },
  sendPasswordResetEmail: (email) => {
    const postData = { email };
    return axios.post(`${apiUrlBase()}auth/password`, postData, {
      headers: getHeadersBase(),
    });
  },
  confirmPasswordReset: ({ resetPasswordToken, password, confirmPassword }) => {
    const postData = {
      reset_password_token: resetPasswordToken,
      password_confirmation: confirmPassword,
      password,
    };
    return axios.put(`${apiUrlBase()}auth/password`, postData, {
      headers: getHeadersBase(),
    });
  },
  registerUserWithDetails: ({ fullName, email, accountName, password }) => {
    const postData = {
      user_full_name: fullName,
      email,
      account_name: accountName,
      // password_confirmation: confirmPassword,
      password,
    };
    return axios.post(apiUrlByType('register'), postData, {
      headers: getHeadersBase(),
    });
  },
  validityCheck: () => {
    return axios.get(`${apiUrlBase()}auth/validate_token`, {
      headers: getHeaders(),
    });
  },
  updateAvailability: (postData) => {
    return axios.post(apiUrlByType('profile/availability'), postData, {
      headers: getHeaders(),
    });
  },
};
const database = {};

export { auth, database };
