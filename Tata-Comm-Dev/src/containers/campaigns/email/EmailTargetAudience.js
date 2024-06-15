import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { addCampaignCreate, getColumnAttributeList } from 'redux/actions';
import { Alert, Card, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { CampaignContentTypeOptions } from 'data/createCampaignData';
import {
  setCampaignName,
  setEmailTargetAudience,
  updateStepIndex,
} from 'redux/campaigns/actions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import EmailTargetAudienceEnums from 'enums/campaigns/email/emailTargetAudienceEnums';
import CreateSegmentPopover from 'views/app/segments/create-segment/widgets/CreateSegmentPopover';
import { segmentCreate, userCountFilter } from 'redux/segmentation/actions';
import {
  createSegmentFiltersInitialValues,
  isExcludeUserSelected,
  removeEmptyPropertyFromJson,
} from 'data/segments/createSegmentFilterData';
import EventTriggerCriteria from '../EventTriggerCriteria';
import CampaignDetails from '../CampaignDetails';
import EnableControlGroups from '../EnableControlGroups';
import StepperNavigationButtons from '../StepperNavigationButtons';
import { isFiltersValidForCampaign } from 'helpers/campaignHelper';
import CreateSegmentFilter from 'components/create-segment/CreateSegmentFilter';
import {
  filterUsersSchema,
  eventTriggerSchema,
} from 'components/create-segment/createSegmentValidationSchema';
import { injectIntl } from 'react-intl';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import { NotificationManager } from 'components/common/react-notifications';

const EmailTargetAudience = ({
  formRef,
  next,
  previous,
  campaignTagsList,
  segmentCreateActiom,
  lastExecutedFilterId,
  setEmailTargetAudienceAction,
  updateStepIndexAction,
  setCampaignNameAction,
  stepIndex,
  getColumnAttributeListAction,
  colAttributesList,
  userCountFilterMethod,
  selectAudience,
  intl,
}) => {
  const history = useHistory();
  const { search, state } = history.location;
  const params = new URLSearchParams(search);
  const fromSegmentId = params.get('segmentId');
  const fromQueryId = params.get('queryId');
  const segmentName = state?.segmentName;

  const { messages } = intl;
  const getTranslatedFormFieldRequiredMessage = (message) => {
    return messages[message];
  };

  const targetUsersInitialValues = {
    channelType: '',
    campaignType: '',
    campaignName: '',
    campaignTags: '',
    campaignContentType: EmailTargetAudienceEnums.PROMOTIONAL_MARKETING,
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
      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.FIELD_REQUIRED.USER_ATTRIBUTES" />
    ),
    campaignTags: Yup.array().of(Yup.string()),
    triggerCriteria: Yup.object().when('campaignType', {
      is: 'event_trigger',
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

  const handleSubmit = (values) => {
    let payload = {};
    const removedEmptyTriggerValues = removeEmptyPropertyFromJson(
      values.triggerCriteria
    );
    values.triggerCriteria = removedEmptyTriggerValues;
    setEmailTargetAudienceAction({ ...values });
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
      if (data?.segment_filter?.users_count > 0) {
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
    updateStepIndexAction(stepIndex - 1);
    previous();
  };

  const createSegment = (campaignNames) => {
    segmentCreateActiom({
      name: campaignNames,
      type: 'Filter',
      filter_id: lastExecutedFilterId,
      created_from: 'direct_from_query',
    });
  };

  useEffect(() => {
    getColumnAttributeListAction();
  }, []);

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
            <Row className="mt-4 pl-3 pr-3">
              <Colxx xxs="12">
                <h2 className="font-weight-bold">
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.TARGET_USERS.LABEL.CAMPAIGN_CONTENT_TYPE" />
                </h2>
              </Colxx>
            </Row>
            <Row className=" pl-4 pr-4">
              <Colxx xxs="12">
                <FormGroupCoustom
                  onChange={(event) =>
                    form.setFieldValue(
                      'campaignContentType',
                      event.target.value
                    )
                  }
                  noLable
                  type="radioMulti"
                  radioMultiOptions={CampaignContentTypeOptions}
                  value={form.values.campaignContentType}
                  identifier="campaignContentType"
                  className="select-audience"
                />
              </Colxx>
            </Row>
            {form.values.campaignContentType ===
              EmailTargetAudienceEnums.TRANSACTIONAL && (
              <Row className="pl-4 pr-4">
                <Colxx xxs="12">
                  <Alert>
                    <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.TARGET_USERS.LABEL.TRANSACTIONAL_OPTION_NOTE" />
                  </Alert>
                </Colxx>
              </Row>
            )}
            {form.values.campaignType ===
              ScheduleAndGoalsEnums.EVENT_TRIGGERED && (
              <EventTriggerCriteria
                form={form}
                triggerRootIdentifier="triggerCriteria"
                triggerFilterIdentifier="included_filters"
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
            {/* 
            {form.values.campaignContentType ===
              EmailTargetAudienceEnums.TRANSACTIONAL && (
              <Row className="pl-3 pr-3 pb-4">
                <Colxx xxs="12">
                  <h4 className="font-weight-bold">
                    <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.TARGET_USERS.LABEL.ENABLE_CONTROL_GROUPS" />
                  </h4>
                </Colxx>

                <Colxx xxs="12">
                  <Alert>
                    <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.TARGET_USERS.LABEL.CONTROL_GROUPS_NOTE" />
                  </Alert>
                </Colxx>
              </Row>
            )}
            {form.values.campaignContentType ===
              EmailTargetAudienceEnums.PROMOTIONAL_MARKETING && (
              <EnableControlGroups form={form} />
            )} 
            */}
            <StepperNavigationButtons
              className="m-2"
              leftBtnLabel={
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.BUTTON.PREVIOUS" />
              }
              handleLeftBtnClick={handlePreviousBtnClick}
              rightBtnLabel={
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.BUTTON.NEXT" />
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
  addTargetUsers: addCampaignCreate,
  segmentCreateActiom: segmentCreate,
  updateStepIndexAction: updateStepIndex,
  setCampaignNameAction: setCampaignName,
  setEmailTargetAudienceAction: setEmailTargetAudience,
  getColumnAttributeListAction: getColumnAttributeList,
  userCountFilterMethod: userCountFilter,
})(injectIntl(EmailTargetAudience));
