import StackedBar from 'components/charts/StackedBar';
import React from 'react';
import { CSAT_RATINGS } from 'helpers/TringReactHelper';
import CommonEnums from 'enums/commonEnums';
import CSATMetricCard from 'components/reports/CSATMetricCard';
import IntlMessages from 'helpers/IntlMessages';

const CSATReport = ({ overview }) => {
  const calculateSatisfactionScore = () => {
    const ratingCount4 = overview?.ratings_count?.['4'] ?? 0;
    const ratingCount5 = overview?.ratings_count?.['5'] ?? 0;

    if (overview?.ratings_count && (ratingCount4 || ratingCount5)) {
      return isNaN(ratingCount4 + ratingCount5) ? (
        <IntlMessages id="CSAT.NO_VALUE" />
      ) : (ratingCount4 + ratingCount5) / overview?.total_count ? (
        (((ratingCount4 + ratingCount5) / overview?.total_count) * 100).toFixed(
          2
        ) + '%'
      ) : (
        <IntlMessages id="CSAT.NO_VALUE" />
      );
    } else {
      return <IntlMessages id="CSAT.NO_VALUE" />;
    }
  };
  const calculateResponseRate = () => {
    return overview.total_count / overview.total_sent_messages_count
      ? (
          (overview.total_count / overview.total_sent_messages_count) *
          100
        ).toFixed(2) + '%'
      : '0.00%';
  };

  return (
    <div className="row csat--metrics-container">
      <CSATMetricCard
        label={CommonEnums.CSAT.LABEL_1}
        labelText={<IntlMessages id="CSAT.LABELTEXT_1" />}
        toolTipInfo={<IntlMessages id="CSAT.TOOLTIP_INFO_1" />}
        position={'bottom'}
        value={
          overview.total_count > 0 ? (
            overview.total_count
          ) : (
            <IntlMessages id="CSAT.NO_VALUE" />
          )
        }
      />
      <CSATMetricCard
        label={CommonEnums.CSAT.LABEL_2}
        labelText={<IntlMessages id="CSAT.LABELTEXT_2" />}
        toolTipInfo={<IntlMessages id="CSAT.TOOLTIP_INFO_2" />}
        position={'bottom'}
        value={calculateSatisfactionScore()}
      />
      <CSATMetricCard
        label={CommonEnums.CSAT.LABEL_3}
        labelText={<IntlMessages id="CSAT.LABELTEXT_3" />}
        toolTipInfo={<IntlMessages id="CSAT.TOOLTIP_INFO_3" />}
        position={'bottom'}
        value={calculateResponseRate()}
      />
      <div className="emoji_bar">
        <div className="emoji">
          {overview.total_count > 0 &&
            CSAT_RATINGS.map((item, index) => {
              return (
                <div key={index} className="pics">
                  <span>{item.emoji}</span>
                  <span className="value">
                    {overview.ratings_count &&
                    !isNaN(
                      (overview.ratings_count[index + 1] /
                        overview.total_count) *
                        100
                    )
                      ? (
                          (overview.ratings_count[index + 1] /
                            overview.total_count) *
                          100
                        ).toFixed(2) + '%'
                      : '0.00%'}
                  </span>
                </div>
              );
            })}
        </div>
        <div className="bar-chart">
          {overview?.ratings_count && (
            <StackedBar data={overview?.ratings_count} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CSATReport;
