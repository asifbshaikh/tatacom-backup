<template>
  <div class="wizard-body small-9 columns">
    <page-header
      :header-title="$t('INBOX_MGMT.ADD.VIBER.TITLE')"
      :header-content="$t('INBOX_MGMT.ADD.VIBER.DESC')"
    />
    <form class="row" @submit.prevent="createChannel()">
      <div class="medium-8 columns">
        <label :class="{ error: $v.channelName.$error }">
          {{ $t('INBOX_MGMT.ADD.VIBER.CHANNEL_NAME.LABEL') }}
          <input
            v-model.trim="channelName"
            type="text"
            :placeholder="$t('INBOX_MGMT.ADD.VIBER.CHANNEL_NAME.PLACEHOLDER')"
            @blur="$v.channelName.$touch"
          />
          <span v-if="$v.channelName.$error" class="message">{{
            $t('INBOX_MGMT.ADD.VIBER.CHANNEL_NAME.ERROR')
          }}</span>
        </label>
      </div>

      <div class="medium-8 columns">
        <label :class="{ error: $v.channelType.$error }">
          {{ $t('INBOX_MGMT.ADD.VIBER.CHANNEL_TYPE.LABEL') }}
          <select v-model="channelType">
            <option value="promotion">promotion</option>
            <option value="transaction">transaction</option>
          </select>
          <span v-if="$v.channelType.$error" class="message">{{
            $t('INBOX_MGMT.ADD.VIBER.CHANNEL_TYPE.ERROR')
          }}</span>
        </label>
      </div>

      <div class="medium-8 columns">
        <label :class="{ error: $v.serviceId.$error }">
          {{ $t('INBOX_MGMT.ADD.VIBER.SERVICE_ID.LABEL') }}
          <input
            v-model.trim="serviceId"
            type="text"
            :placeholder="$t('INBOX_MGMT.ADD.VIBER.SERVICE_ID.PLACEHOLDER')"
            @blur="$v.serviceId.$touch"
          />
          <span v-if="$v.serviceId.$error" class="message">{{
            $t('INBOX_MGMT.ADD.VIBER.SERVICE_ID.ERROR')
          }}</span>
        </label>
      </div>

      <div class="medium-12 columns">
        <woot-submit-button
          :loading="uiFlags.isCreating"
          :button-text="$t('INBOX_MGMT.ADD.VIBER.SUBMIT_BUTTON')"
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
      serviceId: '',
      channelType: '',
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'inboxes/getUIFlags',
    }),
  },
  validations: {
    channelName: { required },
    channelType: { required },
    serviceId: { required },
  },
  methods: {
    async createChannel() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      try {
        const viberChannel = await this.$store.dispatch(
          'inboxes/createChannel',
          {
            name: this.channelName,
            channel: {
              type: 'viber',
              service_id: this.serviceId,
              channel_type: this.channelType,
            },
          }
        );

        router.replace({
          name: 'settings_inboxes_add_agents',
          params: {
            page: 'new',
            inbox_id: viberChannel.id,
          },
        });
      } catch (error) {
        this.showAlert(this.$t('INBOX_MGMT.ADD.VIBER.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>
