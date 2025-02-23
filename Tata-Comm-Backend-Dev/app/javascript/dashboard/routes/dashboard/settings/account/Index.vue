<template>
  <div class="columns profile--settings">
    <form v-if="!uiFlags.isFetchingItem" @submit.prevent="updateAccount">
      <div class="small-12 row profile--settings--row">
        <div class="columns small-3">
          <h4 class="block-title">
            {{ $t('GENERAL_SETTINGS.FORM.GENERAL_SECTION.TITLE') }}
          </h4>
          <p>{{ $t('GENERAL_SETTINGS.FORM.GENERAL_SECTION.NOTE') }}</p>
        </div>
        <div class="columns small-9 medium-5">
          <label :class="{ error: $v.name.$error }">
            {{ $t('GENERAL_SETTINGS.FORM.NAME.LABEL') }}
            <input
              v-model="name"
              type="text"
              :placeholder="$t('GENERAL_SETTINGS.FORM.NAME.PLACEHOLDER')"
              @blur="$v.name.$touch"
            />
            <span v-if="$v.name.$error" class="message">
              {{ $t('GENERAL_SETTINGS.FORM.NAME.ERROR') }}
            </span>
          </label>
          <label :class="{ error: $v.locale.$error }">
            {{ $t('GENERAL_SETTINGS.FORM.LANGUAGE.LABEL') }}
            <select v-model="locale">
              <option
                v-for="lang in languagesSortedByCode"
                :key="lang.iso_639_1_code"
                :value="lang.iso_639_1_code"
              >
                {{ lang.name }}
              </option>
            </select>
            <span v-if="$v.locale.$error" class="message">
              {{ $t('GENERAL_SETTINGS.FORM.LANGUAGE.ERROR') }}
            </span>
          </label>
          <label v-if="featureInboundEmailEnabled">
            {{ $t('GENERAL_SETTINGS.FORM.FEATURES.INBOUND_EMAIL_ENABLED') }}
          </label>
          <label v-if="featureCustomDomainEmailEnabled">
            {{
              $t('GENERAL_SETTINGS.FORM.FEATURES.CUSTOM_EMAIL_DOMAIN_ENABLED')
            }}
          </label>
          <label v-if="featureCustomDomainEmailEnabled">
            {{ $t('GENERAL_SETTINGS.FORM.DOMAIN.LABEL') }}
            <input
              v-model="domain"
              type="text"
              :placeholder="$t('GENERAL_SETTINGS.FORM.DOMAIN.PLACEHOLDER')"
            />
          </label>
          <label v-if="featureCustomDomainEmailEnabled">
            {{ $t('GENERAL_SETTINGS.FORM.SUPPORT_EMAIL.LABEL') }}
            <input
              v-model="supportEmail"
              type="text"
              :placeholder="
                $t('GENERAL_SETTINGS.FORM.SUPPORT_EMAIL.PLACEHOLDER')
              "
            />
          </label>
          <label :class="{ error: $v.autoResolveDuration.$error }">
            {{ $t('GENERAL_SETTINGS.FORM.AUTO_RESOLVE_DURATION.LABEL') }}
            <input
              v-model="autoResolveDuration"
              type="number"
              :placeholder="
                $t('GENERAL_SETTINGS.FORM.AUTO_RESOLVE_DURATION.PLACEHOLDER')
              "
              @blur="$v.autoResolveDuration.$touch"
            />
            <span v-if="$v.autoResolveDuration.$error" class="message">
              {{ $t('GENERAL_SETTINGS.FORM.AUTO_RESOLVE_DURATION.ERROR') }}
            </span>
          </label>
        </div>
      </div>

      <div class="profile--settings--row row">
        <div class="columns small-3">
          <h4 class="block-title">
            {{ $t('GENERAL_SETTINGS.FORM.ACCOUNT_ID.TITLE') }}
          </h4>
          <p>
            {{ $t('GENERAL_SETTINGS.FORM.ACCOUNT_ID.NOTE') }}
          </p>
        </div>
        <div class="columns small-9 medium-5">
          <woot-code :script="getAccountId"></woot-code>
        </div>
      </div>
      <div class="current-version">
        <div>{{ `v${globalConfig.appVersion}` }}</div>
        <div v-if="hasAnUpdateAvailable && globalConfig.displayManifest">
          {{
            $t('GENERAL_SETTINGS.UPDATE_TRING', {
              latestTringVersion: latestTringVersion,
            })
          }}
        </div>
      </div>

      <woot-submit-button
        class="button nice success button--fixed-right-top"
        :button-text="$t('GENERAL_SETTINGS.SUBMIT')"
        :loading="isUpdating"
      >
      </woot-submit-button>
    </form>

    <woot-loading-state v-if="uiFlags.isFetchingItem" />
  </div>
