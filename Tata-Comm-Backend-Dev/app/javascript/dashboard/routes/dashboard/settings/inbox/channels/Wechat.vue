<template>
  <div class="wizard-body small-9 columns">
    <page-header
      :header-title="$t('INBOX_MGMT.ADD.WECHAT.TITLE')"
      :header-content="$t('INBOX_MGMT.ADD.WECHAT.DESC')"
    />
    <form class="row" @submit.prevent="createChannel()">
      <div class="medium-8 columns">
        <label :class="{ error: $v.channelName.$error }">
          {{ $t('INBOX_MGMT.ADD.WECHAT.CHANNEL_NAME.LABEL') }}
          <input
            v-model.trim="channelName"
            type="text"
            :placeholder="$t('INBOX_MGMT.ADD.WECHAT.CHANNEL_NAME.PLACEHOLDER')"
            @blur="$v.channelName.$touch"
          />
          <span v-if="$v.channelName.$error" class="message">{{
            $t('INBOX_MGMT.ADD.WECHAT.CHANNEL_NAME.ERROR')
          }}</span>
        </label>
      </div>

      <div class="medium-8 columns">
        <label :class="{ error: $v.app_id.$error }">
          {{ $t('INBOX_MGMT.ADD.WECHAT.APP_ID.LABEL') }}
          <input
            v-model.trim="app_id"
            type="text"
            :placeholder="$t('INBOX_MGMT.ADD.WECHAT.APP_ID.PLACEHOLDER')"
            @blur="$v.app_id.$touch"
          />
          <span v-if="$v.app_id.$error" class="message">{{
            $t('INBOX_MGMT.ADD.WECHAT.APP_ID.ERROR')
          }}</span>
        </label>
      </div>

      <div class="medium-8 columns">
        <label :class="{ error: $v.app_secret.$error }">
          {{ $t('INBOX_MGMT.ADD.WECHAT.APP_SECRET.LABEL') }}
          <input
            v-model.trim="app_secret"
            type="text"
            :placeholder="$t('INBOX_MGMT.ADD.WECHAT.APP_SECRET.PLACEHOLDER')"
            @blur="$v.app_secret.$touch"
          />
          <span v-if="$v.app_secret.$error" class="message">{{
            $t('INBOX_MGMT.ADD.WECHAT.APP_SECRET.ERROR')
          }}</span>
        </label>
      </div>

      <div class="medium-8 columns">
        <label :class="{ error: $v.open_id.$error }">
          {{ $t('INBOX_MGMT.ADD.WECHAT.OPEN_ID.LABEL') }}
          <input
            v-model.trim="open_id"
            type="text"
            :placeholder="$t('INBOX_MGMT.ADD.WECHAT.OPEN_ID.PLACEHOLDER')"
            @blur="$v.open_id.$touch"
          />
          <span v-if="$v.open_id.$error" class="message">{{
            $t('INBOX_MGMT.ADD.WECHAT.OPEN_ID.ERROR')
          }}</span>
        </label>
      </div>

      <div class="medium-12 columns">
        <woot-submit-button
          :loading="uiFlags.isCreating"
          :button-text="$t('INBOX_MGMT.ADD.WECHAT.SUBMIT_BUTTON')"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import alertMixin from 'shared/mixins/alertMixin';
import { required } from 'vuelidate/lib/validators';
import router from '../../../../index';
import PageHeader from '../../SettingsSubPageHeader';

export default {
  components: {
    PageHeader,
  },
  mixins: [alertMixin],
  data() {
    return {
      channelName: '',
      app_id: '',
      app_secret: '',
      open_id: '',
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'inboxes/getUIFlags',
    }),
  },
  validations: {
    channelName: { required },
    app_id: { required },
    app_secret: { required },
    open_id: { required },
  },
  methods: {
    async createChannel() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      try {
        const wechatChannel = await this.$store.dispatch(
          'inboxes/createChannel',
          {
            name: this.channelName,
            channel: {
              type: 'wechat',
              app_id: this.app_id,
              app_secret: this.app_secret,
              open_id: this.open_id,
            },
          }
        );

        router.replace({
          name: 'settings_inboxes_add_agents',
          params: {
            page: 'new',
            inbox_id: wechatChannel.id,
          },
        });
      } catch (error) {
        this.showAlert(this.$t('INBOX_MGMT.ADD.WECHAT.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>
