<template>
  <div class="wizard-body height-auto small-9 columns">
    <page-header
      :header-title="$t('INBOX_MGMT.ADD.WHATSAPP.TITLE')"
      :header-content="$t('INBOX_MGMT.ADD.WHATSAPP.DESC')"
    />
    <div class="medium-8 columns">
      <label>
        {{ $t('INBOX_MGMT.ADD.WHATSAPP.PROVIDERS.LABEL') }}
        <select v-model="provider">
          <!-- <option value="360dialog">
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.PROVIDERS.360_DIALOG') }}
          </option> -->
          <option value="tata-communications">
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.PROVIDERS.TATA_COMMUNICATIONS') }}
          </option>
        </select>
      </label>
    </div>

    <twilio v-if="provider === 'twilio'" type="whatsapp"></twilio>
    <tata-communications v-if="provider === 'tata-communications'" type="whatsapp"></tata-communications>
    <three-sixty-dialog-whatsapp v-if="provider === '360dialog'" type="whatsapp"></three-sixty-dialog-whatsapp>
  </div>
</template>

<script>
import PageHeader from '../../SettingsSubPageHeader';
import Twilio from './Twilio';
import TataCommunications from './TataCommunications';
import ThreeSixtyDialogWhatsapp from './360DialogWhatsapp';

export default {
  components: {
    PageHeader,
    Twilio,
    ThreeSixtyDialogWhatsapp,
    TataCommunications
  },
  data() {
    return {
      provider: 'tata-communications',
    };
  },
};
</script>