</template>

<script>
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import alertMixin from 'shared/mixins/alertMixin';
import configMixin from 'shared/mixins/configMixin';
import accountMixin from '../../../../mixins/account';
const semver = require('semver');

export default {
  mixins: [accountMixin, alertMixin, configMixin],
  data() {
    return {
      id: '',
      name: '',
      locale: 'en',
      domain: '',
      supportEmail: '',
      features: {},
      autoResolveDuration: null,
      latestTringVersion: null,
    };
  },
  validations: {
    name: {
      required,
    },
    locale: {
      required,
    },
    autoResolveDuration: {
      minValue: minValue(1),
      maxValue: maxValue(999),
    },
  },
  computed: {
    ...mapGetters({
      globalConfig: 'globalConfig/get',
      getAccount: 'accounts/getAccount',
      uiFlags: 'accounts/getUIFlags',
    }),
    hasAnUpdateAvailable() {
      if (!semver.valid(this.latestTringVersion)) {
        return false;
      }

      return semver.lt(this.globalConfig.appVersion, this.latestTringVersion);
    },
    languagesSortedByCode() {
      const enabledLanguages = [...this.enabledLanguages];
      return enabledLanguages.sort((l1, l2) =>
        l1.iso_639_1_code.localeCompare(l2.iso_639_1_code)
      );
    },
    isUpdating() {
      return this.uiFlags.isUpdating;
    },

    featureInboundEmailEnabled() {
      return !!this.features.inbound_emails;
    },

    featureCustomDomainEmailEnabled() {
      return this.featureInboundEmailEnabled && !!this.customEmailDomainEnabled;
    },

    getAccountId() {
      return this.id.toString();
    },
  },
  mounted() {
    if (!this.id) {
      this.initializeAccount();
    }
  },
  methods: {
    async initializeAccount() {
      try {
        await this.$store.dispatch('accounts/get');
        const {
          name,
          locale,
          id,
          domain,
          support_email,
          custom_email_domain_enabled,
          features,
          auto_resolve_duration,
          latest_tring_version: latestTringVersion,
        } = this.getAccount(this.accountId);

        this.$root.$i18n.locale = locale;
        this.name = name;
        this.locale = locale;
        this.id = id;
        this.domain = domain;
        this.supportEmail = support_email;
        this.customEmailDomainEnabled = custom_email_domain_enabled;
        this.features = features;
        this.autoResolveDuration = auto_resolve_duration;
        this.latestTringVersion = latestTringVersion;
      } catch (error) {
        // Ignore error
      }
    },

    async updateAccount() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showAlert(this.$t('GENERAL_SETTINGS.FORM.ERROR'));
        return;
      }
      try {
        await this.$store.dispatch('accounts/update', {
          locale: this.locale,
          name: this.name,
          domain: this.domain,
          support_email: this.supportEmail,
          auto_resolve_duration: this.autoResolveDuration,
        });
        this.$root.$i18n.locale = this.locale;
        this.showAlert(this.$t('GENERAL_SETTINGS.UPDATE.SUCCESS'));
      } catch (error) {
        this.showAlert(this.$t('GENERAL_SETTINGS.UPDATE.ERROR'));
      }
    },
  },
};
</script>

<style lang="scss">
@import '~dashboard/assets/scss/variables.scss';
@import '~dashboard/assets/scss/mixins.scss';

.profile--settings {
  padding: 24px;
  overflow: auto;
}

.profile--settings--row {
  @include border-normal-bottom;
  padding: $space-normal;
  .small-3 {
    padding: $space-normal $space-medium $space-normal 0;
  }
  .small-9 {
    padding: $space-normal;
  }
}

.current-version {
  font-size: var(--font-size-small);
  text-align: center;
  padding: var(--space-normal);
}
</style>
