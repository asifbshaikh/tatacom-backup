<template>
  <div class="wizard-body height-auto small-9 columns">
    <page-header
      :header-title="$t('INBOX_MGMT.ADD.SMS.TITLE')"
      :header-content="$t('INBOX_MGMT.ADD.SMS.DESC')"
    />
    <div class="medium-8 columns">
      <label>
        {{ $t('INBOX_MGMT.ADD.SMS.PROVIDERS.LABEL') }}
        <select v-model="provider">
          <!-- <option value="twilio">
            {{ $t('INBOX_MGMT.ADD.SMS.PROVIDERS.TWILIO') }}
          </option>
          <option value="360dialog">
            {{ $t('INBOX_MGMT.ADD.SMS.PROVIDERS.BANDWIDTH') }}
          </option> -->
          <option value="tata">
            {{ $t('INBOX_MGMT.ADD.SMS.PROVIDERS.TATA') }}
          </option>
        </select>
      </label>
    </div>
    <twilio v-if="provider === 'twilio'" type="sms"></twilio>
    <tata v-if="provider === 'tata'" type="sms"></tata>
    <bandwidth-sms v-if="provider === '360dialog'" type="sms"></bandwidth-sms>
  </div>
</template>

<script>
import PageHeader from '../../SettingsSubPageHeader';
import BandwidthSms from './BandwidthSms.vue';
import Twilio from './Twilio.vue';
import Tata from './Tata.vue';

export default {
  components: {
    PageHeader,
    Twilio,
    Tata,
    BandwidthSms,
  },
  data() {
    return {
      provider: 'tata',
    };
  },
};
</script>
