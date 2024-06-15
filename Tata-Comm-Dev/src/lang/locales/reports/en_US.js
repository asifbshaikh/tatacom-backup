module.exports = {
  REPORT: {
    PLACEHOLDER: 'Choose Agents',
    HEADER: 'Overview',
    LOADING_CHART: 'Loading chart data...',
    NO_ENOUGH_DATA:
      "We've not received enough data points to generate report, Please try again later.",
    DOWNLOAD_AGENT_REPORTS: 'Download agent reports',
    METRICS: {
      CONVERSATIONS: {
        NAME: 'Conversations',
        DESC: '( Total )',
      },
      INCOMING_MESSAGES: {
        NAME: 'Incoming Messages',
        DESC: '( Total )',
      },
      OUTGOING_MESSAGES: {
        NAME: 'Outgoing Messages',
        DESC: '( Total )',
      },
      FIRST_RESPONSE_TIME: {
        NAME: 'First response time',
        DESC: '( Avg )',
      },
      RESOLUTION_TIME: {
        NAME: 'Resolution Time',
        DESC: '( Avg )',
      },
      RESOLUTION_COUNT: {
        NAME: 'Resolution Count',
        DESC: '( Total )',
      },
    },
    DATE_FILTER_LABEL: {
      LAST_7_DAYS: 'Last 7 days',
      LAST_30_DAYS: 'Last 30 days',
      LAST_3_MONTHS: 'Last 3 months',
      LAST_6_MONTHS: 'Last 6 months',
      LAST_YEAR: 'Last year',
      CUSTOM_DATE_RANGE: 'Custom date range',
    },
    CUSTOM_DATE_RANGE: {
      CONFIRM: 'Apply',
      PLACEHOLDER: 'Select date range',
    },
    GROUP_BY_FILTER_DROPDOWN_LABEL: 'Group By',
    GROUP_BY_DAY_OPTIONS: [{ id: 1, groupBy: 'Day' }],
    GROUP_BY_WEEK_OPTIONS: [
      { id: 1, groupBy: 'Day' },
      { id: 2, groupBy: 'Week' },
    ],
    GROUP_BY_MONTH_OPTIONS: [
      { id: 1, groupBy: 'Day' },
      { id: 2, groupBy: 'Week' },
      { id: 3, groupBy: 'Month' },
    ],
    GROUP_BY_YEAR_OPTIONS: [
      { id: 1, groupBy: 'Day' },
      { id: 2, groupBy: 'Week' },
      { id: 3, groupBy: 'Month' },
      { id: 4, groupBy: 'Year' },
    ],
  },
  AGENT_REPORTS: {
    HEADER: 'Agents Overview',
    LOADING_CHART: 'Loading chart data...',
    NO_ENOUGH_DATA:
      "We've not received enough data points to generate report, Please try again later.",
    DOWNLOAD_AGENT_REPORTS: 'Download agent reports',
    FILTER_DROPDOWN_LABEL: 'Select Agent',
    METRICS: {
      CONVERSATIONS: {
        NAME: 'Conversations',
        DESC: '( Total )',
      },
      INCOMING_MESSAGES: {
        NAME: 'Incoming Messages',
        DESC: '( Total )',
      },
      OUTGOING_MESSAGES: {
        NAME: 'Outgoing Messages',
        DESC: '( Total )',
      },
      FIRST_RESPONSE_TIME: {
        NAME: 'First response time',
        DESC: '( Avg )',
      },
      RESOLUTION_TIME: {
        NAME: 'Resolution Time',
        DESC: '( Avg )',
      },
      RESOLUTION_COUNT: {
        NAME: 'Resolution Count',
        DESC: '( Total )',
      },
    },
    DATE_RANGE: [
      {
        id: 0,
        name: 'Last 7 days',
      },
      {
        id: 1,
        name: 'Last 30 days',
      },
      {
        id: 2,
        name: 'Last 3 months',
      },
      {
        id: 3,
        name: 'Last 6 months',
      },
      {
        id: 4,
        name: 'Last year',
      },
      {
        id: 5,
        name: 'Custom date range',
      },
    ],
    CUSTOM_DATE_RANGE: {
      CONFIRM: 'Apply',
      PLACEHOLDER: 'Select date range',
    },
  },
  LABEL_REPORTS: {
    HEADER: 'Labels Overview',
    LOADING_CHART: 'Loading chart data...',
    NO_ENOUGH_DATA:
      "We've not received enough data points to generate report, Please try again later.",
    DOWNLOAD_LABEL_REPORTS: 'Download label reports',
    FILTER_DROPDOWN_LABEL: 'Select Label',
    METRICS: {
      CONVERSATIONS: {
        NAME: 'Conversations',
        DESC: '( Total )',
      },
      INCOMING_MESSAGES: {
        NAME: 'Incoming Messages',
        DESC: '( Total )',
      },
      OUTGOING_MESSAGES: {
        NAME: 'Outgoing Messages',
        DESC: '( Total )',
      },
      FIRST_RESPONSE_TIME: {
        NAME: 'First response time',
        DESC: '( Avg )',
      },
      RESOLUTION_TIME: {
        NAME: 'Resolution Time',
        DESC: '( Avg )',
      },
      RESOLUTION_COUNT: {
        NAME: 'Resolution Count',
        DESC: '( Total )',
      },
    },
    DATE_RANGE: [
      {
        id: 0,
        name: 'Last 7 days',
      },
      {
        id: 1,
        name: 'Last 30 days',
      },
      {
        id: 2,
        name: 'Last 3 months',
      },
      {
        id: 3,
        name: 'Last 6 months',
      },
      {
        id: 4,
        name: 'Last year',
      },
      {
        id: 5,
        name: 'Custom date range',
      },
    ],
    CUSTOM_DATE_RANGE: {
      CONFIRM: 'Apply',
      PLACEHOLDER: 'Select date range',
    },
  },
  INBOX_REPORTS: {
    HEADER: 'Inbox Overview',
    LOADING_CHART: 'Loading chart data...',
    NO_ENOUGH_DATA:
      "We've not received enough data points to generate report, Please try again later.",
    DOWNLOAD_INBOX_REPORTS: 'Download inbox reports',
    FILTER_DROPDOWN_LABEL: 'Select Inbox',
    METRICS: {
      CONVERSATIONS: {
        NAME: 'Conversations',
        DESC: '( Total )',
      },
      INCOMING_MESSAGES: {
        NAME: 'Incoming Messages',
        DESC: '( Total )',
      },
      OUTGOING_MESSAGES: {
        NAME: 'Outgoing Messages',
        DESC: '( Total )',
      },
      FIRST_RESPONSE_TIME: {
        NAME: 'First response time',
        DESC: '( Avg )',
      },
      RESOLUTION_TIME: {
        NAME: 'Resolution Time',
        DESC: '( Avg )',
      },
      RESOLUTION_COUNT: {
        NAME: 'Resolution Count',
        DESC: '( Total )',
      },
    },
    DATE_RANGE: [
      {
        id: 0,
        name: 'Last 7 days',
      },
      {
        id: 1,
        name: 'Last 30 days',
      },
      {
        id: 2,
        name: 'Last 3 months',
      },
      {
        id: 3,
        name: 'Last 6 months',
      },
      {
        id: 4,
        name: 'Last year',
      },
      {
        id: 5,
        name: 'Custom date range',
      },
    ],
    CUSTOM_DATE_RANGE: {
      CONFIRM: 'Apply',
      PLACEHOLDER: 'Select date range',
    },
  },
  TEAM_REPORTS: {
    HEADER: 'Team Overview',
    LOADING_CHART: 'Loading chart data...',
    NO_ENOUGH_DATA:
      "We've not received enough data points to generate report, Please try again later.",
    DOWNLOAD_TEAM_REPORTS: 'Download team reports',
    FILTER_DROPDOWN_LABEL: 'Select Team',
    METRICS: {
      CONVERSATIONS: {
        NAME: 'Conversations',
        DESC: '( Total )',
      },
      INCOMING_MESSAGES: {
        NAME: 'Incoming Messages',
        DESC: '( Total )',
      },
      OUTGOING_MESSAGES: {
        NAME: 'Outgoing Messages',
        DESC: '( Total )',
      },
      FIRST_RESPONSE_TIME: {
        NAME: 'First response time',
        DESC: '( Avg )',
      },
      RESOLUTION_TIME: {
        NAME: 'Resolution Time',
        DESC: '( Avg )',
      },
      RESOLUTION_COUNT: {
        NAME: 'Resolution Count',
        DESC: '( Total )',
      },
    },
    DATE_RANGE: [
      {
        id: 0,
        name: 'Last 7 days',
      },
      {
        id: 1,
        name: 'Last 30 days',
      },
      {
        id: 2,
        name: 'Last 3 months',
      },
      {
        id: 3,
        name: 'Last 6 months',
      },
      {
        id: 4,
        name: 'Last year',
      },
      {
        id: 5,
        name: 'Custom date range',
      },
    ],
    CUSTOM_DATE_RANGE: {
      CONFIRM: 'Apply',
      PLACEHOLDER: 'Select date range',
    },
  },
  CSAT_REPORTS: {
    HEADER: 'CSAT Reports',
    NO_RECORDS: 'There are no CSAT survey responses available.',
    FILTERS: {
      AGENTS: {
        PLACEHOLDER: 'Choose Agents',
      },
    },
    TABLE: {
      HEADER: {
        CONTACT_NAME: 'Contact',
        AGENT_NAME: 'Assigned agent',
        RATING: 'Rating',
        FEEDBACK_TEXT: 'Feedback comment',
      },
    },
    METRIC: {
      TOTAL_RESPONSES: {
        LABEL: 'Total responses',
        TOOLTIP: 'Total number of responses collected',
      },
      SATISFACTION_SCORE: {
        LABEL: 'Satisfaction score',
        TOOLTIP:
          'Total number of positive responses / Total number of responses * 100',
      },
      RESPONSE_RATE: {
        LABEL: 'Response rate',
        TOOLTIP:
          'Total number of responses / Total number of CSAT survey messages sent * 100',
      },
    },
  },
  USER_REPORTS: {
    HEADER: 'User Reports',
    COLUMN_NAMES: {
      UPDATED_TIME: 'UPDATED TIME',
      FILE_NAME: 'FILE NAME',
      DESCRIPTION: 'DESCRIPTION',
      STATUS: 'STATUS',
      ACTION: 'ACTION',
    },
    UPDATE_QUERY_ALERT: 'Rerun Query Successfully',
  },
};