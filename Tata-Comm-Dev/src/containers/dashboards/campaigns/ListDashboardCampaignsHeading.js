/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { getDashboardData, setFiltersValue } from 'redux/actions';
import { getCampaignInfo } from 'redux/dashboard-campaigns/actions';
import { connect } from 'react-redux';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import ListDashboardCampaignsExportPopOver from './ListDashboardCampaignsExportPopOver';

const ListDashboardCampaignsHeading = ({
  match,
  heading,
  setShowRefresh,
  showRefresh,
  getDashboardDataAction,
  setExport,
  showExport,
  setFiltersValue,
  campaignPage,
  getDashboardCampaignInfo,
  campaignID,
  setFilters,
  filters,
}) => {
  const handleReset = () => {
    getDashboardDataAction({
      campaignStatus: DashboardEnums.ALL,
      loadedDashboardCampaignList: false,
      selectChannel: [],
      selectDeliveryType: [],
      selectDateType: [],
      startDate: '',
      endDate: '',
      campaignTypes: [],
      channelType: [],
      campaignName: '',
      currentPage: 1,
    });
    setFiltersValue({});
    setFilters(null);
  };

  const handleRefresh = () => {
    setShowRefresh(!showRefresh);
    getDashboardDataAction({
      loadedDashboardCampaignList: false,
      network: false,
    });

    if (campaignPage && campaignID) {
      const payload = {
        campaignID: campaignID,
        type: 'Info',
      };
      getDashboardCampaignInfo(payload);
    }
  };

  return (
    <Row className="align-items-center">
      <Colxx xxs="12" md="10">
        <h1>
          <IntlMessages id={heading} />
        </h1>
        <Breadcrumb match={match} />
      </Colxx>
      <Colxx xxs="12" md="2">
        <div className="d-flex justify-content-around">
          {heading === 'DASHBOARD.CAMPAIGN.LABELS.ALL_CAMPAIGN_FOR' && (
            <span
              className="d-flex align-items-center button-pointer-cursor"
              onClick={() => handleReset()}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              data-testid="resetBtn"
            >
              <h6 className="d-flex align-items-center font-weight-bold">
                <i className="simple-icon-reload mr-1 " />
                <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.RESET" />
              </h6>
            </span>
          )}
          <span
            className="d-flex align-items-center button-pointer-cursor"
            onClick={() => handleRefresh()}
            role="button"
            tabIndex={0}
            onKeyDown={() => {}}
            data-testid="refreshBtn"
          >
            <h6 className="d-flex align-items-center font-weight-bold ml-3">
              <i className="simple-icon-reload mr-1" />
              <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.REFRESH" />
            </h6>
          </span>
          {heading === 'DASHBOARD.CAMPAIGN.LABELS.ALL_CAMPAIGN_FOR' && (
            <span
              className="d-flex align-items-center button-pointer-cursor"
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              onClick={() => {
                setExport(!showExport);
              }}
            >
              <h6 className="d-flex align-items-center font-weight-bold mr-5 ml-3">
                <i className="simple-icon-share-alt mr-1" />
                <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.EXPORT" />
              </h6>
            </span>
          )}
        </div>
      </Colxx>
      {showExport && (
        <ListDashboardCampaignsExportPopOver
          showExport={showExport}
          setShowExport={setExport}
        />
      )}
    </Row>
  );
};

const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const {
    campaignStatus,
    metrics,
    pagination,
    selectDeliveryType,
    loadedDashboardCampaignList,
    network,
  } = dashboardCampaignsApp;
  return {
    campaignStatus,
    metrics,
    pagination,
    selectDeliveryType,
    loadedDashboardCampaignList,
    network,
  };
};
export default connect(mapStateToProps, {
  getDashboardDataAction: getDashboardData,
  getDashboardCampaignInfo: getCampaignInfo,
  setFiltersValue,
})(ListDashboardCampaignsHeading);
