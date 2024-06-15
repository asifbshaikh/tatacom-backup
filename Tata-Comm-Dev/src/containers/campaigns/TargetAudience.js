import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import {
  addCampaignCreateSuccess,
  getColumnAttributeList,
} from 'redux/actions';
import { Card } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import {
  getSmsCampaignsTags,
  setCampaignName,
  updateStepIndex,
} from 'redux/campaigns/actions';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import CreateSegmentPopover from 'views/app/segments/create-segment/widgets/CreateSegmentPopover';
import { segmentCreate, userCountFilter } from 'redux/segmentation/actions';
import {
  createSegmentFiltersInitialValues,
  isExcludeUserSelected,
  removeEmptyPropertyFromJson,
} from 'data/segments/createSegmentFilterData';
import EventTriggerCriteria from './EventTriggerCriteria';
import StepperNavigationButtons from './StepperNavigationButtons';
// import EnableControlGroups from './EnableControlGroups'; //commented this as we are not using this feature now
import CampaignDetails from './CampaignDetails';
import TragetPlatforms from './push-campaign/TragetPlatforms';
import TriggerCriteria from './inapp/TriggerCriteria';
import { isFiltersValidForCampaign } from 'helpers/campaignHelper';
import CreateSegmentFilter from 'components/create-segment/CreateSegmentFilter';
import {
  filterUsersSchema,
  eventTriggerSchema,
} from 'components/create-segment/createSegmentValidationSchema';
import { injectIntl } from 'react-intl';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import { NotificationManager } from 'components/common/react-notifications';
import CommonEnums from 'enums/commonEnums';

