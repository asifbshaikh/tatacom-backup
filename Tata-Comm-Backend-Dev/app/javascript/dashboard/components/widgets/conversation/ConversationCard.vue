<template>
  <div
    class="conversation"
    :class="{
      active: isActiveChat,
      'unread-chat': hasUnread,
      'has-inbox-name': showInboxName,
    }"
    @click="cardClick(chat)"
  >
    <thumbnail
      v-if="!hideThumbnail"
      :src="currentContact.thumbnail"
      :badge="inboxBadge"
      class="columns"
      :username="currentContact.name"
      :status="currentContact.availability_status"
      size="40px"
    />
    <div class="conversation--details columns">
      <div class="conversation--metadata">
        <inbox-name v-if="showInboxName" :inbox="inbox" />
        <span
          v-if="showAssignee && assignee.name"
          class="label assignee-label text-truncate"
        >
          <fluent-icon icon="person" size="12" />
          {{ assignee.name }}
        </span>
      </div>
      <h4 class="conversation--user">
        {{ currentContact.name }}
      </h4>
      <p v-if="lastMessageInChat" class="conversation--message">
        <fluent-icon
          v-if="isMessagePrivate"
          size="16"
          class="message--attachment-icon last-message-icon"
          icon="lock-closed"
        />
        <fluent-icon
          v-else-if="messageByAgent"
          size="16"
          class="message--attachment-icon last-message-icon"
          icon="arrow-reply"
        />
        <fluent-icon
          v-else-if="isMessageAnActivity"
          size="16"
          class="message--attachment-icon last-message-icon"
          icon="info"
        />
        <span v-if="lastMessageInChat.content">
          {{ parsedLastMessage }}
        </span>
        <span v-else-if="lastMessageInChat.attachments">
          <fluent-icon
            v-if="attachmentIcon"
            size="16"
            class="message--attachment-icon"
            :icon="attachmentIcon"
          />
          {{ this.$t(`${attachmentMessageContent}`) }}
        </span>
        <span v-else>
          {{ $t('CHAT_LIST.NO_CONTENT') }}
        </span>
      </p>
      <p v-else class="conversation--message">
        <fluent-icon size="16" class="message--attachment-icon" icon="info" />
        <span>
          {{ this.$t(`CHAT_LIST.NO_MESSAGES`) }}
        </span>
      </p>
      <div class="conversation--meta">
        <span class="timestamp">
          {{ dynamicTime(chat.timestamp) }}
        </span>
        <span class="unread">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { MESSAGE_TYPE } from 'widget/helpers/constants';
import messageFormatterMixin from 'shared/mixins/messageFormatterMixin';
import Thumbnail from '../Thumbnail';
import conversationMixin from '../../../mixins/conversations';
import timeMixin from '../../../mixins/time';
import router from '../../../routes';
import { frontendURL, conversationUrl } from '../../../helper/URLHelper';
import InboxName from '../InboxName';
import inboxMixin from 'shared/mixins/inboxMixin';

const ATTACHMENT_ICONS = {
  image: 'image',
  audio: 'headphones-sound-wave',
  video: 'video',
  file: 'document',
  location: 'location',
  fallback: 'link',
};

