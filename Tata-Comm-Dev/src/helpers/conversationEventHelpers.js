import { updateAgentPresence } from 'redux/agents/actions';
import {
  logoutSuccessOrFailure,
  setCUrrentUserAvailability,
} from 'redux/auth/actions';
import {
  deleteContacts,
  detailsContactItem,
  detailsContactItemSuccess,
  setContacts,
  updateContactPresence,
} from 'redux/contacts/actions';
import {
  conversationContactDetailsUpdate,
  deleteFromConversation,
  fetchConversationStats,
  newMessageNotification,
  onConversationCreatedEvent,
  typingOffEvent,
  typingOnEvent,
  updateConversation,
  updateConversationContactDetails,
} from 'redux/inbox/actions';
import { addMessage } from 'redux/inbox/actions';
import { getNotificationsUpdatedUnreadCount } from 'redux/notifications/actions';
import { getCurrentUserAccount } from './Utils';

const cancelTyping = [];

export const actionCableEvents = {
  'message.created': onMessageCreated,
  'message.updated': onMessageUpdated,
  'conversation.created': onConversationCreated,
  'conversation.status_changed': onStatusChange,
  'assignee.changed': onAssigneeChanged,
  'conversation.typing_on': onTypingOn,
  'conversation.typing_off': onTypingOff,
  'conversation.contact_changed': onConversationContactChange,
  'presence.update': onPresenceUpdate,
  'user:logout': onLogout,
  'page:reload': onReload,
  'contact.deleted': onContactDeleted,
  'contact.updated': onContactUpdated,
  'conversation.mentioned': '',
  'notification.created': onNotificationCreated,
};

export function onMessageCreated(message, dispatch) {
  dispatch(newMessageNotification(message));
  dispatch(addMessage({ message }));
}

export function onMessageUpdated(message, dispatch) {
  dispatch(addMessage({ message }));
}

export function onContactUpdated(message, dispatch) {
  dispatch(detailsContactItem(message));
  dispatch(conversationContactDetailsUpdate(message));
}

export function onContactDeleted(data, dispatch) {
  dispatch(deleteContacts(data.id));
  setTimeout(() => {
    dispatch(deleteFromConversation(data.id));
  }, 2000);
  dispatch(fetchConversationStats(true));
}

export function onLogout(_, dispatch) {
  dispatch(logoutSuccessOrFailure(true));
}

export function onReload() {
  window.location.reload();
}

export function onPresenceUpdate(data, dispatch) {
  dispatch(updateContactPresence(data.contacts));
  dispatch(updateAgentPresence(data.users));
  dispatch(setCUrrentUserAvailability(data.users));
}

export const getSelectedChatConversation = (
  allConversations,
  selectedChatId
) => {
  return allConversations?.filter(
    (conversation) => conversation.id === selectedChatId
  );
};

export const findPendingMessageIndex = (chat, message) => {
  const { echo_id: tempMessageId } = message || {};
  return chat.messages?.findIndex((m) => {
    return m.id === message.id || m.id === tempMessageId;
  });
};

export function onConversationCreated(data, dispatch) {
  dispatch(onConversationCreatedEvent(data));
  dispatch(fetchConversationStats(true));
}

export function onStatusChange(data, dispatch) {
  const {
    meta: { sender },
  } = data;
  dispatch(updateConversation(data));
  dispatch(setContacts(sender));
  dispatch(fetchConversationStats(true));
}

export function onAssigneeChanged(data, dispatch) {
  const {
    id,
    meta: { sender },
  } = data;
  if (id) {
    dispatch(updateConversation(data));
    dispatch(setContacts(sender));
  }
  dispatch(fetchConversationStats(true));
}

export function onNotificationCreated(_, dispatch) {
  dispatch(getNotificationsUpdatedUnreadCount());
}

export function onTypingOn({ conversation, user }, dispatch) {
  const conversationId = conversation.id;
  clearTimer(conversationId);
  dispatch(typingOnEvent({ conversationId, user }));
  initTimer({ conversation, user });
}

export function onTypingOff({ conversation, user }, dispatch) {
  const conversationId = conversation.id;
  clearTimer(conversationId);
  dispatch(typingOffEvent({ conversationId, user }));
}

export function clearTimer(conversationId) {
  const timerEvent = cancelTyping[conversationId];
  if (timerEvent) {
    clearTimeout(timerEvent);
    cancelTyping[conversationId] = null;
  }
}

export function initTimer({ conversation, user }) {
  const conversationId = conversation.id;
  // Turn off typing automatically after 30 seconds
  cancelTyping[conversationId] = setTimeout(() => {
    onTypingOff({ conversationId, user });
  }, 30000);
}

export function isAValidEvent(data) {
  const currentAccountDetails = getCurrentUserAccount();
  return currentAccountDetails.id === data.account_id;
}

export function onConversationContactChange(data, dispatch) {
  const { meta = {}, id: conversationId } = data;
  const { sender } = meta || {};
  if (conversationId) {
    dispatch(detailsContactItemSuccess(sender));
    dispatch(updateConversationContactDetails({ conversationId, sender }));
  }
}
