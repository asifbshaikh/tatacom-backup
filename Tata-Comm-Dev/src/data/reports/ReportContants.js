import reportsEnums from 'enums/reports/reportsEnums';
import IntlMessages from 'helpers/IntlMessages';

export const dateFilterOptions = [
  {
    id: reportsEnums.DATE_FILTER_VALUE.ZERO,
    label: <IntlMessages id="REPORT.DATE_FILTER_LABEL.LAST_7_DAYS" />,
  },
  {
    id: reportsEnums.DATE_FILTER_VALUE.ONE,
    label: <IntlMessages id="REPORT.DATE_FILTER_LABEL.LAST_30_DAYS" />,
  },
  {
    id: reportsEnums.DATE_FILTER_VALUE.TWO,
    label: <IntlMessages id="REPORT.DATE_FILTER_LABEL.LAST_3_MONTHS" />,
  },
  {
    id: reportsEnums.DATE_FILTER_VALUE.THREE,
    label: <IntlMessages id="REPORT.DATE_FILTER_LABEL.LAST_6_MONTHS" />,
  },
  {
    id: reportsEnums.DATE_FILTER_VALUE.FOUR,
    label: <IntlMessages id="REPORT.DATE_FILTER_LABEL.LAST_YEAR" />,
  },
  {
    id: reportsEnums.DATE_FILTER_VALUE.FIVE,
    label: <IntlMessages id="REPORT.DATE_FILTER_LABEL.CUSTOM_DATE_RANGE" />,
  },
];