export default {
  components: {
    InboxName,
    Thumbnail,
  },

  mixins: [inboxMixin, timeMixin, conversationMixin, messageFormatterMixin],
  props: {
    activeLabel: {
      type: String,
      default: '',
    },
    chat: {
      type: Object,
      default: () => {},
    },
    hideInboxName: {
      type: Boolean,
      default: false,
    },
    hideThumbnail: {
      type: Boolean,
      default: false,
    },
    teamId: {
      type: [String, Number],
      default: 0,
    },
    foldersId: {
      type: [String, Number],
      default: 0,
    },
    showAssignee: {
      type: Boolean,
      default: false,
    },
    conversationType: {
      type: String,
      default: '',
    },
  },

  computed: {
    ...mapGetters({
      currentChat: 'getSelectedChat',
      inboxesList: 'inboxes/getInboxes',
      activeInbox: 'getSelectedInbox',
      currentUser: 'getCurrentUser',
      accountId: 'getCurrentAccountId',
    }),

    chatMetadata() {
      return this.chat.meta || {};
    },

    assignee() {
      return this.chatMetadata.assignee || {};
    },

    currentContact() {
      return this.$store.getters['contacts/getContact'](
        this.chatMetadata.sender.id
      );
    },

    lastMessageFileType() {
      const lastMessage = this.lastMessageInChat;
      const [{ file_type: fileType } = {}] = lastMessage.attachments;
      return fileType;
    },

    attachmentIcon() {
      return ATTACHMENT_ICONS[this.lastMessageFileType];
    },

    attachmentMessageContent() {
      return `CHAT_LIST.ATTACHMENTS.${this.lastMessageFileType}.CONTENT`;
    },

    isActiveChat() {
      return this.currentChat.id === this.chat.id;
    },

    unreadCount() {
      return this.unreadMessagesCount(this.chat);
    },

    hasUnread() {
      return this.unreadCount > 0;
    },

    isInboxNameVisible() {
      return !this.activeInbox;
    },

    lastMessageInChat() {
      return this.lastMessage(this.chat);
    },

    messageByAgent() {
      const lastMessage = this.lastMessageInChat;
      const { message_type: messageType } = lastMessage;
      return messageType === MESSAGE_TYPE.OUTGOING;
    },

    isMessageAnActivity() {
      const lastMessage = this.lastMessageInChat;
      const { message_type: messageType } = lastMessage;
      return messageType === MESSAGE_TYPE.ACTIVITY;
    },

    isMessagePrivate() {
      const lastMessage = this.lastMessageInChat;
      const { private: isPrivate } = lastMessage;
      return isPrivate;
    },

    parsedLastMessage() {
      const { content_attributes: contentAttributes } = this.lastMessageInChat;
      const { email: { subject } = {} } = contentAttributes || {};
      var content = this.lastMessageInChat.content;
      var pain_text_mgs = null;

      if (content.includes('"body"=>') || content.includes('"image"=>') || content.includes('"video"=>') || content.includes('"audio"=>') || content.includes('"document"=>') || content.includes('"location"=>') || content.includes('"contacts"=>') || content.includes('"text"=>')){
        
        content = content.replace(new RegExp("=>", 'g'), ":");
        content = JSON.parse(content);
        console.log("&&&&&&&&&&", content);
        var text_message_only = null;
        if (content['body']){
          text_message_only = content['body']['text'];
        }
        
        else if (!text_message_only && content['image']){
          text_message_only = content['image']['caption'];
          if (!text_message_only){
            text_message_only = "Picture message";
          }
        }
        else if(!text_message_only && content['video']){
          text_message_only = content['video']['caption'];
          if (!text_message_only){
            text_message_only = "Video message";
          }
        }
        else if(!text_message_only && content['document']){
          text_message_only = content['document']['filename'];
          if (!text_message_only){
            text_message_only = "File message";
          }
        }
        else if(!text_message_only && content['audio']){
          text_message_only = content['audio']['filename'];
          if (!text_message_only){
            text_message_only = "File message";
          }
        }

        else if(!text_message_only && content['location']){
          text_message_only = content['location']['name'];
          if (!text_message_only){
            text_message_only = "Location message";
          }
        }
        else if(!text_message_only && content['text']){
          text_message_only = content['text']['caption'];
          if (!text_message_only){
            text_message_only = "Text message";
          }
        }
        else if(!text_message_only && content['contacts']){
          //text_message_only = content['text']['caption'];
          if (!text_message_only){
            text_message_only = "Contact message";
          }
        }
        else{
          text_message_only = "No Content";
        }

        console.log("____________________________", this.getPlainText(subject || text_message_only));
        return this.getPlainText(subject || text_message_only)
      }
      else {
        return this.getPlainText(subject || this.lastMessageInChat.content)
      }
      //return this.getPlainText(subject || this.lastMessageInChat.content);
    },

    inbox() {
      const { inbox_id: inboxId } = this.chat;
      const stateInbox = this.$store.getters['inboxes/getInbox'](inboxId);
      return stateInbox;
    },

    showInboxName() {
      return (
        !this.hideInboxName &&
        this.isInboxNameVisible &&
        this.inboxesList.length > 1
      );
    },
    inboxName() {
      const stateInbox = this.inbox;
      return stateInbox.name || '';
    },
  },
  methods: {
    cardClick(chat) {
      const { activeInbox } = this;
      const path = conversationUrl({
        accountId: this.accountId,
        activeInbox,
        id: chat.id,
        label: this.activeLabel,
        teamId: this.teamId,
        foldersId: this.foldersId,
        conversationType: this.conversationType,
      });
      if (this.isActiveChat) {
        return;
      }
      router.push({ path: frontendURL(path) });
    },
  },
};
</script>
<style lang="scss" scoped>
.conversation {
  align-items: center;

  &:hover {
    background: var(--color-background-light);
  }
}

.has-inbox-name {
  &::v-deep .user-thumbnail-box {
    margin-top: var(--space-normal);
    align-items: flex-start;
  }
  .conversation--meta {
    margin-top: var(--space-normal);
  }
}

.conversation--details {
  .conversation--user {
    padding-top: var(--space-micro);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 60%;
  }
}

.last-message-icon {
  color: var(--s-600);
}

.conversation--metadata {
  display: flex;
  justify-content: space-between;
  padding-right: var(--space-normal);

  .label {
    background: none;
    color: var(--s-500);
    font-size: var(--font-size-mini);
    font-weight: var(--font-weight-medium);
    line-height: var(--space-slab);
    padding: var(--space-micro) 0 var(--space-micro) 0;
  }

  .assignee-label {
    display: inline-flex;
    max-width: 50%;
  }
}

.message--attachment-icon {
  margin-top: var(--space-minus-micro);
  vertical-align: middle;
}
</style>
