import {
  GET_NOTIFICATIONS_LIST,
  GET_NOTIFICATIONS_LIST_SUCCESS,
  GET_NOTIFICATION_UNREAD_COUNT,
  GET_NOTIFICATION_UNREAD_COUNT_SUCCESS,
  GET_NOTIFICATION_UPDATED_UNREAD_COUNT,
} from 'redux/constants';

const INIT_STATE = {
  loadedNotificationsList: true,
  notificationsList: {},
  unreadCount: 0,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS_LIST:
      return { ...state, loadedNotificationsList: false };

    case GET_NOTIFICATIONS_LIST_SUCCESS:
      return {
        ...state,
        loadedNotificationsList: true,
        notificationsList: action.payload.data,
      };
    case GET_NOTIFICATION_UNREAD_COUNT:
      return { ...state, unreadCount: 0 };

    case GET_NOTIFICATION_UNREAD_COUNT_SUCCESS:
      return {
        ...state,
        unreadCount: action.payload,
      };

    case GET_NOTIFICATION_UPDATED_UNREAD_COUNT:
      // eslint-disable-next-line no-case-declarations
      const updatedCount = state.unreadCount;
      return {
        ...state,
        unreadCount: updatedCount + 1,
      };

    default:
      return { ...state };
  }
};
