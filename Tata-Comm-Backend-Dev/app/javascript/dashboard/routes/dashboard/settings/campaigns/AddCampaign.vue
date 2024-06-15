<template>
  <div class="column content-box">
    <!-- <woot-modal-header
      :header-title="$t('CAMPAIGN.ADD.TITLE')"
      :header-content="$t('CAMPAIGN.ADD.DESC')"
    /> -->
    <woot-modal-header
      :header-title="$t('CAMPAIGN.ADD.TITLE')"
    />
    <form class="row" @submit.prevent="addCampaign">
      <div class="medium-12 columns">
        <woot-input
          v-model="title"
          :label="$t('CAMPAIGN.ADD.FORM.TITLE.LABEL')"
          type="text"
          :class="{ error: $v.title.$error }"
          :error="$v.title.$error ? $t('CAMPAIGN.ADD.FORM.TITLE.ERROR') : ''"
          :placeholder="$t('CAMPAIGN.ADD.FORM.TITLE.PLACEHOLDER')"
          @blur="$v.title.$touch"
        />

        <label :class="{ error: $v.selectedChannel.$error }">
           {{ $t('CAMPAIGN.ADD.FORM.CHANNELLIST.LABEL') }}
           <select v-model="selectedChannel" @change="onChangeChannel($event)">
             <option v-for="item in channelList" :key="item.id" :value="item.id">
               {{ item.name }}
             </option>
           </select>
           <span v-if="$v.selectedChannel.$error" class="message">
             {{ $t('CAMPAIGN.ADD.FORM.CHANNELLIST.ERROR') }}
           </span>
        </label>

        <label :class="{ error: $v.selectedInbox.$error }">
          {{ $t('CAMPAIGN.ADD.FORM.INBOX.LABEL') }}
          <select v-model="selectedInbox" @change="onChangeInbox($event)">
            <option v-for="item in inboxes" :key="item.name" :value="item.id">
              {{ item.name }}
            </option>
          </select>
          <span v-if="$v.selectedInbox.$error" class="message">
            {{ $t('CAMPAIGN.ADD.FORM.INBOX.ERROR') }}
          </span>
        </label>

        <label v-if="isTemplateRequired">
          {{ $t('CAMPAIGN.ADD.FORM.TEMPLATELIST.LABEL') }}
          <select v-model="selectedTemplate" @change="onChangeTemplate($event)">
            <option v-for="item in templatesListGet" :key="item.name" :value="item.name">
              {{ item.info }}
            </option>
          </select>
        </label>

        <label v-if="isOngoingType" class="editor-wrap">
          {{ $t('CAMPAIGN.ADD.FORM.MESSAGE.LABEL') }}
          <woot-message-editor
            v-model="message"
            class="message-editor"
            :class="{ editor_warning: $v.message.$error }"
            :placeholder="$t('CAMPAIGN.ADD.FORM.MESSAGE.PLACEHOLDER')"
            @blur="$v.message.$touch"
          />
          <span v-if="$v.message.$error" class="editor-warning__message">
            {{ $t('CAMPAIGN.ADD.FORM.MESSAGE.ERROR') }}
          </span>
        </label>

        <label v-else :class="{ error: $v.message.$error }">
          {{ $t('CAMPAIGN.ADD.FORM.MESSAGE.LABEL') }}
          <textarea
            v-model="message"
            rows="5"
            type="text"
            :placeholder="$t('CAMPAIGN.ADD.FORM.MESSAGE.PLACEHOLDER')"
            @blur="$v.message.$touch"
          />
          <span v-if="$v.message.$error" class="message">
            {{ $t('CAMPAIGN.ADD.FORM.MESSAGE.ERROR') }}
          </span>
        </label>

        <div>
          <woot-button
          color-scheme="info"
          icon="upload"
          class="clear"
          @click="onToggleImport"
          >
            {{ $t('IMPORT_CONTACTS.BUTTON_LABEL') }}
          </woot-button>
        </div>

        <label
          v-if="isOnOffType"
          :class="{ error: $v.selectedAudience.$error }"
        >
          {{ $t('CAMPAIGN.ADD.FORM.AUDIENCE.LABEL') }}
          <multiselect
            v-model="selectedAudience"
            :options="audienceList"
            track-by="id"
            label="title"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :hide-selected="true"
            :placeholder="$t('CAMPAIGN.ADD.FORM.AUDIENCE.PLACEHOLDER')"
            selected-label
            :select-label="$t('FORMS.MULTISELECT.ENTER_TO_SELECT')"
            :deselect-label="$t('FORMS.MULTISELECT.ENTER_TO_REMOVE')"
            @input="selectedAudienceChange"
          />
          <span v-if="$v.selectedAudience.$error" class="message">
            {{ $t('CAMPAIGN.ADD.FORM.AUDIENCE.ERROR') }}
          </span>
        </label>

        <div v-if="templateParamsHas">
          <label>
            {{ $t('CAMPAIGN.ADD.FORM.VARIABLELIST.LABEL') }}
          </label>
          <div class="day-wrap">
            <campaign-variables
                v-for="variable in templateParamsGet"
                v-if="!['TEXT'].includes(variable.format)"
                :key="variable.key"
                :variable="variable"
                :contact-records="contactRecords"
                @update="data => onSlotUpdate(variable, data)"
              />
          </div>
        </div>

        <label
          v-if="isOngoingType"
          :class="{ error: $v.selectedSender.$error }"
        >
          {{ $t('CAMPAIGN.ADD.FORM.SENT_BY.LABEL') }}
          <select v-model="selectedSender">
            <option
              v-for="sender in sendersAndBotList"
              :key="sender.name"
              :value="sender.id"
            >
              {{ sender.name }}
            </option>
          </select>
          <span v-if="$v.selectedSender.$error" class="message">
            {{ $t('CAMPAIGN.ADD.FORM.SENT_BY.ERROR') }}
          </span>
        </label>

        <label v-if="isOnOffType">
          {{ $t('CAMPAIGN.ADD.FORM.SCHEDULED_AT.LABEL') }}
          <woot-date-time-picker
            :value="scheduledAt"
            :confirm-text="$t('CAMPAIGN.ADD.FORM.SCHEDULED_AT.CONFIRM')"
            :placeholder="$t('CAMPAIGN.ADD.FORM.SCHEDULED_AT.PLACEHOLDER')"
            @change="onChange"
          />
        </label>

        <woot-input
          v-if="isOngoingType"
          v-model="endPoint"
          :label="$t('CAMPAIGN.ADD.FORM.END_POINT.LABEL')"
          type="text"
          :class="{ error: $v.endPoint.$error }"
          :error="
            $v.endPoint.$error ? $t('CAMPAIGN.ADD.FORM.END_POINT.ERROR') : ''
          "
          :placeholder="$t('CAMPAIGN.ADD.FORM.END_POINT.PLACEHOLDER')"
          @blur="$v.endPoint.$touch"
        />
        <woot-input
          v-if="isOngoingType"
          v-model="timeOnPage"
          :label="$t('CAMPAIGN.ADD.FORM.TIME_ON_PAGE.LABEL')"
          type="text"
          :class="{ error: $v.timeOnPage.$error }"
          :error="
            $v.timeOnPage.$error
              ? $t('CAMPAIGN.ADD.FORM.TIME_ON_PAGE.ERROR')
              : ''
          "
          :placeholder="$t('CAMPAIGN.ADD.FORM.TIME_ON_PAGE.PLACEHOLDER')"
          @blur="$v.timeOnPage.$touch"
        />
        <label v-if="isOngoingType">
          <input
            v-model="enabled"
            type="checkbox"
            value="enabled"
            name="enabled"
          />
          {{ $t('CAMPAIGN.ADD.FORM.ENABLED') }}
        </label>
        <label v-if="isOngoingType">
          <input
            v-model="triggerOnlyDuringBusinessHours"
            type="checkbox"
            value="triggerOnlyDuringBusinessHours"
            name="triggerOnlyDuringBusinessHours"
          />
          {{ $t('CAMPAIGN.ADD.FORM.TRIGGER_ONLY_BUSINESS_HOURS') }}
        </label>
      </div>

      <div v-if="isTemplateRequired" class="help-text">
        <div v-html="termsLink"></div>
      </div>

      <div class="modal-footer">
        <woot-button :is-loading="uiFlags.isCreating">
          {{ $t('CAMPAIGN.ADD.CREATE_BUTTON_TEXT') }}
        </woot-button>
        <woot-button variant="clear" @click.prevent="onClose">
          {{ $t('CAMPAIGN.ADD.CANCEL_BUTTON_TEXT') }}
        </woot-button>
      </div>
    </form>
    <import-contacts :label-name="labelName" v-if="showImportModal" :on-close="onToggleImport" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required, url, minLength } from 'vuelidate/lib/validators';
