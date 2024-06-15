export default {
  computed: {
    hostURL() {
      return window.tringConfig.hostURL;
    },
    vapidPublicKey() {
      return window.tringConfig.vapidPublicKey;
    },
    enabledLanguages() {
      return window.tringConfig.enabledLanguages;
    },
  },
};
