import React, { useEffect, useState } from 'react';
import DataTableView from 'containers/contacts/DataTableView';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { FULL_DATE_TIME_FORMAT } from 'constants/appConstant';
import { Row, UncontrolledPopover } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { getDashboardCampaignsList, getDashboardData } from 'redux/actions';
import { connect } from 'react-redux';
import { adminRoot } from 'constants/defaultValues';
import IntlMessages from 'helpers/IntlMessages';
import { networkStatus } from 'helpers/Utils';
import Pagination from 'containers/pages/Pagination';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import { NotificationManager } from 'components/common/react-notifications';
import TableFilterCards from 'containers/dashboards/campaigns/TableFilterCards';
import FilterDripCampaign from './FilterDripCampaign';
import PageSizeDropDown from 'containers/dashboards/campaigns/PageSizeDropDown';

function collect(props) {
  return { data: props.data };
}
function capitalise(word) {
  return word?.charAt(0)?.toUpperCase() + word?.slice(1);
}
const DripCampaignsListing = ({
  match,
  items,
  setModalOpenDelete,
  setEditFormData,
  setModalOpen,
  isOngoingType,
  campaignStatus,
  pagination,
  setFilters,
  filters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  const data = [
    {
      id: 714,
      title: '16OctCamp',
      description: null,
      account_id: 100,
      inbox: {
        id: 184,
        avatar_url: '',
        channel_id: 117,
        name: 117,
        channel_type: 'Channel::Email',
      },
      message: null,
      status: 'Active',
      campaign_type: 'Email',
      trigger_rules: {},
      trigger_only_during_business_hours: false,
      created_at: 1697462602,
      updated_at: 1697462602,
      entry: 'Event Trigerred',
    },
    {
      id: 713,
      title: '16OctCamp',
      description: null,
      account_id: 100,
      inbox: {
        id: 184,
        avatar_url: '',
        channel_id: 117,
        name: 117,
        channel_type: 'Channel::Email',
      },
      message: null,
      status: 'Draft',
      campaign_type: 'Email',
      trigger_rules: {},
      trigger_only_during_business_hours: false,
      created_at: 1697462107,
      updated_at: 1697462107,
      entry: 'Event Trigerred',
    },
    {
      id: 706,
      title: '16OctCamp',
      description: null,
      account_id: 100,
      inbox: {
        id: 184,
        avatar_url: '',
        channel_id: 117,
        name: 117,
        channel_type: 'Channel::Email',
      },
      message: null,
      status: 'Active',
      campaign_type: 'Email',
      trigger_rules: {},
      trigger_only_during_business_hours: false,
      created_at: 1697460048,
      updated_at: 1697460049,
      entry: 'Periodic',
    },
    {
      id: 705,
      title: '16OctCamp',
      description: null,
      account_id: 100,
      inbox: {
        id: 184,
        avatar_url: '',
        channel_id: 117,
        name: 117,
        channel_type: 'Channel::Email',
      },
      message: null,
      status: 'Completed',
      campaign_type: 'Email',
      trigger_rules: {},
      trigger_only_during_business_hours: false,
      created_at: 1697458485,
      updated_at: 1697458485,
      entry: 'Periodic',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedPageSize, setPageSizes] = useState(1);
  const pageSizes = [2, 15, 20]; //need to handle
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const total_count = 4; //need to handle
  const totalPageCount = Math.ceil(total_count / selectedPageSize);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageSizeChange = (size) => {
    setPageSizes(size);
  };

  useEffect(() => {
    if (currentPage > pagination?.total_pages) {
      handlePageChange(pagination?.total_pages);
    }
  }, [pagination?.total_pages]);

  const metrics = {
    all_count: 0,
    active_count: 0,
    ran_yesterday_count: 0,
    draft_count: 0,
  };

  const tableCols = React.useMemo(() => [
    {
      Header: 'DRIP_CAMPAIGN.LIST.TABLE_HEADER.FLOW_NAME',
      accessor: 'title',
    },
    {
      Header: 'DRIP_CAMPAIGN.LIST.TABLE_HEADER.ENTRY_TYPE',
      accessor: 'entry',
    },
    {
      Header: 'DRIP_CAMPAIGN.LIST.TABLE_HEADER.STATUS',
      accessor: 'status',
    },
    {
      Header: 'DRIP_CAMPAIGN.LIST.TABLE_HEADER.CREATED',
      accessor: 'created_at',
      Cell: (props) => (
        <div>{moment(props.value * 1000).format(FULL_DATE_TIME_FORMAT)}</div>
      ),
    },
    {
      Header: 'DRIP_CAMPAIGN.LIST.TABLE_HEADER.PERFORMANCE',
      accessor: '',
    },
    {
      Header: 'DRIP_CAMPAIGN.LIST.TABLE_HEADER.GOALS',
      accessor: '',
    },
    {
      Header: 'DRIP_CAMPAIGN.LIST.TABLE_HEADER.ACTIONS',
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
            id="listActionPopOver"
          >
            <button type="button" className="simpleButton">
              <IntlMessages id="DRIP_CAMPAIGN.ACTIONS.VIEW" />
            </button>

            <button type="button" className="simpleButton">
              <IntlMessages id="DRIP_CAMPAIGN.ACTIONS.DUPLICATE" />
            </button>

            <button type="button" className="simpleButton">
              <IntlMessages id="DRIP_CAMPAIGN.ACTIONS.EDIT" />
            </button>

            <button type="button" className="simpleButton">
              <IntlMessages id="DRIP_CAMPAIGN.ACTIONS.STOP" />
            </button>

            <button type="button" className="simpleButton">
              <IntlMessages id="DRIP_CAMPAIGN.ACTIONS.RETIRE" />
            </button>

            <button type="button" className="simpleButton">
              <IntlMessages id="DRIP_CAMPAIGN.ACTIONS.ARCHIVE" />
            </button>
          </UncontrolledPopover>
        </div>
      ),
    },
  ]);

  return (
    <div className="dashboard-campaigns-list">
      <>
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
              <FilterDripCampaign handlePageChange={handlePageChange} />
            </Row>
          </Colxx>
          <Row>
            <Colxx xxs="12">
              <PageSizeDropDown
                pageSizes={pageSizes}
                handlePageSizeChange={handlePageSizeChange}
                selectedPageSize={selectedPageSize}
                totalItemCount={total_count} // need to handle
                startIndex={startIndex}
                endIndex={endIndex}
              />
            </Colxx>
          </Row>
          <Separator />
          <DataTableView
            colxxs="12"
            cols={tableCols}
            items={data}
            key="ReactTblDashboardCampaignList"
            collect={collect}
          />
          {data?.length < 1 && (
            <Colxx xxs="12" className="text-center">
              <h6>No Flow found for selected filter.</h6>
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
    </div>
  );
};

export default DripCampaignsListing;
