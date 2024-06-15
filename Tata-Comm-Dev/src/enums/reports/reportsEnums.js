const reportsEnums = Object.freeze({
  IN_PROCESS: 'in_process',
  IN_PROCESS_LABEL: 'In Process',
  FINISHED: 'finished',
  AVG_FIRST_RESPONSE_TIME: 'avg_first_response_time',
  AVG_RESOLUTION_TIME: 'avg_resolution_time',
  NUMERIC: 'numeric',
  SHORT: 'short',
  TWO_DIGIT: '2-digit',
  DATE_FORMAT: 'MM/dd/yyyy',
  REPORT: 'report',
  CSAT: 'csat',
  CUSTOM_RANGE: 'Custom Range',
  CUSTOM_DATE_INDEX: 5,
  INITIALISE_VALUE: 0,
  DATE_FILTER_VALUE: {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  },
});

export default reportsEnums;
