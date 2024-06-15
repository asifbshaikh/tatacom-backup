/* eslint-disable react/display-name */
import DataTableView from 'containers/contacts/DataTableView';
import Pagination from 'containers/pages/Pagination';
import IntlMessages from 'helpers/IntlMessages';
import { getDateTimeWithFormat } from 'helpers/Utils';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

function collect(props) {
  return { data: props.data };
}

const ListPastImportUsers = ({
  items,
  currentPage,
  totalPage,
  onChangePage,
}) => {
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'IMPORT_USERS.LIST.UPLOADED_DATE',
        accessor: 'uploaded_date',
        Cell: (props) => {
          return getDateTimeWithFormat(props.value);
        },
      },
      {
        Header: 'IMPORT_USERS.LIST.FILE_NAME',
        accessor: 'file_name',
      },
      {
        Header: 'IMPORT_USERS.LIST.IMPORT_TYPE',
        accessor: 'import_type',
        Cell: (props) => (
          <div>
            <IntlMessages
              id={`IMPORT_USERS.LIST.DATA.${props.value.toUpperCase()}`}
            />
          </div>
        ),
      },
      {
        Header: 'IMPORT_USERS.LIST.TOTAL_ROWS_IN_FILE',
        accessor: 'total_rows_in_file',
        Cell: (props) => <div className="rt-cell-data">{props.value}</div>,
      },
      {
        Header: 'IMPORT_USERS.LIST.NEW_USERS_ADDED',
        accessor: 'new_users_added',
        Cell: (props) => <div className="rt-cell-data">{props.value}</div>,
      },
      {
        Header: 'IMPORT_USERS.LIST.USERS_UPDATED',
        accessor: 'users_updated',
        Cell: (props) => <div className="rt-cell-data">{props.value}</div>,
      },
      {
        Header: 'IMPORT_USERS.LIST.USERS_FAILED',
        accessor: 'failed_users',
        Cell: (props) => <div className="rt-cell-data">{props.value}</div>,
      },
      {
        Header: 'IMPORT_USERS.LIST.SKIPPED_RECORDS',
        accessor: 'skipped_records',
        Cell: (props) => <div className="rt-cell-data">{props.value}</div>,
      },
      {
        Header: 'IMPORT_USERS.LIST.CUSTOM_SEGMENT',
        accessor: 'custom_segment',
        Cell: (props) => {
          let propsVal = props.value;
          propsVal =
            propsVal.length > 20
              ? propsVal.substring(0, 20).concat('...')
              : propsVal;
          return (
            <div className="rt-cell-data" title={props.value}>
              {propsVal}
            </div>
          );
        },
      },
      {
        Header: 'IMPORT_USERS.LIST.STATUS',
        accessor: 'status',
        Cell: (props) => {
          const { row, value } = props;
          const uploadedDate = row.uploaded_date;
          const isUpdated =
            row.total_rows_in_file === row.new_users_added + row.users_updated;
          return (
            <div>
              <IntlMessages
                id={`IMPORT_USERS.LIST.DATA.${value.toUpperCase()}`}
              />
              {!isUpdated && (
                <>
                  <i
                    id={`tooltip-${uploadedDate}`}
                    className="ml-2 info-icon iconsminds-information"
                  />
                  <UncontrolledTooltip
                    placement="bottom"
                    target={`tooltip-${uploadedDate}`}
                  >
                    <small>
                      <IntlMessages
                        id={`IMPORT_USERS.LIST.TOOLTIP.${value.toUpperCase()}`}
                      />
                    </small>
                  </UncontrolledTooltip>
                </>
              )}
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <div className="import-list">
      {items && (
        <div>
          <DataTableView
            colxxs="12"
            cols={tableCols}
            items={items}
            key="ReactTblImportUserList"
            collect={collect}
          />
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
    </div>
  );
};

export default React.memo(ListPastImportUsers);
