import CommonEnums from 'enums/commonEnums';

export const dummyOptionsNumber = [
  { id: '', value: '' },
  { id: '9876543232', value: '9876543232' },
  { id: '8978477463', value: '8978477463' },
  { id: '8766554336', value: '8766554336' },
];

export const userBehaviorFilterOptions = [
  { id: '', value: 'Select Option' },
  { id: true, value: 'Has Executed' },
  { id: false, value: 'Has Not Executed' },
];
export const filterConditionOptions = [
  { id: 'and', value: 'AND' },
  { id: 'or', value: 'OR' },
];

export const filterByUsersButtonLists = [
  { value: 'user_property', label: 'User Property' },
  { value: 'user_affinity', label: 'User Affinity' },
  { value: 'user_behavior', label: 'User Behavior' },
  { value: 'custom_segments', label: 'Custom Segment' },
];

export const selectExecutedFilterOptions = [
  { id: 'hasExecuted', value: 'Has Executed' },
  { id: 'hasNotExecuted', value: 'Has Not Executed' },
];

export const userPropertyFilterOptions = [
  { id: 'lifeCycle', value: 'Life Cycle' },
  { id: 'firstSeen', value: 'First Seen' },
  { id: 'lastSeen', value: 'Last Seen' },
  { id: 'ltv', value: 'LTV' },
  { id: 'noOfConversion', value: 'No Of Conversion' },
];

export const customSegmentFilterOptions = [
  { id: 'customSegment', value: 'Custom Segment' },
];

export const userAffinityFilterOptions = [
  { id: 'hasExecuted', value: 'Has Executed' },
];

export const selectAudienceRadioOptions = [
  {
    id: 'allUsers',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ALL_USERS',
    value: 'allUsers',
  },
  {
    id: 'filterByUsers',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.FILTER_USERS_BY',
    value: 'filterByUsers',
  },
];

export const selectHeaderOptions = [
  {
    id: 'imageURL',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.IMAGE_URL',
    value: 'imageURL',
  },
  {
    id: 'uploadImage',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.UPLOAD_IMAGE',
    value: 'uploadImage',
  },
];

export const selectTriggereRadioOptions = [
  {
    id: 'immediately',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.IMMEDIATLEY',
    value: 'immediately',
  },
  {
    id: 'withDelay',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.WITH_DELAY',
    value: 'with_delay',
  },
];

export const sendMessageBestTimeRadioOptions = [
  {
    id: 'send_message_at_start_or_end_time',
    value: 'true',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_MESSAGE_AT_START_OR_END_TIME',
  },
  {
    id: 'do_not_send_message',
    value: 'false',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.DO_NOT_SEND_MESSAGE',
  },
];

export const userBestTimeNotAvailableRadioOptions = [
  {
    id: 'yes_send_at_start_time',
    value: '0',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.YES_SEND_AT_START_TIME',
  },
  {
    id: 'yes_send_at_apps_best_time',
    value: '1',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.YES_SEND_AT_APP_BEST_TIME',
  },
  {
    id: 'do_not_send_message',
    value: '2',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.DO_NOT_SEND_MESSAGE',
  },
];

export const sendInUserTimeZoneRadioList = [
  {
    id: 'yes_send_it',
    value: 'true',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.YES_SEND_IT',
  },
  {
    id: 'no_dont_send_it',
    value: 'false',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.NO_DONT_SEND_IT',
  },
];

export const oneTimeRadioLists = [
  {
    id: 'at_fixed_time',
    value: 'at_fixed_time',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.AT_FIXED_TIME',
  },
  {
    id: 'send_in_user_time_zone',
    value: 'send_in_user_time_zone',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_IN_USER_TIME_ZONE',
  },
  // {
  //   id: 'best_time_for_user',
  //   value: 'best_time_for_user',
  //   label:
  //     'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.BEST_TIME_FOR_USER',
  // },
];

export const periodicRadioLists = [
  {
    id: 'at_fixed_time',
    value: 'at_fixed_time',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.AT_FIXED_TIME',
  },
  {
    id: 'send_in_user_time_zone',
    value: 'send_in_user_time_zone',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_IN_USER_TIME_ZONE',
  },
  // {
  //   id: 'best_time_for_user',
  //   value: 'best_time_for_user',
  //   label:
  //     'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.BEST_TIME_FOR_USER',
  // },
];

export const periodicEndsRadioLists = [
  {
    id: 'never',
    value: 'Never',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.NEVER',
  },
  {
    id: 'on',
    value: 'On',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.ON',
  },
  {
    id: 'after',
    value: 'After',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.AFTER',
  },
];

export const periodicMonthlyRadioLists = [
  {
    id: 'day_of_month',
    value: 'Date of Month',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.DAY_OF_MONTH',
  },
  {
    id: 'day_of_week',
    value: 'Day of Week',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.DAY_OF_WEEK',
  },
];

export const scheduleCampaignOneTimeBtnList = [
  {
    value: 'Immediately',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.IMMEDIATELY',
    id: 'one_time.sendCampaignType',
  },
  {
    value: 'at_specific_date_and_time',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.AT_SPECIFIC_DATE_AND_TIME',
    id: 'one_time.sendCampaignType',
  },
];

