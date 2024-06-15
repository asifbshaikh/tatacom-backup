import DataTableView from 'containers/contacts/DataTableView';
import Pagination from 'containers/pages/Pagination';
import React from 'react';

const AllRecentEventList = ({
  currentPage,
  totalPage,
  onChangePage,
  eventList,
}) => {
  const tableCols = React.useMemo(() => [
    {
      Header: 'RECENT_EVENTS.TABLE_COLUMNS.USER_ID',
      accessor: 'unique_user_id',
    },
    {
      Header: 'RECENT_EVENTS.TABLE_COLUMNS.ACTIVITY_TIME',
      accessor: 'event_time',
    },
    {
      Header: 'RECENT_EVENTS.TABLE_COLUMNS.EVENT_ACTION',
      accessor: 'event_name',
    },
    {
      Header: 'RECENT_EVENTS.TABLE_COLUMNS.EVENT_ATTRIBUTE',
      accessor: 'event_attributes',
      Cell: (props) => {
        return (
          <>
            {Object.entries(props?.value).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong>{' '}
                {typeof value === 'boolean' ? value.toString() : value}
              </li>
            ))}
          </>
        );
      },
    },
  ]);

  return (
    <div className="import-list">
      <div>
        <DataTableView colxxs="12" cols={tableCols} items={eventList} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
    </div>
  );
};

export default AllRecentEventList;
