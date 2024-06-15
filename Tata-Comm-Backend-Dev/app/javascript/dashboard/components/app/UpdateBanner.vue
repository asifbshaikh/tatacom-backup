<template>
  <banner
    v-if="shouldShowBanner"
    class="update-banner"
    color-scheme="primary"
    :banner-message="bannerMessage"
    href-link="https://github.com/tring/tring/releases"
    :href-link-text="$t('GENERAL_SETTINGS.LEARN_MORE')"
    has-close-button
    @close="dismissUpdateBanner"
  />
</template>
<script>
import Banner from 'dashboard/components/ui/Banner.vue';
import LocalStorage from '../../helper/localStorage';
import { mapGetters } from 'vuex';
import adminMixin from 'dashboard/mixins/isAdmin';

const semver = require('semver');
const dismissedUpdates = new LocalStorage('dismissedUpdates');

export default {
  components: {
    Banner,
  },
  mixins: [adminMixin],
  props: {
    latestTringVersion: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({ globalConfig: 'globalConfig/get' }),
    hasAnUpdateAvailable() {
      if (!semver.valid(this.latestTringVersion)) {
        return false;
      }
      return semver.lt(this.globalConfig.appVersion, this.latestTringVersion);
    },
    bannerMessage() {
      return this.$t('GENERAL_SETTINGS.UPDATE_TRING', {
        latestTringVersion: this.latestTringVersion,
      });
    },
    shouldShowBanner() {
      return (
        this.globalConfig.displayManifest &&
        this.hasAnUpdateAvailable &&
        !this.isVersionNotificationDismissed(this.latestTringVersion) &&
        this.isAdmin
      );
    },
  },
  methods: {
    isVersionNotificationDismissed(version) {
      return dismissedUpdates.get().includes(version);
    },
    dismissUpdateBanner() {
      let updatedDismissedItems = dismissedUpdates.get();
      if (updatedDismissedItems instanceof Array) {
        updatedDismissedItems.push(this.latestTringVersion);
      } else {
        updatedDismissedItems = [this.latestTringVersion];
      }
      dismissedUpdates.store(updatedDismissedItems);
      this.latestTringVersion = this.globalConfig.appVersion;
    },
  },
};
</script>
