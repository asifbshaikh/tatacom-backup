/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable camelcase */

import React from 'react';
// import moment from 'moment';
import {
  Row,
  // Button,
  // Card,
  // CardBody,
  // CardSubtitle,
  Nav,
  // NavItem,
} from 'reactstrap';

// import { getChannelNameFromType } from 'helpers/TringIconHelper';

// import { NavLink } from 'react-router-dom';
// import classnames from 'classnames';
// import { adminRoot } from 'constants/defaultValues';
import { Colxx } from 'components/common/CustomBootstrap';

// import DataTableView from 'containers/contacts/DataTableView';

// import IntlMessages from 'helpers/IntlMessages';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { ThemeColors } from 'helpers/ThemeColors';
import { BarChart } from 'components/charts';
import {
  calculateTrend,
  displayMetric,
  GROUP_BY_FILTER,
} from 'helpers/TringReactHelper';
import ReportStatsCard from './ReportStatsCard';

const OverviewListing = ({
  overview,
  overviewDetails,
  reportKeysUpdated,
  // setModalOpenDelete,
  // setEditFormData,
  activeFirstTab,
  setActiveFirstTab,
  groupByFilterVal,
}) => {
  const groupBy = groupByFilterVal ? GROUP_BY_FILTER[groupByFilterVal] : {};
  const labels = overviewDetails.map((element) => {
    if (groupBy.period === GROUP_BY_FILTER[2].period) {
      const week_date = new Date(fromUnixTime(element.timestamp));
      const first_day = week_date.getDate() - week_date.getDay();
      const last_day = first_day + 6;

      const week_first_date = new Date(week_date.setDate(first_day));
      const week_last_date = new Date(week_date.setDate(last_day));

      return `${format(week_first_date, 'dd/MM/yy')} - ${format(
        week_last_date,
        'dd/MM/yy'
      )}`;
    }
    if (groupBy.period === GROUP_BY_FILTER[3].period) {
      return format(fromUnixTime(element.timestamp), 'MMM-yyyy');
    }
    if (groupBy.period === GROUP_BY_FILTER[4].period) {
      return format(fromUnixTime(element.timestamp), 'yyyy');
    }
    return format(fromUnixTime(element.timestamp), 'dd-MMM-yyyy');
  });
  const data = overviewDetails.map((element) => element.value);

  const colors = ThemeColors();
  const barChartData = {
    // labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    labels,
    datasets: [
      {
        label: activeFirstTab.NAME,
        borderColor: colors.themeColor1,
        backgroundColor: colors.themeColor1_10,
        // data: [456, 479, 324, 569, 702, 600],
        data,
        borderWidth: 2,
      },
      // {
      //     label: 'Desserts',
      //     borderColor: colors.themeColor2,
      //     backgroundColor: colors.themeColor2_10,
      //     data: [364, 504, 605, 400, 345, 320],
      //     borderWidth: 2,
      // },
    ],
  };
  return (
    <Row>
      <Colxx xxs="12" className="zzzzzzzzzzz">
        <Nav tabs className="card-header-tabs mb-2">
          {Object.keys(overview).length > 0 &&
            reportKeysUpdated.map((item) => (
              <ReportStatsCard
                key={item.KEY}
                desc={item.DESC}
                heading={item.NAME}
                // index={item.INDEX}
                // item={item}
                onClick={() => {
                  setActiveFirstTab(item);
                  // refetch data
                }}
                point={displayMetric(overview, item.KEY)}
                trend={calculateTrend(overview, item.KEY)}
                selected={activeFirstTab.KEY === item.KEY}
              />
            ))}
        </Nav>
        <div className="chart-container">
          <BarChart shadow1 data={barChartData} />
        </div>
      </Colxx>
    </Row>
  );
};

export default OverviewListing;
