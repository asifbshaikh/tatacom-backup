import {
  GET_NOTIFICATIONS_LIST,
  GET_NOTIFICATIONS_LIST_SUCCESS,
  GET_NOTIFICATION_UNREAD_COUNT,
  GET_NOTIFICATION_UNREAD_COUNT_SUCCESS,
  GET_NOTIFICATION_UPDATED_UNREAD_COUNT,
  UPDATE_NOTIFICATION_READ_STATUS,
} from 'redux/constants';

export const getNotificationsList = (item) => ({
  type: GET_NOTIFICATIONS_LIST,
  payload: item,
});
export const getNotificationsListSuccess = (items) => ({
  type: GET_NOTIFICATIONS_LIST_SUCCESS,
  payload: items,
});
export const getNotificationUnReadCount = () => ({
  type: GET_NOTIFICATION_UNREAD_COUNT,
});
export const getNotificationsUnReadCountSuccess = (payload) => ({
  type: GET_NOTIFICATION_UNREAD_COUNT_SUCCESS,
  payload: payload,
});

export const getNotificationsUpdatedUnreadCount = () => ({
  type: GET_NOTIFICATION_UPDATED_UNREAD_COUNT,
});

export const updateNotificationReadStatus = (payload) => ({
  type: UPDATE_NOTIFICATION_READ_STATUS,
  payload: payload,
});