import alertMixin from 'shared/mixins/alertMixin';
import WootMessageEditor from 'dashboard/components/widgets/WootWriter/Editor';
import campaignMixin from 'shared/mixins/campaignMixin';
import WootDateTimePicker from 'dashboard/components/ui/DateTimePicker.vue';
import CampaignVariables from './CampaignVariables';
import ImportContacts from './../../contacts/components/ImportContacts.vue';

export default {
  components: {
    WootDateTimePicker,
    WootMessageEditor,
    CampaignVariables,
    ImportContacts,
  },

  mixins: [alertMixin, campaignMixin],
  data() {
    let labelName = Math.round(+new Date()/1000)+"_label";
    return {
      title: '',
      message: '',
      selectedSender: 0,
      selectedInbox: null,
      selectedChannel: null,
      selectedTemplate: null,
      selectedTemplateInfo: {},
      endPoint: '',
      timeOnPage: 10,
      show: true,
      enabled: true,
      triggerOnlyDuringBusinessHours: false,
      scheduledAt: null,
      selectedAudience: [],
      senderList: [],
      templatesList: [],
      templateParams: [],
      showImportModal:false,
      labelName:labelName,
      templateRequiredFor: ['Channel::Whatsapp'],
      channelListOptions: [
        {
          id: "Channel::Whatsapp",//channel_type
          name: "WhatsApp",
        },
        {
          id: "Channel::Tata",
          name: "SMS",
        }
      ]
    };
  },

  validations() {
    const commonValidations = {
      title: {
        required,
      },
      message: {
        required,
      },
      selectedInbox: {
        required,
      },
      selectedChannel: {
        required,
      },
      // selectedTemplate: {
      //   required,
      // },
    };
    if (this.isOngoingType) {
      return {
        ...commonValidations,
        selectedSender: {
          required,
        },
        endPoint: {
          required,
          minLength: minLength(7),
          url,
        },
        timeOnPage: {
          required,
        },
      };
    }
    return {
      ...commonValidations,
      selectedAudience: {
        isEmpty() {
          return !!this.selectedAudience.length;
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'campaigns/getUIFlags',
      audienceList: 'labels/getLabels',
      contactRecords: 'contacts/getContacts',
    }),
    templateParamsHas() {
      return (this.templateParams.length > 0) && (this.contactRecords.length > 0) && (this.selectedAudience.length > 0);
    },
    templateParamsGet() {
      return [...this.templateParams];
    },
    inboxes() {
      if (this.isOngoingType) {
        return this.$store.getters['inboxes/getWebsiteInboxes'];
      }
      if(!this.selectedChannel) {
        return []; // if no channel selected, no inboxes can be selected
      }
      return this.$store.getters['inboxes/getSMSInboxes'](this.selectedChannel);
      // return this.$store.getters['inboxes/getSMSInboxes'];
    },
    sendersAndBotList() {
      return [
        {
          id: 0,
          name: 'Bot',
        },
        ...this.senderList,
      ];
    },
    channelList() {
      return this.channelListOptions;
    },
    templatesListGet() {
      return [
        ...this.templatesList,
      ];
    },
    termsLink() {
      return this.$t('CAMPAIGN.ADD.FORM.TERMS');
    },
    isTemplateRequired() {
      return this.isTemplateRequiredFunc();
    }
  },
  methods: {
    onClose() {
      this.$emit('on-close');
    },
    onChange(value) {
      this.scheduledAt = value;
    },
    selectedAudienceChange(value, id) {
      console.log({value, id}, this.selectedAudience)
      this.$v.selectedAudience.$touch();
      this.fetchContacts({labels: this.selectedAudience});
    },
    async onChangeInbox() {
      try {
        const response = await this.$store.dispatch('inboxMembers/get', {
          inboxId: this.selectedInbox,
        });
        const {
          data: { payload: inboxMembers },
        } = response;
        this.senderList = inboxMembers;

        await this.onChangeChannel()
      } catch (error) {
        const errorMessage =
          error?.response?.message || this.$t('CAMPAIGN.ADD.API.ERROR_MESSAGE');
        this.showAlert(errorMessage);
      }
    },
    async onChangeChannel() {
      if(!this.isTemplateRequiredFunc() || !this.selectedInbox) {
        this.templatesList = [];
        return true;
      }
      try {
        const response = await this.$store.dispatch('templates/get', {
          inboxId: this.selectedInbox,
        });
        this.templatesList = response.data.data.map(template => {
          let mediaType = '';
          template.components.map(component => {
            if(typeof component.format !== "undefined") {
              mediaType += ` [Media- ${component.format}]`;
            }
            if(typeof component.buttons !== "undefined") {
              mediaType += ` [Buttons]`;
            }
            if(component.type === "FOOTER") {
              mediaType += ` [Footer]`;
            }
            return component;
          })
          template.info = `${template.name}${mediaType}`;
          return template;
        });
      } catch (error) {
        const errorMessage =
          error?.response?.message || this.$t('CAMPAIGN.ADD.API.ERROR_MESSAGE');
        this.showAlert(errorMessage);
      }
    },
    onChangeTemplate() {
      let newMessage = '';
      const selectedTemplateData = this.templatesList.filter(item => this.selectedTemplate === item.name)
      this.selectedTemplateInfo = (selectedTemplateData && selectedTemplateData[0]) ? selectedTemplateData[0]: {};
      this.message = newMessage;
      this.getVariablesFromMessage((selectedTemplateData && selectedTemplateData[0]) ? selectedTemplateData[0]: null);
    },
    getCampaignDetails() {
      let campaignDetails = null;
      if (this.isOngoingType) {
        campaignDetails = {
          title: this.title,
          selected_channel: this.selectedChannel,
          selected_template: this.selectedTemplate,
          message: this.message,
          inbox_id: this.selectedInbox,
          sender_id: this.selectedSender || null,
          enabled: this.enabled,
          trigger_only_during_business_hours:
            // eslint-disable-next-line prettier/prettier
            this.triggerOnlyDuringBusinessHours,
          trigger_rules: {
            url: this.endPoint,
            time_on_page: this.timeOnPage,
          },
        };
      } else {
        const audience = this.selectedAudience.map(item => {
          return {
            id: item.id,
            title: item.title,
            type: 'Label',
          };
        });
        campaignDetails = {
          title: this.title,
          selected_channel: this.selectedChannel,
          selected_template: this.selectedTemplate,
          message: this.message,
          description: JSON.stringify({...this.selectedTemplateInfo, variablesInfo: this.templateParams}),
          inbox_id: this.selectedInbox,
          scheduled_at: this.scheduledAt,
          audience,
        };
      }
      return campaignDetails;
    },
    async addCampaign() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      if(this.showImportModal) {
        return;
      }
      try {
        const campaignDetails = this.getCampaignDetails();
        await this.$store.dispatch('campaigns/create', campaignDetails);
        this.showAlert(this.$t('CAMPAIGN.ADD.API.SUCCESS_MESSAGE'));
        this.onClose();
      } catch (error) {
        const errorMessage =
          error?.response?.message || this.$t('CAMPAIGN.ADD.API.ERROR_MESSAGE');
        this.showAlert(errorMessage);
      }
    },
    getVariablesFromMessage(selectedTemplateInfo) {
      this.templateParams = [];
      if(selectedTemplateInfo) {
        selectedTemplateInfo.components.map((component) => {
          if(component.type === "HEADER") {
            if(component.format === 'LOCATION') {
              ['name', 'address', 'latitude', 'longitude'].map(addressKey => {
                this.templateParams.push({type: component.type, format: component.format, key: addressKey});
              })
            } else if(component.format === 'TEXT') {
              // text has no variable, so add default text in array for later use
              this.templateParams.push({type: component.type, format: component.format, key: "text", value: component.text});
            } else {
              // image, audio, video, document
              this.templateParams.push({type: component.type, format: component.format, key: "link"});
            }
          } else if(component.type === "BODY") {
            const text = component.text;
            this.message = component.text;
            const result = text.match(/{{\w+}}/g);
            if(result) {
              result.map(res => {
                var resNew = res.replace(/{{|}}/g , '');
                this.templateParams.push({type: component.type, key: resNew});
                return resNew;
              });
            }
          } else if((component.type === "BUTTONS") && (typeof component.buttons === "object")) {
            component.buttons.map((buttonObj, buttonsParametersIndex) => {
              if(buttonObj.type === "URL") {
                const result = buttonObj.url.match(/{{\w+}}/g);
                if(result) {
                  result.map(res => {
                    var resNew = res.replace(/{{|}}/g , '');
                    this.templateParams.push({type: component.type, key: buttonsParametersIndex});
                    return resNew;
                  });
                }
                console.log(result)
              }
              return buttonObj
            });
          }
        });
      }
      console.log(this.message, this.templateParams)
      // use this info to a widget to print n times input box, ref: create inbox time
    },
    fetchContacts({labels}) {
      if (!labels || typeof labels[0] !== 'object') {
        return false;
      }
      const requestParams = {
        page: 1,
        sortAttr: 'name',
        label: labels[0].title,
        limit: 1,
      };
      this.$store.dispatch('contacts/get', requestParams);
    },
    onSlotUpdate(variable, data) {
      this.templateParams = this.templateParams.map(item => {
        if((item.key === variable.key) && (item.type === variable.type)) {
          item.val = data
        }
        return item;
      });
    },
    onToggleImport() {
      if(this.showImportModal) {
        console.log(this.showImportModal, this.selectedAudience, this.labelName)
        // prefill label and call get contacts api
        this.selectedAudience = [{title: this.labelName}];
        this.fetchContacts({labels: this.selectedAudience});
      }
      // assign a name to label 
      this.showImportModal = !this.showImportModal;
    },
    isTemplateRequiredFunc() {
      return this.templateRequiredFor.includes(this.selectedChannel)
    }
  },
};
</script>
<style lang="scss">
::v-deep .ProseMirror-woot-style {
  height: 8rem;
}
.day-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-small) 0;
  min-height: var(--space-larger);
  box-sizing: content-box;
  border-bottom: 1px solid var(--color-border-light);
}
.content-box .help-text a {
  padding: 0;
}
</style>
