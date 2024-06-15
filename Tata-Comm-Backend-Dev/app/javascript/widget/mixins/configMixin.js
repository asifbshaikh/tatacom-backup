export default {
  computed: {
    useInboxAvatarForBot() {
      return window.tringWidgetDefaults.useInboxAvatarForBot;
    },
    hasAConnectedAgentBot() {
      return !!window.tringWebChannel.hasAConnectedAgentBot;
    },
    inboxAvatarUrl() {
      return window.tringWebChannel.avatarUrl;
    },
    channelConfig() {
      return window.tringWebChannel;
    },
    hasEmojiPickerEnabled() {
      return this.channelConfig.enabledFeatures.includes('emoji_picker');
    },
    hasAttachmentsEnabled() {
      return this.channelConfig.enabledFeatures.includes('attachments');
    },
    preChatFormEnabled() {
      return window.tringWebChannel.preChatFormEnabled;
    },
    preChatFormOptions() {
      let requireEmail = false;
      let preChatMessage = '';
      const options = window.tringWebChannel.preChatFormOptions || {};
      requireEmail = options.require_email;
      preChatMessage = options.pre_chat_message;
      return {
        requireEmail,
        preChatMessage,
      };
    },
  },
};
