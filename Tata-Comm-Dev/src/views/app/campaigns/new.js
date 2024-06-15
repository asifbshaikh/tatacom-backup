import React, { createRef, useEffect, useState } from 'react';
import { Step, Steps, Wizard } from 'react-albus';
import { injectIntl } from 'react-intl';
import CustomTopNavigation from 'components/wizard/CustomTopNavigation';
import { Card, Row, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import moment from 'moment';
import {
  checkType,
  getCurrentGMTTimeZone,
  getSendType,
} from 'helpers/campaignHelper';
import {
  generateTinyUrlClean,
  getCampaignInfoById,
  scheduleSmsCampaignClean,
  smsCampaignSaveAsDraft,
  smsCampaignSaveAsDraftClean,
  updateStepIndex,
} from 'redux/campaigns/actions';
import { NotificationManager } from 'components/common/react-notifications';
import { getCampaignInfo } from 'redux/dashboard-campaigns/actions';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import CampaignRoutesEnums from 'enums/campaigns/campaignRoutesEnums';
import CommonEnums from 'enums/commonEnums';
import ScheduleAndGoalsContainer from 'containers/campaigns/schedule-campaigns/ScheduleAndGoalsContainer';
import ContentCampaign from 'containers/campaigns/ContentCampaign';
import SelectTargetAudience from '../../../containers/campaigns/SelectTargetAudience';
import CreateCampaignHeading from '../../../containers/campaigns/CreateCampaignHeading';
import SelectChannelType from '../../../containers/campaigns/SelectChannelType';
import SelectCampaignType from '../../../containers/campaigns/SelectCampaignType';
import { smsCampaignSteps } from 'constants/CampaignStepperConstants';
import { adminRoot } from 'constants/defaultValues';
import { useHistory } from 'react-router-dom';
import { getQueryList, userCountFilter } from 'redux/segmentation/actions';
import {
  isExcludeUserSelected,
  removeEmptyPropertyFromJson,
} from 'data/segments/createSegmentFilterData';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import ConversationEnums from 'enums/conversations/conversationEnums';

const CreateCampaignForm = ({
  match,
  channelType,
  campaignName,
  campaignType,
  loading,
  campaignClean,
  smsCampaignSaveAsDraftAction,
  audience,
  stepIndex,
  contentConfiguration,
  saveSuccess,
  saveError,
  saveAsDraftResponse,
  formEmailCreation,
  selectAudience,
  segmentId,
  queryId,
  campaignContentType,
  lastExecutedFilterId,
  emailTemplate,
  inboxId,
  channelId,
  channelTypes,
  updateStepIndexAction,
  convertedTinyUrls,
  convertedPersonalizedMsg,
  getCampaignInfoData,
  getDashboardCampaignInfo,
  campaignInfo,
  getQueryResult,
  listQueryResult,
  userCountFilterMethod,
  whatsAppTemplateCategory,
  generateTinyUrlCleanAction,
}) => {
  const [forms, setForms] = useState([]);
  const [invalidPayload, setInvalidPayload] = useState(false);
  const { campaignID } = useParams();
  const [reschedule, setIsReschedule] = useState(false);
  const history = useHistory();
  const regexForbigUrls = /\b(?:https?:\/\/|www\.)\S+\b/gi;

  useEffect(() => {
    const formRefs = smsCampaignSteps.map(() => createRef(null));
    setForms(formRefs);
    const path = match.path.substr(1);
    let paths = path.split('/');
    if (campaignID && paths.includes(DashboardEnums.RESCHEDULE_PATH)) {
      setIsReschedule(true);
    }
    if (!campaignID) {
      campaignClean();
      updateStepIndexAction(0);
    }
  }, [campaignID]);

  const topNavClick = (steps, currentStep, stepClicked, push) => {
    const currentStepIndex = steps.indexOf(currentStep);
    const currentForm = forms[currentStepIndex]?.current;
    const stepClickedIndex = steps.indexOf(stepClicked);
    if (currentForm) {
      if (stepClickedIndex > currentStepIndex) {
        currentForm.handleSubmit();
      } else if (stepClickedIndex < currentStepIndex) {
        updateStepIndexAction(stepClickedIndex);
        push(stepClicked.id);
      }
    }
  };

  const createSchedulerObj = (selectedCampaignType, values) => {
    let campaignScheduler = {};
    if (
      values[campaignType].sendCampaignType ===
      ScheduleAndGoalsEnums.IMMEDIATELY
    ) {
      campaignScheduler = {
        campaign_time_zone: `${getCurrentGMTTimeZone(
          values.campaignTimeZone
        )} ${values.campaignTimeZone}`,
        campaign_type: selectAudience.campaignType,
        schedule_type: ScheduleAndGoalsEnums.AS_SOON_AS_POSSIBLE,
        schedule_time: moment().unix(),
        start_date: moment().unix(),
      };
    } else if (
      [
        ScheduleAndGoalsEnums.DAILY,
        ScheduleAndGoalsEnums.MONTHLY,
        ScheduleAndGoalsEnums.WEEKLY,
        ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME,
      ].includes(values[campaignType].sendCampaignType)
    ) {
      const scheduleTime =
        values[campaignType][getSendType(values, selectedCampaignType)]
          .sendTime;
      const scheduleDate =
        values[campaignType][getSendType(values, selectedCampaignType)]
          .startDate;
      const endsOn =
        values[campaignType][getSendType(values, selectedCampaignType)].ends ===
        ScheduleAndGoalsEnums.ON
          ? values[campaignType][getSendType(values, selectedCampaignType)].on
              .endDate
          : '';
      const isAtSpecificTime = Boolean(
        values[campaignType].sendCampaignType ===
          ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
      );

      campaignScheduler = {
        campaign_type: 0,
        schedule_type:
          values[campaignType].sendCampaignType ===
          ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME
            ? 'at_specific_time'
            : values.campaignType,
        campaign_time_zone: `${getCurrentGMTTimeZone(
          values.campaignTimeZone
        )} ${values.campaignTimeZone}`,
        send_campaign_time: values[campaignType].sendCampaignTime,
        scheduling_frequency: isAtSpecificTime
          ? ''
          : values[campaignType].sendCampaignType,
        start_date: moment(`${scheduleDate} ${scheduleTime}`).unix(),
        end_date: endsOn ? moment(`${endsOn} ${scheduleTime}`).unix() : '',
        repeat_every: values[campaignType].repeatEvery,
        send_if_user_timezone_expired:
          values[campaignType][getSendType(values, selectedCampaignType)]
            .sendUserTimeZonePassed,
        occurrences: isAtSpecificTime
          ? null
          : Number(
              values[campaignType][getSendType(values, selectedCampaignType)]
                .after.occurrences
            ),
        on_best_time:
          values[campaignType][getSendType(values, selectedCampaignType)]
            .userBestTimeOutsideTimeWindow,
        best_time_for_user:
          values[campaignType][getSendType(values, selectedCampaignType)]
            .sendMessagesBasedOnBestTime,
        alternate_timezone:
          values[campaignType][getSendType(values, selectedCampaignType)]
            .userBestTimeNotAvailable,
        repeat_on_day_of_week: isAtSpecificTime
          ? ''
          : values[campaignType].daysOfWeek,
        repeat_on_day_of_month: isAtSpecificTime
          ? ''
          : values[campaignType].daysOfMonth,
      };
    } else if (campaignType === ScheduleAndGoalsEnums.EVENT_TRIGGERED) {
      campaignScheduler = {
        campaign_time_zone: `${getCurrentGMTTimeZone(
          values.campaignTimeZone
        )} ${values.campaignTimeZone}`,
        start_date: moment(
          `${values[campaignType].startDate} ${values[campaignType].sendTime}`
        ).unix(),
        end_date: moment(
          `${values[campaignType].endDate} ${values[campaignType].endTime}`
        ).unix(),
        trigger_relation: values?.event_trigger?.time_multiplier,
        trigger_attr: values?.event_trigger?.trigger_attr,
        time_value: values?.event_trigger?.time_value,
        time_multiplier: values?.event_trigger?.time_multiplier,
      };
    } else {
      campaignScheduler = {
        campaign_type: selectedCampaignType,
        schedule_type: values[campaignType].sendCampaignType,
        schedule_date: moment(values[campaignType].sendDate).unix(),
      };
    }

    return campaignScheduler;
  };

  const createEmailCampaignPayload = (values) => {
    const selectedCampaignType = CommonEnums[channelType.toUpperCase()];
    const payload = {};
    payload.campaign = {
      type: selectedCampaignType,
      exclude_users: values?.exclude_users ?? selectAudience.exclude_users,
      title: campaignName,
      inbox_id: inboxId,
      channel_id: channelId,
      channel_type: channelTypes,
      campaign_state: stepIndex,
      scheduling_type: values?.campaignType ?? selectAudience.campaignType,
      campaign_global_control_group_attributes: {
        active: false,
      },
    };
    if (stepIndex === 2) {
      payload.campaign = {
        ...payload.campaign,
        select_audience: values.audience_type,
        campaign_content_type: values.campaignContentType,
        selected_contact_attribute: values.selectedUserAttribute,
      };
      let showCountPayload = '';
      if (values?.segmentId && values?.segmentName) {
        showCountPayload = {
          segment_id: values?.segmentId,
          segment_name: values?.segmentName,
          excluded_filters: values.exclude_users
            ? removeEmptyPropertyFromJson(values.excluded_filters)
            : {},
        };
      } else {
        showCountPayload = isExcludeUserSelected({
          audience_type: values?.audience_type,
          exclude_users: values?.exclude_users,
          included_filters: values?.included_filters,
          excluded_filters: values?.excluded_filters,
        });
      }
      payload.segment_filters = showCountPayload;
    }
    if (stepIndex > 2) {
      payload.campaign = {
        ...payload.campaign,
        select_audience: selectAudience.audience_type,
        campaign_content_type: campaignContentType,
        selected_contact_attribute: selectAudience.selectedUserAttribute,
      };
    }
    if (stepIndex >= 3) {
      payload.campaign = {
        ...payload.campaign,
        channel_id: formEmailCreation.emailConnector,
        selected_contact_attribute: selectAudience.selectedUserAttribute,
      };
      if (emailTemplate && emailTemplate.id) {
        payload.campaign.email_template_id = emailTemplate.id;
      }
      payload.campaign_detail = {
        subject: formEmailCreation.subject,
        sender_name: formEmailCreation.senderName,
        from_email_address: formEmailCreation.fromEmailAddress,
        reply_to_email_address: formEmailCreation.replyToEmailAddress,
        cc_email_address: formEmailCreation?.cc
          ? formEmailCreation.cc.split(',')
          : [],
        bcc_email_address: formEmailCreation?.bcc
          ? formEmailCreation.bcc.split(',')
          : [],
        channel_email_id: formEmailCreation.emailConnector,
      };
    }

    if (stepIndex === 4) {
      payload.campaign_scheduler = createSchedulerObj(
        selectAudience.campaignType,
        values
      );
    }

    if (values?.triggerCriteria?.included_filters !== undefined) {
      payload.included_filters = values.triggerCriteria.included_filters;
    } else if (
      selectAudience?.triggerCriteria?.included_filters !== undefined
    ) {
      payload.included_filters =
        selectAudience.triggerCriteria.included_filters;
    }

    if (stepIndex !== 4) {
      if (campaignType === ScheduleAndGoalsEnums.EVENT_TRIGGERED) {
        payload.campaign_scheduler = {
          time_multiplier:
            values?.triggerCriteria?.time_multiplier ??
            selectAudience?.triggerCriteria?.time_multiplier,
          time_value:
            values?.triggerCriteria?.time_value ??
            selectAudience?.triggerCriteria?.time_value,
          ...((values?.triggerCriteria?.trigger_message_type ===
            TargetAudienceEnums.WITH_DELAY ||
            selectAudience?.triggerCriteria?.trigger_message_type ===
              TargetAudienceEnums.WITH_DELAY) && {
            trigger_attr:
              values?.triggerCriteria?.trigger_attr ??
              selectAudience?.triggerCriteria?.trigger_attr,
          }),
          ...((values?.triggerCriteria?.trigger_message_type ===
            TargetAudienceEnums.WITH_DELAY ||
            selectAudience?.triggerCriteria?.trigger_message_type ===
              TargetAudienceEnums.WITH_DELAY) && {
            trigger_relation:
              values?.triggerCriteria?.trigger_relation ??
              selectAudience?.triggerCriteria?.trigger_relation,
          }),
        };
      }
    }

    if (selectAudience?.segmentId) {
      payload.segment = {
        segment_id: selectAudience?.segmentId,
      };
    } else if (
      selectAudience?.queryId ||
      selectAudience?.draftSegmentId ||
      lastExecutedFilterId
    ) {
      payload.segment = {
        segment_filter_id:
          selectAudience?.queryId ||
          lastExecutedFilterId ||
          selectAudience?.draftSegmentId,
      };
    } else {
      payload.segment = {
        segment_filter_id: listQueryResult[0]?.id,
      };
    }
    return payload;
  };

  const handleSaveasDraft = () => {
    let { values = null } = forms[stepIndex]?.current
      ? forms[stepIndex].current
      : {};
    const selectedCampaignType = CommonEnums[channelType.toUpperCase()];
    let showCountPayload = {};
    let payload = {};
    if (stepIndex === 2) {
      if (values?.segmentId && values?.segmentName) {
        showCountPayload = {
          segment_id: values?.segmentId,
          segment_name: values?.segmentName,
          excluded_filters: values.exclude_users
            ? removeEmptyPropertyFromJson(values.excluded_filters)
            : {},
        };
      } else {
        showCountPayload = isExcludeUserSelected({
          audience_type: values?.audience_type,
          exclude_users: values?.exclude_users,
          included_filters: values?.included_filters,
          excluded_filters: values?.excluded_filters,
        });
      }
      payload.segment_filters = showCountPayload;
    }

    if (values) {
      if (selectedCampaignType === CommonEnums.EMAIL) {
        payload = createEmailCampaignPayload(values);
      } else {
        payload.campaign = {
          type: ScheduleAndGoalsEnums[
            (values?.campaignType ?? channelType).toUpperCase()
          ],
          title: campaignName ?? values.campaignName,
          message: values?.message ?? contentConfiguration?.actualMessage ?? '',
          select_audience:
            values?.audience_type ?? selectAudience?.audience_type,
          exclude_users: values?.exclude_users ?? selectAudience.exclude_users,
          send_campaign_to_the_opted_out_users:
            values?.smsOptout ?? contentConfiguration?.smsOptout,
          sender_id: values?.smsSender ?? contentConfiguration?.smsSender,
          template_id: values?.templateId ?? contentConfiguration?.templateId,
          template_record_id:
            values?.templateRecordId ?? contentConfiguration?.templateRecordId,
          inbox_id: inboxId ?? '',
          channel_id: channelId ?? '',
          channel_type: channelTypes ?? '',
          campaign_state: stepIndex,
          scheduling_type: values?.campaignType ?? selectAudience.campaignType,
          selected_contact_attribute:
            values?.selectedUserAttribute ??
            selectAudience?.selectedUserAttribute,
          campaign_global_control_group_attributes: {
            active: false,
          },
        };

        if (values?.triggerCriteria?.included_filters !== undefined) {
          payload.included_filters = values.triggerCriteria.included_filters;
        } else if (
          selectAudience?.triggerCriteria?.included_filters !== undefined
        ) {
          payload.included_filters =
            selectAudience.triggerCriteria.included_filters;
        }
        if (campaignType === ScheduleAndGoalsEnums.EVENT_TRIGGERED) {
          payload.campaign_scheduler = {
            time_multiplier:
              values?.triggerCriteria?.time_multiplier ??
              selectAudience?.triggerCriteria?.time_multiplier,
            time_value:
              values?.triggerCriteria?.time_value ??
              selectAudience?.triggerCriteria?.time_value,
            ...((values?.triggerCriteria?.trigger_message_type ===
              TargetAudienceEnums.WITH_DELAY ||
              selectAudience?.triggerCriteria?.trigger_message_type ===
                TargetAudienceEnums.WITH_DELAY) && {
              trigger_attr:
                values?.triggerCriteria?.trigger_attr ??
                selectAudience?.triggerCriteria?.trigger_attr,
            }),
            ...((values?.triggerCriteria?.trigger_message_type ===
              TargetAudienceEnums.WITH_DELAY ||
              selectAudience?.triggerCriteria?.trigger_message_type ===
                TargetAudienceEnums.WITH_DELAY) && {
              trigger_relation:
                values?.triggerCriteria?.trigger_relation ??
                selectAudience?.triggerCriteria?.trigger_relation,
            }),
          };
        }

        if (selectAudience.channelType === CommonEnums.SMS) {
          payload.campaign.tiny_url = contentConfiguration.tinyUrlConversion;
          payload.campaign.tiny_urls = convertedTinyUrls?.length
            ? convertedTinyUrls.map((url) => url.tinyUrl)
            : [];
          payload.campaign.sender_id =
            values?.smsSender ?? contentConfiguration?.smsSender;
          payload.campaign.template_id =
            values?.templateId ?? contentConfiguration.templateId;
          payload.campaign.template_record_id =
            values?.templateRecordId ?? contentConfiguration.templateRecordId;
          payload.campaign.personalise_mapping_attribute =
            convertedPersonalizedMsg?.personalize_message?.length
              ? convertedPersonalizedMsg.personalise_mapping_attribute
              : {};
          payload.campaign.personalize = values?.personalize;
          payload.campaign.tiny_url_conversion = values?.tinyUrlConversion;
          payload.campaign.test_user_attribute = values?.testUserAttribute;
          payload.campaign.test_user_value = values?.testUserValue;
          payload.campaign.message =
            values?.message ?? contentConfiguration?.actualMessage ?? '';
          const messageToMatch =
            values?.message || contentConfiguration?.message || '';
          const bigUrls = messageToMatch?.match(regexForbigUrls) || '';
          payload.campaign.big_urls = bigUrls;
        }

        if (selectAudience.channelType === CommonEnums.WHATSAPP) {
          payload.campaign.phone_number =
            values?.smsSender ?? contentConfiguration?.smsSender;
          payload.campaign.message =
            values?.templateRecordId ?? contentConfiguration?.templateRecordId;

          if (
            convertedPersonalizedMsg?.personalize_message?.length &&
            whatsAppTemplateCategory === ContentConfigurationEnums.WITH_MEDIA
          ) {
            payload.campaign.personalise_mapping_attribute = {
              ...convertedPersonalizedMsg.personalise_mapping_attribute,
              media_attribute: {
                type: ConversationEnums.HEADER,
                parameters: [
                  {
                    type:
                      checkType(values?.mediaLink) ??
                      checkType(contentConfiguration?.mediaLink),
                    [checkType(values?.mediaLink) ??
                    checkType(contentConfiguration?.mediaLink)]: {
                      link: values?.mediaLink ?? contentConfiguration.mediaLink,
                    },
                  },
                ],
              },
            };
          } else if (convertedPersonalizedMsg?.personalize_message?.length) {
            payload.campaign.personalise_mapping_attribute =
              convertedPersonalizedMsg.personalise_mapping_attribute;
          } else if (
            whatsAppTemplateCategory === ContentConfigurationEnums.WITH_MEDIA
          ) {
            payload.campaign.personalise_mapping_attribute = {
              media_attribute: {
                type: ConversationEnums.HEADER,
                parameters: [
                  {
                    type:
                      checkType(values?.mediaLink) ??
                      checkType(contentConfiguration?.mediaLink),
                    [checkType(values?.mediaLink) ??
                    checkType(contentConfiguration?.mediaLink)]: {
                      link: values?.mediaLink ?? contentConfiguration.mediaLink,
                    },
                  },
                ],
              },
            };
          } else {
            payload.campaign.personalise_mapping_attribute = {};
          }
        }

        if (stepIndex === 4) {
          payload.campaign_scheduler = createSchedulerObj(
            selectAudience.campaignType,
            values
          );
        }
        if (selectAudience?.segmentId) {
          payload.segment = {
            segment_id: selectAudience.segmentId,
          };
        } else if (
          selectAudience?.queryId ||
          lastExecutedFilterId ||
          selectAudience?.draftSegmentId
        ) {
          payload.segment = {
            segment_filter_id:
              selectAudience?.queryId ||
              lastExecutedFilterId ||
              selectAudience?.draftSegmentId,
          };
        } else {
          payload.segment = {
            segment_filter_id: listQueryResult[0]?.id,
          };
        }
      }

      if (
        saveAsDraftResponse?.id ??
        saveAsDraftResponse?.campaign?.id ??
        saveAsDraftResponse?.campaign_info?.id
      ) {
        payload.campaign.type =
          ScheduleAndGoalsEnums[channelType?.toUpperCase()];
        payload.campaign.id =
          saveAsDraftResponse?.id ??
          saveAsDraftResponse?.campaign?.id ??
          saveAsDraftResponse?.campaign_info?.id ??
          '';
        smsCampaignSaveAsDraftAction({ payload, id: payload.campaign.id });
      } else {
        payload.campaign.type =
          ScheduleAndGoalsEnums[channelType?.toUpperCase()];
        payload.campaign.id = '';
        smsCampaignSaveAsDraftAction({ payload });
      }
    } else {
      setInvalidPayload(true);
    }
  };

  useEffect(() => {
    if (saveSuccess) {
      const successMsg =
        'CAMPAIGN.CREATE_CAMPAIGN.SAVE_DRAFT.API.SUCCESS_MESSAGE';
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null
      );
      history.push(`${adminRoot}/dashboards/all-campaigns`);
    }
  }, [saveSuccess]);

  useEffect(() => {
    if (saveError && saveError.errorMsg) {
      NotificationManager.error(
        <IntlMessages id={saveError.errorMsg} />,
        'Error',
        6000,
        null,
        null,
        ''
      );
    }
  }, [saveError]);

  useEffect(() => {
    if (invalidPayload) {
      NotificationManager.error(
        <IntlMessages id="Invalid stepIndex/payload" />,
        'Error',
        6000,
        null,
        null,
        ''
      );
    }
    setInvalidPayload(false);
  }, [invalidPayload]);

  const enableSaveAsDraftButton = () => {
    return !campaignName;
  };
  useEffect(() => {
    if (campaignID) {
      const payload = {
        campaignID,
        type: 'Info',
      };
      getCampaignInfoData(payload);
    }

    return () => {
      setIsReschedule(false);
      campaignClean();
      generateTinyUrlCleanAction();
    };
  }, [campaignID]);

  return (
    <Row>
      <Colxx xxs="12" className="mb-5">
        <CreateCampaignHeading
          match={match}
          addLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.SAVE_AS_DRAFT"
          campaignName={campaignName}
          handleBtnClick={handleSaveasDraft}
          heading="menu.create-campaign"
          channelType={channelType}
          campaignType={campaignType}
          enableSaveAsDraftButton={enableSaveAsDraftButton}
        />
      </Colxx>
      <Colxx xxs="12">
        <Card className="pt-3 pb-3 pl-4 pr-4 wizard wizard-default">
          <Wizard>
            <CustomTopNavigation
              className="justify-content-center"
              topNavClick={topNavClick}
            />
            {loading && (
              <div>
                <Spinner color="primary" className="mb-1" />
              </div>
            )}

            <Steps>
              {smsCampaignSteps.map((CampaignStep, index) => {
                const commonparms = {
                  formRef: forms[index],
                  channelType: channelType,
                  campaignType: campaignType,
                  reschedule: reschedule,
                };
                return (
                  <Step
                    key={CampaignStep.route}
                    id={CampaignStep.route}
                    name={CampaignStep.name}
                  >
                    {({ next, previous, push, steps }) => {
                      commonparms.next = next;
                      commonparms.previous = previous;
                      commonparms.push = push;
                      commonparms.steps = steps;

                      return (
                        <>
                          {CampaignStep.route ===
                            CampaignRoutesEnums.SELECT_CHANNEL && (
                            <SelectChannelType {...commonparms} />
                          )}
                          {CampaignStep.route ===
                            CampaignRoutesEnums.CAMPAIGN_TYPE && (
                            <SelectCampaignType {...commonparms} />
                          )}
                          {CampaignStep.route ===
                            CampaignRoutesEnums.TARGET_AUDIENCE && (
                            <SelectTargetAudience {...commonparms} />
                          )}
                          {CampaignStep.route ===
                            CampaignRoutesEnums.CONTENT_CONFIGURATION && (
                            <ContentCampaign {...commonparms} />
                          )}
                          {CampaignStep.route ===
                            CampaignRoutesEnums.SCHEDULE_AND_GOALS && (
                            <ScheduleAndGoalsContainer {...commonparms} />
                          )}
                        </>
                      );
                    }}
                  </Step>
                );
              })}
            </Steps>
          </Wizard>
        </Card>
      </Colxx>
    </Row>
  );
};

