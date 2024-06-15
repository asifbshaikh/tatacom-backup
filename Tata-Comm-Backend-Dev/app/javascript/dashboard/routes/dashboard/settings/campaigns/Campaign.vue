<template>
  <div class="column content-box">
    <campaigns-table
      :campaigns="campaigns"
      :show-empty-result="showEmptyResult"
      :is-loading="uiFlags.isFetching"
      :campaign-type="type"
      @on-edit-click="openEditPopup"
      @on-delete-click="openDeletePopup"
      @on-download-click="onDownloadClick"
    />
    <woot-modal :show.sync="showEditPopup" :on-close="hideEditPopup">
      <edit-campaign
        :selected-campaign="selectedCampaign"
        @on-close="hideEditPopup"
      />
    </woot-modal>
    <woot-delete-modal
      :show.sync="showDeleteConfirmationPopup"
      :on-close="closeDeletePopup"
      :on-confirm="confirmDeletion"
      :title="$t('CAMPAIGN.DELETE.CONFIRM.TITLE')"
      :message="$t('CAMPAIGN.DELETE.CONFIRM.MESSAGE')"
      :confirm-text="$t('CAMPAIGN.DELETE.CONFIRM.YES')"
      :reject-text="$t('CAMPAIGN.DELETE.CONFIRM.NO')"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import alertMixin from 'shared/mixins/alertMixin';
import campaignMixin from 'shared/mixins/campaignMixin';
import CampaignsTable from './CampaignsTable';
import EditCampaign from './EditCampaign';
export default {
  components: {
    CampaignsTable,
    EditCampaign,
  },
  mixins: [alertMixin, campaignMixin],
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showEditPopup: false,
      selectedCampaign: {},
      showDeleteConfirmationPopup: false,
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'campaigns/getUIFlags',
      labelList: 'labels/getLabels',
    }),
    campaigns() {
      return this.$store.getters['campaigns/getCampaigns'](this.campaignType);
    },
    showEmptyResult() {
      const hasEmptyResults =
        !this.uiFlags.isFetching && this.campaigns.length === 0;
      return hasEmptyResults;
    },
  },
  methods: {
    openEditPopup(response) {
      const { row: campaign } = response;
      this.selectedCampaign = campaign;
      this.showEditPopup = true;
    },
    hideEditPopup() {
      this.showEditPopup = false;
    },
    openDeletePopup(response) {
      this.showDeleteConfirmationPopup = true;
      this.selectedCampaign = response;
    },
    onDownloadClick(row) {
      const to = Math.round(+new Date()/1000);
      const fileName = `campaign-report-${row['row']['id']}-${format(
        fromUnixTime(to),
        'dd-MM-yyyy'
      )}.csv`;
      this.$store.dispatch('campaigns/downloadCampaignReports', { campaignId: row['row']['id'], to, fileName });
    },
    closeDeletePopup() {
      this.showDeleteConfirmationPopup = false;
    },
    confirmDeletion() {
      this.closeDeletePopup();
      const {
        row: { id },
      } = this.selectedCampaign;
      this.deleteCampaign(id);
    },
    async deleteCampaign(id) {
      try {
        await this.$store.dispatch('campaigns/delete', id);
        this.showAlert(this.$t('CAMPAIGN.DELETE.API.SUCCESS_MESSAGE'));
      } catch (error) {
        this.showAlert(this.$t('CAMPAIGN.DELETE.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>

<style scoped lang="scss">
.button-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-bottom: var(--space-one);
}

.content-box .page-top-bar::v-deep {
  padding: var(--space-large) var(--space-large) var(--space-zero);
}
</style>
