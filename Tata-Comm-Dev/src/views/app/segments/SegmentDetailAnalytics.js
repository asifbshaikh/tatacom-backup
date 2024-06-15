/* eslint-disable react/display-name */
import React from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { DoughnutChart } from 'components/charts';
import { ThemeColors } from 'helpers/ThemeColors';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';

const colors = ThemeColors();

const SegmentDetailAnalytics = ({ intl, segAnalytics, segType }) => {
  const { messages } = intl;

  const pieChartData = Number.isNaN(
    segAnalytics?.reachable_users_count / segAnalytics?.total_users
  )
    ? 0
    : [
        segAnalytics?.reachable_users_count,
        segAnalytics?.total_users - segAnalytics?.reachable_users_count,
      ];
  const doughnutChartData = {
    labels: [
      messages['ALL_SEGMENTS.SEGMENT_ANALYTICS.REACHABLE_USERS'],
      messages['ALL_SEGMENTS.SEGMENT_ANALYTICS.UNREACHABLE_USERS'],
    ],
    datasets: [
      {
        label: '',
        borderColor: [colors.themeColor1, colors.themeColor3],
        backgroundColor: [colors.themeColor1, colors.themeColor3],
        borderWidth: 2,
        data: pieChartData,
      },
    ],
  };

  return (
    <>
      <Card
        body
        className={
          segAnalytics?.total_users !== 0
            ? 'card-height-style'
            : 'card-height-style justify-content-center'
        }
      >
        <Row>
          <Colxx xxs="12">
            <CardBody>
              {segAnalytics?.total_users !== 0 ? (
                <Row>
                  <Colxx xxs="12">
                    <div className="chart-container">
                      <DoughnutChart
                        data={doughnutChartData}
                        options={{
                          legend: {
                            position: 'right',
                            labels: {
                              padding: 30,
                              usePointStyle: true,
                              fontSize: 12,
                            },
                          },
                        }}
                      />
                    </div>
                  </Colxx>
                </Row>
              ) : (
                <></>
              )}

              {segType === SegmentationEnums.FILTER &&
              segAnalytics?.total_users !== 0 ? (
                <Row className="mt-2 d-flex refresh-time">
                  <p>
                    <IntlMessages id="ALL_SEGMENTS.LIST.LAST_REFRESHED_TIME" />
                    <span> - </span>{' '}
                    <span>
                      <strong>
                        {segAnalytics?.last_refreshed_at
                          ? moment
                              .unix(segAnalytics?.last_refreshed_at)
                              .format(
                                COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT
                              )
                          : ''}
                      </strong>
                    </span>
                  </p>
                </Row>
              ) : (
                <></>
              )}

              <Row className="mt-2 d-flex refresh-time">
                {segAnalytics?.total_users !== 0 ? (
                  <p>
                    <strong>
                      <IntlMessages id="ALL_SEGMENTS.SEGMENT_TYPE.TOTAL_USERS" />
                      <span> : </span> <span>{segAnalytics?.total_users}</span>
                    </strong>
                  </p>
                ) : (
                  <h2>
                    <strong>
                      <IntlMessages id="ALL_SEGMENTS.SEGMENT_TYPE.TOTAL_USERS" />
                      <span> : </span> <span>{segAnalytics?.total_users}</span>
                    </strong>
                  </h2>
                )}
              </Row>
            </CardBody>
          </Colxx>
        </Row>
      </Card>
    </>
  );
};

export default injectIntl(SegmentDetailAnalytics);
