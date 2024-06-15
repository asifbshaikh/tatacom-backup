import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { generateTinyUrlReport } from 'redux/actions';
import AnalyticsPie from './AnalyticsPie';
import { Button, Card, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { getConvertedStringWithSpace } from 'helpers/campaignHelper';
import { ThemeColors } from 'helpers/ThemeColors';
import CommonEnums from 'enums/commonEnums';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import moment from 'moment';
import { generateTinyUrlReportClean } from 'redux/dashboard-campaigns/actions';

const AnalyticsData = ({
  data,
  campaignType,
  campaignID,
  generateTinyUrlReportAction,
  tinyUrlReport,
  tinyUrlReportSuccess,
  generateTinyUrlReportCleanAction,
}) => {
  const status = data?.campaign_tiny_url_report_status;
  const runTime =
    data?.campaign_tiny_url_report_last_run_time === null
      ? null
      : tinyUrlReport?.campaign_tiny_url_report_last_run_time
      ? tinyUrlReport?.campaign_tiny_url_report_last_run_time
      : data?.campaign_tiny_url_report_last_run_time;

  const colors = ThemeColors();
  const analyticsChartData = {
    labels: ['Sent', 'Delivered', 'Bounced', 'Opened'],
    datasets: [
      {
        label: '',
        borderColor: [
          colors.themeColor1,
          colors.themeColor2,
          colors.themeColor3,
          colors.themeColor4,
        ],
        backgroundColor: [
          colors.themeColor1_10,
          colors.themeColor2_10,
          colors.themeColor3_10,
          colors.themeColor4_10,
        ],
        borderWidth: 2,
        data: [
          data?.delivery_status?.sent ? data?.delivery_status?.sent : 0,
          data?.delivery_status?.delivered
            ? data?.delivery_status?.delivered
            : 0,
          data?.delivery_status?.bounced ? data?.delivery_status?.bounced : 0,
          data?.delivery_status?.opened ? data?.delivery_status?.opened : 0,
        ],
      },
    ],
  };

  const handleGenerateClickReport = () => {
    generateTinyUrlReportAction({ id: campaignID });
  };

  useEffect(() => {
    if (tinyUrlReportSuccess) {
      generateTinyUrlReportCleanAction();
      window.location.reload();
    }
  }, [tinyUrlReportSuccess]);

  return (
    <div>
      <Card>
        <Row className="mt-4 pl-3 pr-3">
          <Colxx xxs="12">
            <h2 className="font-weight-bold">
              <IntlMessages id="CAMPAIGN.ANALYTICS.CAMPAIGN_PERFORMANCE" />
            </h2>
          </Colxx>
        </Row>
        <Colxx xxs="12" className="mt-3">
          <span>
            <IntlMessages id="CAMPAIGN.ANALYTICS.DELIVERY_RATE" />
            <span>
              {data?.ab_comparison?.delivery_rate?.value
                ? Number(data?.ab_comparison?.delivery_rate?.value) % 1 !== 0
                  ? Number(data?.ab_comparison?.delivery_rate?.value).toFixed(2)
                  : data?.ab_comparison?.delivery_rate?.value
                : 0}
              {<IntlMessages id="CAMPAIGN.ANALYTICS.PERCENTAGE" />}
            </span>
          </span>
        </Colxx>
        <div className="deliveryStatus">
          <div className="dashboard-campaigns-list">
            <div className="filter-cards-list mb-2 pt-2 pb-2 deliverycard">
              <Card className="filter-card align-items-xs text-center">
                <h4>
                  {data?.delivery_status?.sent
                    ? data?.delivery_status?.sent
                    : 0}
                </h4>
                <h4 className="font-weight-bold">
                  <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.ANALYTICS.LABELS.SENT" />
                </h4>
              </Card>
              <Card className="filter-card align-items-xs text-center">
                <h4>
                  {data?.delivery_status?.delivered
                    ? data?.delivery_status?.delivered
                    : 0}
                </h4>
                <h4 className="font-weight-bold">
                  <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.ANALYTICS.LABELS.DELIVERED" />
                </h4>
              </Card>
              <Card className="filter-card align-items-xs text-center">
                <h4>
                  {data?.delivery_status?.bounced
                    ? data?.delivery_status?.bounced
                    : 0}
                </h4>
                <h4 className="font-weight-bold">
                  <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.ANALYTICS.LABELS.BOUNCED" />
                </h4>
              </Card>
              <Card className="filter-card align-items-xs text-center">
                <h4>
                  {data?.delivery_status?.opened
                    ? data?.delivery_status?.opened
                    : 0}
                </h4>
                <h4 className="font-weight-bold">
                  <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.ANALYTICS.LABELS.OPENED" />
                </h4>
              </Card>
              {(campaignType?.toLowerCase() === CommonEnums.WHATSAPP ||
                campaignType?.toLowerCase() === CommonEnums.SMS) && (
                <div className={runTime === null ? '' : 'mt-4'}>
                  <Card className="filter-card align-items-xs text-center">
                    <h4>
                      {data?.tiny_url_report.length > 0
                        ? data?.tiny_url_report[0]?.clicks
                        : 0}
                    </h4>
                    <h4 className="font-weight-bold">
                      <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.ANALYTICS.LABELS.CLICKED" />
                    </h4>
                  </Card>
                  {runTime === null ? null : (
                    <h6 className="mt-1 text-muted text-center">
                      <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.ANALYTICS.LAST_GENERATED_ON" />
                      {` `}
                      {moment(runTime).format(
                        COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT
                      )}
                    </h6>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      <div className="pieCard">
        <Card>
          <Row className="mt-4 pl-3 pr-3">
            <Colxx xxs="12">
              <h2 className="font-weight-bold">
                <IntlMessages id="CAMPAIGN.ANALYTICS.CAMPAIGN_DELIVERY_STATS" />
              </h2>
            </Colxx>
          </Row>
          <div className="chart-container">
            <AnalyticsPie data={analyticsChartData} />
          </div>
        </Card>
      </div>
      <div className="pieCard">
        <Card>
          <Row className="mt-4 pl-3 pr-3">
            <Colxx xxs="12">
              <h2 className="font-weight-bold">
                <IntlMessages id="CAMPAIGN.ANALYTICS.CAMPAIGN_FAILURE" />
              </h2>
            </Colxx>
          </Row>
          <Row className="pl-5 pb-4 pt-4 ">
            {data?.ab_comparison &&
              Object.entries(data?.ab_comparison).map(
                ([key, values], index) => {
                  return (
                    <React.Fragment key={index}>
                      <Colxx xxs="5" className="segment">
                        <Row>
                          <Colxx xxs="6" className="text-left">
                            <h5 className="pt-3">
                              {getConvertedStringWithSpace(key)}
                            </h5>
                          </Colxx>
                          <Colxx xxs="6" className="text-center">
                            <p className="pt-3">
                              {values.value === null
                                ? 0
                                : Number(values.value) % 1 !== 0
                                ? Number(values.value).toFixed(2)
                                : values.value}
                              {key === CommonEnums.ANALYTICS.DELIVERY_RATE && (
                                <IntlMessages id="CAMPAIGN.ANALYTICS.PERCENTAGE" />
                              )}
                            </p>
                          </Colxx>
                        </Row>
                      </Colxx>
                      <Colxx xxs="1" />
                    </React.Fragment>
                  );
                }
              )}
          </Row>
          {(campaignType?.toLowerCase() === CommonEnums.WHATSAPP ||
            campaignType?.toLowerCase() === CommonEnums.SMS) && (
            <Row>
              <Colxx xxs="6" md="6" className="ml-3 mb-3">
                <Button
                  color="primary"
                  disabled={
                    status === CommonEnums.PENDING ||
                    status === CommonEnums.PROCESSING
                  }
                  onClick={() => handleGenerateClickReport()}
                >
                  <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.ANALYTICS.BUTTON.GENERATE_CLICK_REPORT" />
                </Button>
              </Colxx>
            </Row>
          )}
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const { tinyUrlReport, tinyUrlReportSuccess } = dashboardCampaignsApp;
  return {
    tinyUrlReport,
    tinyUrlReportSuccess,
  };
};

export default connect(mapStateToProps, {
  generateTinyUrlReportAction: generateTinyUrlReport,
  generateTinyUrlReportCleanAction: generateTinyUrlReportClean,
})(AnalyticsData);