const mapStateToProps = ({
  campaignsApp,
  segmentationApp,
  dashboardCampaignsApp,
}) => {
  const {
    loadingAdd,
    createCampaign: {
      selectAudience: {
        channelType,
        campaignName,
        campaignType,
        audience,
        segmentId,
        queryId,
        campaignContentType,
        excludeUsers,
      },
      selectAudience,
      contentConfiguration: {
        smsSender,
        templateId,
        message,
        templateRecordId,
      },
      contentConfiguration,
    },
    saveSuccess,
    saveError,
    stepIndex,
    saveAsDraftResponse,
    formEmailCreation,
    emailTemplate,
    inboxId,
    convertedTinyUrls,
    convertedPersonalizedMsg,
    emailTempId,
    whatsAppTemplateCategory,
    channelId,
    channelTypes,
  } = campaignsApp;
  const { lastExecutedFilterId, listQueryResult } = segmentationApp;
  const { campaignInfo } = dashboardCampaignsApp;

  return {
    loading: loadingAdd,
    channelType,
    campaignName,
    campaignType,
    audience,
    stepIndex,
    contentConfiguration,
    saveSuccess,
    saveError,
    saveAsDraftResponse,
    formEmailCreation,
    selectAudience,
    segmentId,
    queryId,
    campaignContentType,
    lastExecutedFilterId,
    emailTemplate,
    inboxId,
    convertedTinyUrls,
    convertedPersonalizedMsg,
    excludeUsers,
    emailTempId,
    smsSender,
    templateId,
    message,
    templateRecordId,
    campaignInfo,
    listQueryResult,
    whatsAppTemplateCategory,
    channelId,
    channelTypes,
  };
};

export default connect(mapStateToProps, {
  campaignClean: scheduleSmsCampaignClean,
  smsCampaignSaveAsDraftAction: smsCampaignSaveAsDraft,
  smsCampaignSaveAsDraftCleanAction: smsCampaignSaveAsDraftClean,
  updateStepIndexAction: updateStepIndex,
  getCampaignInfoData: getCampaignInfoById,
  getDashboardCampaignInfo: getCampaignInfo,
  getQueryResult: getQueryList,
  userCountFilterMethod: userCountFilter,
  generateTinyUrlCleanAction: generateTinyUrlClean,
})(injectIntl(CreateCampaignForm));