const TargetAudience = ({
  formRef,
  next,
  previous,
  addTargetUsers,
  getSmsCampaignsTagsList,
  campaignTagsList,
  stepIndex,
  updateStepIndexAction,
  setCampaignNameAction,
  segmentCreateAction,
  lastExecutedFilterId,
  userCountFilterMethod,
  colAttributesList,
  getColumnAttributeListAction,
  selectAudience,
  intl,
}) => {
  const { messages } = intl;
  const getTranslatedFormFieldRequiredMessage = (message) => {
    return messages[message];
  };

  const createSegment = (campaign) => {
    segmentCreateAction({
      name: campaign,
      type: 'Filter',
      filter_id: lastExecutedFilterId,
      created_from: 'direct_from_query',
    });
  };

  const history = useHistory();
  const { search, state } = history.location;
  const params = new URLSearchParams(search);
  const fromSegmentId = params.get('segmentId');
  const fromQueryId = params.get('queryId');
  const segmentName = state?.segmentName;

  const targetUsersInitialValues = {
    channelType: '',
    campaignType: '',
    campaignName: '',
    campaignTags: '',
    selectedUserAttribute: '',
    globalControlGroup: false,
    campaignControlGroup: false,
    triggerCriteria: {
      included_filters: {
        filter_operator: createSegementEnums.CONDITION.AND,
        filters: [
          {
            filter_operator: createSegementEnums.CONDITION.AND,
            filters: [
              {
                filter_type: createSegementEnums.CONDITION.USER_BEHAVIOR,
                executed: createSegementEnums.CONDITION.TRUE,
                name: '',
                operator: TargetAudienceEnums.AT_LEAST,
                value: TargetAudienceEnums.TIME_VALUE,
                attributes: {
                  filter_operator: createSegementEnums.CONDITION.AND,
                  filters: [],
                },
              },
            ],
          },
        ],
      },
      trigger_relation: TargetAudienceEnums.AFTER,
      trigger_attr: TargetAudienceEnums.IF_ACTION,
      time_value: TargetAudienceEnums.TIME_VALUE,
      time_multiplier: TargetAudienceEnums.TIME_MULTIPLIER,
      trigger_message_type: TargetAudienceEnums.IMMEDIATELY,
    },
    ...createSegmentFiltersInitialValues,
    ...selectAudience,
    segmentId: fromSegmentId ?? selectAudience.segmentId ?? '',
    queryId: fromQueryId ?? selectAudience.queryId ?? '',
    inAppTriggerCriteria: '',
  };

  const campaignNameRegex = /^[^*%]*$/;

  const makeSchema = Yup.object().shape({
    channelType: Yup.string(),
    campaignType: Yup.string(),
    campaignName: Yup.string()
      .matches(
        campaignNameRegex,
        getTranslatedFormFieldRequiredMessage(
          'CAMPAIGN.CREATE_CAMPAIGN.FORM.FIELD_REQUIRED.CAMPAIGN_NAME_VALIDATION'
        )
      )
      .required(
        getTranslatedFormFieldRequiredMessage(
          'CAMPAIGN.CREATE_CAMPAIGN.FORM.FIELD_REQUIRED.CAMPAIGN_NAME'
        )
      ),
    selectedUserAttribute: Yup.string().required(
      getTranslatedFormFieldRequiredMessage(
        'CAMPAIGN.CREATE_CAMPAIGN.FORM.FIELD_REQUIRED.USER_ATTRIBUTES'
      )
    ),
    campaignTags: Yup.array().of(Yup.string()),
    triggerCriteria: Yup.object().when('campaignType', {
      is: ScheduleAndGoalsEnums.EVENT_TRIGGERED,
      then: Yup.object().shape({
        ...eventTriggerSchema,
      }),
      otherwise: Yup.object().notRequired(),
    }),
    globalControlGroup: Yup.boolean(),
    campaignControlGroup: Yup.boolean(),
    audience_type: Yup.string(),
    included_filters: Yup.object().when('segmentId', {
      is: (value) => value && segmentName,
      then: Yup.object().notRequired(),
      otherwise: Yup.object().shape({
        ...filterUsersSchema,
      }),
    }),
    exclude_users: Yup.boolean(),
    excluded_filters: Yup.object().when('exclude_users', {
      is: true,
      then: Yup.object().shape({
        ...filterUsersSchema,
      }),
    }),
  });

  useEffect(() => {
    getSmsCampaignsTagsList();
    if (colAttributesList?.length === 0) {
      getColumnAttributeListAction();
    }
  }, []);
  const handleSubmit = (values) => {
    let payload = {};
    const removedEmptyTriggerValues = removeEmptyPropertyFromJson(
      values.triggerCriteria
    );
    values.triggerCriteria = removedEmptyTriggerValues;
    const createCampaign = {
      selectAudience: { ...values },
    };
    addTargetUsers(createCampaign);
    if (values?.segmentId && segmentName) {
      payload = {
        segment_id: values?.segmentId,
        segment_name: segmentName,
        excluded_filters: values.exclude_users
          ? removeEmptyPropertyFromJson(values.excluded_filters)
          : {},
      };
    } else {
      payload = isExcludeUserSelected(values);
    }
    const nextCallBack = (data) => {
      if (data?.segment_filter?.reachable_users?.total_users > 0) {
        updateStepIndexAction(stepIndex + 1);
        next();
      } else {
        if (formRef?.current?.setTouched) {
          formRef.current.setTouched(formRef.current.touched);
        }
        NotificationManager.error(
          <IntlMessages id="CAMPAIGN.ERRORS.ZERO_AUDIENCE_COUNT_ERROR" />,
          'Error',
          6000,
          null,
          null,
          ''
        );
      }
    };
    userCountFilterMethod({ ...payload }, nextCallBack);
  };

  const handlePreviousBtnClick = () => {
    if (!selectAudience?.selectedUserAttribute) {
      addTargetUsers({
        selectAudience: {
          campaignName: '',
          channelType: selectAudience.channelType,
          campaignType: selectAudience.campaignType,
        },
      });
    }
    updateStepIndexAction(stepIndex - 1);
    previous();
  };
  return (
    <div className="mt-2">
      <Formik
        innerRef={formRef}
        initialValues={targetUsersInitialValues}
        onSubmit={handleSubmit}
        validationSchema={makeSchema}
        validateOnBlur
        validateOnChange
        validateOnMount
      >
        {(form) => (
          <Form>
            <CampaignDetails
              form={form}
              campaignTagsOptions={campaignTagsList}
              setCampaignName={setCampaignNameAction}
              colAttributesList={colAttributesList}
            />
            {(selectAudience.channelType === CommonEnums.PUSH ||
              selectAudience.channelType === CommonEnums.INAPP) && (
              <TragetPlatforms channelType={selectAudience.channelType} />
            )}

            {selectAudience.channelType === CommonEnums.INAPP &&
              selectAudience.campaignType !==
                ScheduleAndGoalsEnums.EVENT_TRIGGERED && (
                <TriggerCriteria form={form} />
              )}
            {form.values.campaignType ===
              ScheduleAndGoalsEnums.EVENT_TRIGGERED && (
              <EventTriggerCriteria
                form={form}
                triggerRootIdentifier={TargetAudienceEnums.TRIGGER_CRITERIA}
                triggerFilterIdentifier={TargetAudienceEnums.INCLUDED_FILTERS}
              />
            )}

            <Card>
              <div className="user-filter">
                <br />
                <CreateSegmentFilter segmentName={segmentName} form={form} />
                <div className="float-right mr-1">
                  <CreateSegmentPopover
                    createSegment={createSegment}
                    segmentName={segmentName}
                    form={form}
                    hideCreateButton
                    isFiltersValid={isFiltersValidForCampaign(form.errors)}
                  />
                </div>
              </div>
            </Card>
            {/* commented this as we are not using this feature now */}
            {/* <EnableControlGroups form={form} /> */}
            <StepperNavigationButtons
              className="m-2"
              leftBtnLabel={
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.PREVIOUS" />
              }
              handleLeftBtnClick={handlePreviousBtnClick}
              rightBtnLabel={
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.NEXT" />
              }
              handleRightBtnClick={form.handleSubmit}
              rightBtnLabelDisable={
                !form.isValid && !(Object.keys(form.errors) > 0)
              }
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = ({ campaignsApp, importusersApp }) => {
  const {
    createCampaign: { selectAudience },
    campaignTags,
    stepIndex,
  } = campaignsApp;
  const { colAttributesList } = importusersApp;

  return {
    selectAudience,
    stepIndex,
    campaignTagsList: campaignTags,
    colAttributesList,
  };
};

export default connect(mapStateToProps, {
  getSmsCampaignsTagsList: getSmsCampaignsTags,
  addTargetUsers: addCampaignCreateSuccess,
  updateStepIndexAction: updateStepIndex,
  setCampaignNameAction: setCampaignName,
  segmentCreateAction: segmentCreate,
  userCountFilterMethod: userCountFilter,
  getColumnAttributeListAction: getColumnAttributeList,
})(injectIntl(TargetAudience));
