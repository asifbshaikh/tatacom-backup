import React from 'react';
import { Card } from 'reactstrap';
import { getDashboardData, setFiltersValue } from 'redux/actions';
import { connect } from 'react-redux';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import Counter from './Counter';

const TableFilterCards = ({
  label,
  duration,
  totalCount,
  active,
  getDashboardAction,
  handlePageChange,
  setFilters,
  setFiltersValue,
  filters,
}) => {
  const getLabel = (title) => {
    switch (title) {
      case DashboardEnums.RUN_YESTERDAY:
        return 'ran_yesterday';
      case DashboardEnums.SCHEDULE:
        return 'scheduled';
      default:
        return title;
    }
  };
  const handleCampaigns = () => {
    const status = getLabel(label);
    if (
      status !== DashboardEnums.ALL &&
      status !== DashboardEnums.RAN_YESTERDAY
    ) {
      setFilters({
        filter: 'both',
        value: [],
        createdBy: filters?.createdBy ? filters?.createdBy : '',
      });
      setFiltersValue({
        value: [],
        createdBy: filters?.createdBy ? filters?.createdBy : '',
      });
    }
    getDashboardAction({ campaignStatus: getLabel(label) });
    handlePageChange(1);
  };
  return (
    <Card
      onClick={handleCampaigns}
      className={`filter-card align-items-sm-stretch text-center ${
        active === getLabel(label) ? DashboardEnums.CARD_ACTIVE : ''
      }`}
    >
      <Counter duration={duration} totalCount={totalCount} />
      <h2 className="font-weight-bold">{label}</h2>
    </Card>
  );
};

const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const { campaignStatus, filters } = dashboardCampaignsApp;
  return {
    campaignStatus,
    filters,
  };
};
export default connect(mapStateToProps, {
  getDashboardAction: getDashboardData,
  setFiltersValue,
})(TableFilterCards);
