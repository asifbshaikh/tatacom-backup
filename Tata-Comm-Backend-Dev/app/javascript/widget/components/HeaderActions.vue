<template>
  <div v-if="showHeaderActions" class="actions flex items-center">
    <button
      v-if="conversationStatus === 'open'"
      class="button transparent compact"
      :title="$t('END_CONVERSATION')"
      @click="resolveConversation"
    >
      <fluent-icon icon="sign-out" size="22" class="text-black-900" />
    </button>
    <button
      v-if="showPopoutButton"
      class="button transparent compact new-window--button "
      @click="popoutWindow"
    >
      <fluent-icon icon="open" size="22" class="text-black-900" />
    </button>
    <button
      class="button transparent compact close-button"
      :class="{
        'rn-close-button': isRNWebView,
      }"
      @click="closeWindow"
    >
      <fluent-icon icon="dismiss" size="24" class="text-black-900" />
    </button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { IFrameHelper, RNHelper } from 'widget/helpers/utils';
import { buildPopoutURL } from '../helpers/urlParamsHelper';
import FluentIcon from 'shared/components/FluentIcon/Index.vue';

export default {
  name: 'HeaderActions',
  components: { FluentIcon },
  props: {
    showPopoutButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      conversationAttributes: 'conversationAttributes/getConversationParams',
    }),
    isIframe() {
      return IFrameHelper.isIFrame();
    },
    isRNWebView() {
      return RNHelper.isRNWebView();
    },
    showHeaderActions() {
      return this.isIframe || this.isRNWebView || this.hasWidgetOptions;
    },
    conversationStatus() {
      return this.conversationAttributes.status;
    },
    hasWidgetOptions() {
      return this.showPopoutButton || this.conversationStatus === 'open';
    },
  },
  methods: {
    popoutWindow() {
      this.closeWindow();
      const {
        location: { origin },
        tringWebChannel: { websiteToken },
        authToken,
      } = window;

      const popoutWindowURL = buildPopoutURL({
        origin,
        websiteToken,
        locale: this.$root.$i18n.locale,
        conversationCookie: authToken,
      });
      const popoutWindow = window.open(
        popoutWindowURL,
        `webwidget_session_${websiteToken}`,
        'resizable=off,width=400,height=600'
      );
      popoutWindow.focus();
    },
    closeWindow() {
      if (IFrameHelper.isIFrame()) {
        IFrameHelper.sendMessage({ event: 'closeWindow' });
      } else if (RNHelper.isRNWebView) {
        RNHelper.sendMessage({ type: 'close-widget' });
      }
    },
    resolveConversation() {
      this.$store.dispatch('conversation/resolveConversation');
    },
  },
};
</script>
<style scoped lang="scss">
@import '~widget/assets/scss/variables.scss';

.actions {
  button {
    margin-left: $space-normal;
  }

  span {
    color: $color-heading;
    font-size: $font-size-large;
  }

  .close-button {
    display: none;
  }
  .rn-close-button {
    display: block !important;
  }
}
</style>
