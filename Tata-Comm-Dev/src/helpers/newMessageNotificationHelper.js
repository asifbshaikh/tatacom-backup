export const getAssigneeFromNotification = (currentConv) => {
  let id;
  if (currentConv.meta) {
    const assignee = currentConv.meta.assignee;
    if (assignee) {
      id = assignee.id;
    }
  }
  return id;
};

export const shouldPlayAudio = (
  message,
  conversationId,
  userId,
  isDocHidden
) => {
  const {
    conversation_id: incomingConvId,
    sender_id: senderId,
    message_type: messageType,
    private: isPrivate,
  } = message;
  const isFromCurrentUser = userId === senderId;

  const playAudio = !isFromCurrentUser && (messageType === 0 || isPrivate);
  if (isDocHidden) return playAudio;
  if (conversationId !== incomingConvId) return playAudio;
  return false;
};

export const notificationEnabled = (enableAudioAlerts, id, userId) => {
  if (enableAudioAlerts === 'mine') {
    return userId === id;
  }
  if (enableAudioAlerts === 'all') {
    return true;
  }
  return false;
};