export const scheduleCampaignPeriodicBtnList = [
  {
    value: 'daily',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.DAILY',
    id: 'periodic.sendCampaignType',
  },
  {
    value: 'weekly',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.WEEKLY',
    id: 'periodic.sendCampaignType',
  },
  {
    value: 'monthly',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.MONTHLY',
    id: 'periodic.sendCampaignType',
  },
];

export const scheduleCampaignEventTriggeredBtnList = [
  {
    value: 'Active Continously',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.ACTIVE_CONTINOUSLY',
    id: 'event_trigger.sendCampaignType',
  },
];

export const weekDaysList = [
  { label: 'S', id: 'Sunday' },
  { label: 'M', id: 'Monday' },
  { label: 'T', id: 'Tuesday' },
  { label: 'W', id: 'Wednesday' },
  { label: 'T', id: 'Thursday' },
  { label: 'F', id: 'Friday' },
  { label: 'S', id: 'Saturday' },
];

export const testSmsCampaignOptions = [
  {
    id: 'mobileNumber',
    value:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.TEST_ATTRIBUTE_OPTIONS.MOBILE_NUMBER',
  },
  {
    id: 'uniqueId',
    value:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.TEST_ATTRIBUTE_OPTIONS.UNIQUE_ID',
  },
  {
    id: 'emailId',
    value:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.TEST_ATTRIBUTE_OPTIONS.EMAIL_ID',
  },
  {
    id: 'custom_segment',
    value:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.TEST_ATTRIBUTE_OPTIONS.CUSTOM_SEGMENT',
  },
];

export const CampaignContentTypeOptions = [
  {
    id: 'Promotional/Marketing',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.TARGET_USERS.LABEL.PROMOTIONAL_MARKETING',
    value: 'promotional',
  },
  {
    id: 'Transactional',
    label:
      'CAMPAIGN.CREATE_CAMPAIGN.EMAIL.FORM.TARGET_USERS.LABEL.TRANSACTIONAL',
    value: 'transactional',
  },
];

export const testEmailCampaignOptions = [
  {
    id: 'emailId',
    value:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.TEST_ATTRIBUTE_OPTIONS.EMAIL_ID',
  },
  {
    id: 'custom_segment',
    value:
      'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.TEST_ATTRIBUTE_OPTIONS.CUSTOM_SEGMENT',
  },
];

export const triggerCriteriaRadioLists = [
  {
    id: 'on_app_open',
    value: 'on_app_open',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ON_APP_OPEN',
  },
  {
    id: 'on_custom_event',
    value: 'on_custom_event',
    label: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ON_CUSTOM_EVENT',
  },
];

export const dataOfTime = [
  {
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.MINUTES',
    id: 60,
  },
  {
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.HOURS',
    id: 3600,
  },
  {
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.DAYS',
    id: 86400,
  },
];

export const dataOfPeriod = [
  {
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.BEFORE',
    id: 'before',
  },
  {
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.AFTER',
    id: 'after',
  },
];

export const attributeList = [
  {
    id: '1',
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.APP_VERSION',
  },
  {
    id: '2',
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.SDK_VERSION',
  },
  {
    id: '3',
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.UTM_SOURCE',
  },
  {
    id: '4',
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.UTM_MEDIUM',
  },
  {
    id: '5',
    value: 'CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.VALUES.UTM_CAMPAIGN',
  },
];

export const productOptions = {
  Campaigns: {
    name: 'HELP_CENTER.PRODUCT_OPTIONS.NAME.CAMPAIGNS',
    type: CommonEnums.TYPE_STRING,
  },
  SDK: {
    name: 'HELP_CENTER.PRODUCT_OPTIONS.NAME.SDK',
    type: CommonEnums.TYPE_STRING,
  },
  Analytics: {
    name: 'HELP_CENTER.PRODUCT_OPTIONS.NAME.ANALYTICS',
    type: CommonEnums.TYPE_STRING,
  },
};

export const priorityOptions = {
  Low: {
    name: 'HELP_CENTER.PRODUCT_OPTIONS.NAME.LOW',
    type: CommonEnums.TYPE_STRING,
  },
  Normal: {
    name: 'HELP_CENTER.PRODUCT_OPTIONS.NAME.NORMAL',
    type: CommonEnums.TYPE_STRING,
  },
  High: {
    name: 'HELP_CENTER.PRODUCT_OPTIONS.NAME.HIGH',
    type: CommonEnums.TYPE_STRING,
  },
  Urgent: {
    name: 'HELP_CENTER.PRODUCT_OPTIONS.NAME.URGENT',
    type: CommonEnums.TYPE_STRING,
  },
};

export const filterTypeOptions = [
  {
    value: 'draft',
    label: 'Draft',
  },
  {
    value: 'processing',
    label: 'Active',
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
  {
    value: 'failed',
    label: 'Failed',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
  },
  {
    value: 'paused',
    label: 'Paused',
  },
];
