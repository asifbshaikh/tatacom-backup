/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import DataTableView from 'containers/contacts/DataTableView';
import moment from 'moment';
import { FULL_DATE_TIME_FORMAT } from 'constants/appConstant';
import { Row, UncontrolledPopover } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { getDashboardCampaignsList, getDashboardData } from 'redux/actions';
import {
  getCampaignInfo,
  rescheduleCampaign,
  cancelCampaign,
  pauseCampaign,
  resumeCampaign,
} from 'redux/dashboard-campaigns/actions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import IntlMessages from 'helpers/IntlMessages';
import { networkStatus } from 'helpers/Utils';
import Pagination from 'containers/pages/Pagination';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import { NotificationManager } from 'components/common/react-notifications';
import PageSizeDropDown from './PageSizeDropDown';
import TableFilterCards from './TableFilterCards';
import FilterCampaign from './filterCampaign';
import MoreFiltersPopOver from './MoreFiltersPopOver';

function collect(props) {
  return { data: props.data };
}
function capitalise(word) {
  return word?.charAt(0)?.toUpperCase() + word?.slice(1);
}
const ListDashboardCampaignsData = ({
  items,
  loadedItems,
  campaignStatus,
  metrics,
  pagination,
  getDashboardCampaignsListAction,
  getDashboardDataAction,
  showRefresh,
  campaignTypes,
  channelType,
  campaignName,
  startDate,
  endDate,
  network,
  loading,
  currentPage,
  cancelCampaign,
  pauseCampaign,
  resumeCampaign,
  cancel,
  pause,
  resume,
  getDashboardCampaignInfo,
  campaignInfo,
  setFilters,
  filters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [apply, setApply] = useState(false);
  const [campaignID, setCampaignID] = useState();
  const [actionType, setActionType] = useState();

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };
  const history = useHistory();

  const [selectedPageSize, setPageSizes] = useState(10);
  const pageSizes = [10, 15, 20];
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const totalPageCount = Math.ceil(pagination?.total_count / selectedPageSize);
  useEffect(() => {
    const payload = {
      page: currentPage,
      selectedPageSize,
      filter: campaignStatus,
      moreFilters: filters,
      delivery_types: campaignTypes,
      channel_types: channelType,
      campaign_name: campaignName,
      start_date: startDate,
      end_date: endDate,
    };
    getDashboardCampaignsListAction(payload);
    setApply(false);
  }, [
    currentPage,
    selectedPageSize,
    campaignTypes,
    channelType,
    campaignName,
    campaignStatus,
    showRefresh,
    startDate,
    endDate,
    apply,
    cancel,
    pause,
    resume,
  ]);

  if (networkStatus() === DashboardEnums.OFFLINE) {
    getDashboardDataAction({
      loading: true,
      network: true,
    });
  }

  if (networkStatus() === DashboardEnums.ONLINE) {
    getDashboardDataAction({
      loading: false,
    });
  }

  useEffect(() => {
    if (network) {
      NotificationManager.error(
        <IntlMessages id="DASHBOARD.CAMPAIGN.NETWORK.NETWORK_ERROR" />,
        'Error',
        4000,
        null,
        ''
      );
    }
  }, [network]);

  useEffect(() => {
    if (campaignInfo?.campaign?.inbox_id) {
      campaignAction();
    }
  }, [campaignInfo]);

  const campaignAction = () => {
    const payloadData = {
      action_type: actionType,
      inbox_id: campaignInfo?.campaign?.inbox_id,
    };
    const payload = {
      filter: payloadData,
      id: campaignID,
      payloadData,
    };
    if (actionType === DashboardEnums.CANCEL) {
      cancelCampaign(payload);
    }
    if (actionType === DashboardEnums.PAUSE) {
      pauseCampaign(payload);
    }
    if (actionType === DashboardEnums.RESUME) {
      resumeCampaign(payload);
    }
  };

  const handlePageSizeChange = (size) => {
    setPageSizes(size);
  };

  const handlePageChange = (page) => {
    getDashboardDataAction({ currentPage: page });
  };

  useEffect(() => {
    if (currentPage > pagination?.total_pages && pagination?.total_count != 0) {
      handlePageChange(pagination?.total_pages);
    }
  }, [pagination?.total_pages]);

  const getCampaignData = (props) => {
    const infoPayload = {
      campaignID: props.row.id,
      type: 'Info',
    };
    getDashboardCampaignInfo(infoPayload);
  };

  const tableCols = React.useMemo(() => [
    {
      Header: 'DASHBOARD.CAMPAIGN.TABLE_HEADERS.CAMPAIGN_NAME',
      accessor: 'title',
      Cell: (props) => {
        let propsVal = props.value;
        propsVal =
          propsVal.length > 20
            ? propsVal.substring(0, 20).concat('...')
            : propsVal;
        return <div title={props.value}>{propsVal}</div>;
      },
    },
    {
      Header: 'DASHBOARD.CAMPAIGN.TABLE_HEADERS.CHANNEL',
      accessor: 'campaign_type',
      Cell: (props) =>
        props.value ? <div>{capitalise(props.value)}</div> : '',
    },
    {
      Header: 'DASHBOARD.CAMPAIGN.TABLE_HEADERS.TYPE',
      accessor: 'scheduling_type',
      Cell: (props) =>
        props.value ? <div>{capitalise(props.value)}</div> : '',
    },
    {
      Header: 'DASHBOARD.CAMPAIGN.TABLE_HEADERS.STATUS',
      accessor: 'status',
      Cell: (props) =>
        props.value ? <div>{capitalise(props.value)}</div> : '',
    },
    {
      Header: 'DASHBOARD.CAMPAIGN.TABLE_HEADERS.CREATED',
      accessor: 'created_at',
      Cell: (props) => (
        <div>{moment(props.value * 1000).format(FULL_DATE_TIME_FORMAT)}</div>
      ),
    },
    {
      Header: 'DASHBOARD.CAMPAIGN.TABLE_HEADERS.ACTIONS',
      accessor: '',
      Cell: (props) => (
        <div>
          <button
            type="button"
            id={`PopOver${props.row.id}`}
            onClick={handleOnClick}
            className="simpleButton"
          >
            <i className="simple-icon-options-vertical" />
          </button>
          <UncontrolledPopover
            placement="left-start"
            trigger="legacy"
            target={`PopOver${props.row.id}`}
          >
            <div className="d-flex flex-column pl-1 pr-3 pt-2">
              <button
                type="button"
                className="simpleButton mb-2"
                onClick={() => {
                  history.push(
                    `${adminRoot}/campaigns/create-campaign/${props.row.id}`
                  );
                }}
                hidden={
                  props.row.status.toUpperCase() !== DashboardEnums.DRAFT
                    ? true
                    : false
                }
              >
                <div className="text-left">
                  <IntlMessages id="DASHBOARD.CAMPAIGN.ACTIONS.EDIT" />
                </div>
              </button>
              <button
                type="button"
                className="simpleButton mb-2"
                onClick={() => {
                  history.push(
                    `${adminRoot}/dashboards/all-campaigns/campaign/${props.row.id}`
                  );
                }}
                hidden={
                  props.row.status.toUpperCase() === DashboardEnums.DRAFT
                    ? true
                    : false
                }
              >
                <div className="text-left">
                  <IntlMessages id="DASHBOARD.CAMPAIGN.ACTIONS.VIEW" />
                </div>
              </button>
              <button
                type="button"
                className="simpleButton mb-2"
                onClick={() => {
                  const payload = {
                    filter: DashboardEnums.RESCHEDULE,
                    id: props.row.id,
                  };
                  history.push(
                    `${adminRoot}/campaigns/reschedule-campaign/${props.row.id}`
                  );
                }}
                hidden={
                  props.row.status.toUpperCase() !== DashboardEnums.SCHEDULED
                    ? true
                    : false
                }
              >
                <div className="text-left">
                  <IntlMessages id="DASHBOARD.CAMPAIGN.ACTIONS.RESCHEDULE" />
                </div>
              </button>
              <button
                type="button"
                className="simpleButton mb-2"
                onClick={() => {
                  setCampaignID(props.row.id);
                  getCampaignData(props);
                  setActionType(DashboardEnums.CANCEL);
                }}
                hidden={
                  props.row.status.toUpperCase() !== DashboardEnums.SCHEDULED
                    ? true
                    : false
                }
              >
                <div className="text-left">
                  <IntlMessages id="DASHBOARD.CAMPAIGN.ACTIONS.CANCEL" />
                </div>
              </button>
              <button
                type="button"
                className="simpleButton mb-2"
                onClick={() => {
                  setCampaignID(props.row.id);
                  getCampaignData(props);
                  setActionType(DashboardEnums.PAUSE);
                }}
                hidden={
                  props.row.status.toUpperCase() !== DashboardEnums.SCHEDULED
                    ? true
                    : false
                }
              >
                <div className="text-left">
                  <IntlMessages id="DASHBOARD.CAMPAIGN.ACTIONS.PAUSE" />
                </div>
              </button>
              <button
                type="button"
                className="simpleButton mb-2"
                onClick={() => {
                  setCampaignID(props.row.id);
                  getCampaignData(props);
                  setActionType(DashboardEnums.RESUME);
                }}
                hidden={
                  props.row.status.toUpperCase() !== DashboardEnums.PAUSED
                    ? true
                    : false
                }
              >
                <div className="text-left">
                  <IntlMessages id="DASHBOARD.CAMPAIGN.ACTIONS.RESUME" />
                </div>
              </button>
            </div>
          </UncontrolledPopover>
        </div>
      ),
    },
  ]);

  return !loadedItems || loading ? (
    <div className="loading" />
  ) : (
    <div className="dashboard-campaigns-list">
      {loadedItems && items && (
        <>
          <Row>
            <Colxx xxs="12">
              <PageSizeDropDown
                pageSizes={pageSizes}
                handlePageSizeChange={handlePageSizeChange}
                selectedPageSize={selectedPageSize}
                totalItemCount={pagination?.total_count}
                startIndex={startIndex}
                endIndex={endIndex}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
              />
            </Colxx>
          </Row>
          <Separator className="mt-2 mb-3" />
          <div className="filter-cards-list mb-2 pt-2 pb-2">
            <TableFilterCards
              label={DashboardEnums.ALL}
              active={campaignStatus}
              totalCount={metrics?.all_count}
              handlePageChange={handlePageChange}
              setFilters={setFilters}
            />
            <TableFilterCards
              label={DashboardEnums.ACTIVE}
              active={campaignStatus}
              totalCount={metrics?.active_count}
              handlePageChange={handlePageChange}
              setFilters={setFilters}
            />
            <TableFilterCards
              label={DashboardEnums.SCHEDULE}
              active={campaignStatus}
              totalCount={metrics?.scheduled_count}
              handlePageChange={handlePageChange}
              setFilters={setFilters}
            />
            <TableFilterCards
              label={DashboardEnums.RUN_YESTERDAY}
              active={campaignStatus}
              totalCount={metrics?.ran_yesterday_count}
              handlePageChange={handlePageChange}
              setFilters={setFilters}
            />
            <TableFilterCards
              label={DashboardEnums.DRAFT}
              active={campaignStatus}
              totalCount={metrics?.draft_count}
              handlePageChange={handlePageChange}
              setFilters={setFilters}
            />
          </div>
          <Row>
            <Colxx xxs="12" md="10">
              <Row>
                <FilterCampaign
                  setFilters={setFilters}
                  filters={filters}
                  handlePageChange={handlePageChange}
                />
              </Row>
            </Colxx>
            <Row>
              <Colxx xxs="12">
                <span
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => {}}
                  onClick={() => {
                    setIsShowFilter(!isShowFilter);
                  }}
                  className="font-weight-bold clickable-text user-pointer"
                >
                  <i className="iconsminds-filter-2 campaignInfo3" />
                  <IntlMessages id="DASHBOARD.FILTER.MORE_FILTERS" />
                </span>
              </Colxx>
            </Row>
            {isShowFilter && (
              <MoreFiltersPopOver
                showFilter={isShowFilter}
                setShowFilter={setIsShowFilter}
                status={campaignStatus}
                setFilters={setFilters}
                setApply={setApply}
              />
            )}
            <DataTableView
              colxxs="12"
              cols={tableCols}
              items={items}
              key="ReactTblDashboardCampaignList"
              collect={collect}
            />
            {items?.length < 1 && (
              <Colxx xxs="12" className="text-center">
                <h6>No Data</h6>
              </Colxx>
            )}
          </Row>
          <Row>
            <Colxx xxs="12">
              <Pagination
                currentPage={currentPage}
                totalPage={totalPageCount}
                onChangePage={(i) => handlePageChange(i)}
              />
            </Colxx>
          </Row>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const {
    campaignStatus,
    metrics,
    pagination,
    selectDeliveryType,
    campaignTypes,
    channelType,
    campaignName,
    startDate,
    endDate,
    network,
    loading,
    currentPage,
    campaignInfo,
    cancel,
    pause,
    resume,
  } = dashboardCampaignsApp;
  return {
    campaignStatus,
    metrics,
    pagination,
    selectDeliveryType,
    campaignTypes,
    channelType,
    campaignName,
    startDate,
    endDate,
    network,
    loading,
    currentPage,
    campaignInfo,
    cancel,
    pause,
    resume,
  };
};
export default connect(mapStateToProps, {
  getDashboardCampaignsListAction: getDashboardCampaignsList,
  getDashboardDataAction: getDashboardData,
  getDashboardCampaignInfo: getCampaignInfo,
  rescheduleCampaign,
  cancelCampaign,
  pauseCampaign,
  resumeCampaign,
})(ListDashboardCampaignsData);
