<!-- Deprecated in favour of separate files for SMS and Whatsapp and also to implement new providers for each platform in the future-->
<template>
  <form class="row" @submit.prevent="createChannel()">
    <div class="medium-8 columns">
      <label :class="{ error: $v.channelName.$error }">
        {{ $t('INBOX_MGMT.ADD.TATA.CHANNEL_NAME.LABEL') }}
        <input
          v-model.trim="channelName"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.TATA.CHANNEL_NAME.PLACEHOLDER')"
          @blur="$v.channelName.$touch"
        />
        <span v-if="$v.channelName.$error" class="message">{{
          $t('INBOX_MGMT.ADD.TATA.CHANNEL_NAME.ERROR')
        }}</span>
      </label>
    </div>

    <div class="medium-8 columns">
      <label :class="{ error: $v.phoneNumber.$error }">
        {{ $t('INBOX_MGMT.ADD.TATA.PHONE_NUMBER.LABEL') }}
        <input
          v-model.trim="phoneNumber"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.TATA.PHONE_NUMBER.PLACEHOLDER')"
          @blur="$v.phoneNumber.$touch"
        />
        <span v-if="$v.phoneNumber.$error" class="message">{{
          $t('INBOX_MGMT.ADD.TATA.PHONE_NUMBER.ERROR')
        }}</span>
      </label>
    </div>

    <div class="medium-8 columns">
      <label :class="{ error: $v.app_id.$error }">
        {{ $t('INBOX_MGMT.ADD.TATA.APP_ID.LABEL') }}
        <input
          v-model.trim="app_id"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.TATA.APP_ID.PLACEHOLDER')"
          @blur="$v.app_id.$touch"
        />
        <span v-if="$v.app_id.$error" class="message">{{
          $t('INBOX_MGMT.ADD.TATA.APP_ID.ERROR')
        }}</span>
      </label>
    </div>
    <div class="medium-8 columns">
      <label :class="{ error: $v.ss_key.$error }">
        {{ $t('INBOX_MGMT.ADD.TATA.SS_KEY.LABEL') }}
        <input
          v-model.trim="ss_key"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.TATA.SS_KEY.PLACEHOLDER')"
          @blur="$v.ss_key.$touch"
        />
        <span v-if="$v.ss_key.$error" class="message">{{
          $t('INBOX_MGMT.ADD.TATA.SS_KEY.ERROR')
        }}</span>
      </label>
    </div>
    <div class="medium-8 columns">
      <label :class="{ error: $v.token.$error }">
        {{ $t('INBOX_MGMT.ADD.TATA.TOKEN.LABEL') }}
        <input
          v-model.trim="token"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.TATA.TOKEN.PLACEHOLDER')"
          @blur="$v.token.$touch"
        />
        <span v-if="$v.token.$error" class="message">{{
          $t('INBOX_MGMT.ADD.TATA.TOKEN.ERROR')
        }}</span>
      </label>
    </div>

    <div class="medium-12 columns">
      <woot-submit-button
        :loading="uiFlags.isCreating"
        :button-text="$t('INBOX_MGMT.ADD.TATA.SUBMIT_BUTTON')"
      />
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import alertMixin from 'shared/mixins/alertMixin';
import { required } from 'vuelidate/lib/validators';
import router from '../../../../index';

export default {
  mixins: [alertMixin],
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      app_id: '',
      ss_key: '',
      token: '',
      medium: this.type,
      channelName: '',
      phoneNumber: '',
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'inboxes/getUIFlags',
    }),
  },
  validations: {
    channelName: { required },
    phoneNumber: { required },
    app_id: { required },
    ss_key: { required },
    token: { required },
    medium: { required },
  },
  methods: {
    async createChannel() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      try {
        const tataChannel = await this.$store.dispatch(
          'inboxes/createTataChannel',
          {
            tata_channel: {
              name: this.channelName,
              medium: this.medium,
              app_id: this.app_id,
              ss_key: this.ss_key,
              token: this.token,
              phone_number: this.phoneNumber,
            },
          }
        );

        router.replace({
          name: 'settings_inboxes_add_agents',
          params: {
            page: 'new',
            inbox_id: tataChannel.id,
          },
        });
      } catch (error) {
        this.showAlert(this.$t('INBOX_MGMT.ADD.TATA.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>
