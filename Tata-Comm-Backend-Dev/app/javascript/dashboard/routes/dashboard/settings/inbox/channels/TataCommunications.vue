<template>
  <form class="row" @submit.prevent="createChannel()">
    <div class="medium-8 columns">
      <label :class="{ error: $v.inboxName.$error }">
        {{ $t('INBOX_MGMT.ADD.WHATSAPP.INBOX_NAME.LABEL') }}
        <input
          v-model.trim="inboxName"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.INBOX_NAME.PLACEHOLDER')"
          @blur="$v.inboxName.$touch"
        />
        <span v-if="$v.inboxName.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.INBOX_NAME.ERROR') }}
        </span>
      </label>
    </div>

    <div class="medium-8 columns">
      <label :class="{ error: $v.phoneNumber.$error }">
        {{ $t('INBOX_MGMT.ADD.WHATSAPP.PHONE_NUMBER.LABEL') }}
        <input
          v-model.trim="phoneNumber"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.PHONE_NUMBER.PLACEHOLDER')"
          @blur="$v.phoneNumber.$touch"
        />
        <span v-if="$v.phoneNumber.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.PHONE_NUMBER.ERROR') }}
        </span>
      </label>
    </div>

    <div class="medium-8 columns">
      <label :class="{ error: $v.phone_number_id.$error }">
        <span>
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.PHONE_NUMBER_ID.LABEL') }}
          <a
            v-if="globalConfig.installationName === 'Tring'"
          >
            ({{ $t('INBOX_MGMT.ADD.WHATSAPP.PHONE_NUMBER_ID.APPLY_FOR_ACCESS') }})
          </a>
        </span>
        <input
          v-model.trim="phone_number_id"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.PHONE_NUMBER_ID.PLACEHOLDER')"
          @blur="$v.phone_number_id.$touch"
        />
        <span v-if="$v.phone_number_id.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.PHONE_NUMBER_ID.ERROR') }}
        </span>
      </label>
    </div>

    <div class="medium-8 columns">
      <label :class="{ error: $v.apiKey.$error }">
        <span>
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.LABEL_TATA_COMMUNICATIONS') }}
          <a
            v-if="globalConfig.installationName === 'Tring'"
          >
            ({{ $t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.APPLY_FOR_ACCESS_TATA') }})
          </a>
        </span>
        <input
          v-model.trim="apiKey"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.PLACEHOLDER_TATA_COMMUNICATIONS')"
          @blur="$v.apiKey.$touch"
        />
        <span v-if="$v.apiKey.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.ERROR') }}
        </span>
      </label>
    </div>

    <div class="medium-8 columns">
      <label :class="{ error: $v.wabaId.$error }">
        {{ $t('INBOX_MGMT.ADD.WHATSAPP.WABA_ID.LABEL') }}
        <input
          v-model.trim="wabaId"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.WABA_ID.PLACEHOLDER')"
          @blur="$v.wabaId.$touch"
        />
        <span v-if="$v.wabaId.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.WABA_ID.ERROR') }}
        </span>
      </label>
    </div>

    <div class="medium-8 columns">
      <!-- <label :class="{ error: $v.authKey.$error }"> -->
      <label>
        {{ $t('INBOX_MGMT.ADD.WHATSAPP.AUTH_KEY.LABEL') }}
        <input
          v-model.trim="authKey"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.AUTH_KEY.PLACEHOLDER')"
        />
        <!-- <input
          v-model.trim="authKey"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.AUTH_KEY.PLACEHOLDER')"
          @blur="$v.authKey.$touch"
        /> -->
        <!-- <span v-if="$v.authKey.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.AUTH_KEY.ERROR') }}
        </span> -->
      </label>
    </div>

    <div class="medium-12 columns">
      <woot-submit-button
        :loading="uiFlags.isCreating"
        :button-text="$t('INBOX_MGMT.ADD.WHATSAPP.SUBMIT_BUTTON')"
      />
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import alertMixin from 'shared/mixins/alertMixin';
import { required } from 'vuelidate/lib/validators';
import router from '../../../../index';

const shouldStartWithPlusSign = (value = '') => value.startsWith('+');

export default {
  mixins: [alertMixin],
  data() {
    return {
      inboxName: '',
      phoneNumber: '',
      apiKey: '',
      authKey: '',
      wabaId: '',
      phone_number_id: ''
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'inboxes/getUIFlags',
      globalConfig: 'globalConfig/get',
    }),
  },
  validations: {
    inboxName: { required },
    phoneNumber: { required, shouldStartWithPlusSign },
    apiKey: { required },
    // authKey: { required },
    wabaId: { required },
    phone_number_id: { required },
  },
  methods: {
    async createChannel() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      try {
        const whatsappChannel = await this.$store.dispatch(
          'inboxes/createTataCommunicationsWhatsappChannel',
          {
            name: this.inboxName,
            channel: {
              type: 'whatsapp_tata_communications',
              phone_number: this.phoneNumber,
              provider: "TATA Communications",
              provider_config: {
                api_key: this.apiKey,
                auth_key: this.authKey,
                waba_id: this.wabaId,
                phone_number_id: this.phone_number_id
              },
            },
          }
        );
         router.replace({
          name: 'settings_inboxes_add_agents',
          params: {
            page: 'new',
            inbox_id: whatsappChannel.id,
          },
        });
      } catch (error) {
        this.showAlert(this.$t('INBOX_MGMT.ADD.WHATSAPP.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>
