/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardBody, Table } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { adminRoot } from 'constants/defaultValues';

import IntlMessages from 'helpers/IntlMessages';
import DashboardEnums from 'enums/dashboard/dashboardEnums';

const getRowValue = (cell, row) => {
  const accessor = cell.accessor.split('.');
  let myVal = row;
  accessor.forEach((element) => {
    if (myVal !== null && typeof myVal[element] !== 'undefined') {
      myVal = myVal[element];
    } else {
      myVal = '';
    }
  });
  return myVal;
};
const getByDisplayValue = (cell, row) => {
  if (typeof cell.Cell !== 'function') {
    return getRowValue(cell, row);
  }
  return cell.Cell({ value: getRowValue(cell, row), row });
};

const DataTableView = ({ cols, items, colxxs, noHeader, noIntl }) => {
  return (
    <Colxx xxs={colxxs || 12}>
      <Card className="mb-4 white-card">
        <CardBody>
          <Table responsive className="table-style">
            {!noHeader && (
              <thead>
                <tr>
                  {cols.map((column, columnIndex) => (
                    <th
                      key={`th_${columnIndex}`}
                      className={`${column.headerClassName ?? ''} 
                      ${
                        column.isSorted
                          ? column.isSortedDesc
                            ? 'sorted-desc'
                            : 'sorted-asc'
                          : ''
                      }`}
                    >
                      {noIntl ? (
                        column.Header
                      ) : (
                        <IntlMessages id={column.Header} />
                      )}
                      {/* Render the columns filter UI */}
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                      <span />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {items?.map((row, rowIndex) => {
                return (
                  <tr key={`tr_${rowIndex}`}>
                    {cols.map((cell, cellIndex) => (
                      <td key={`td_${cellIndex}`} className={cell.cellClass}>
                        {cellIndex === 0 &&
                        cell.Header ===
                          'DASHBOARD.CAMPAIGN.TABLE_HEADERS.CAMPAIGN_NAME' ? (
                          <NavLink
                            to={
                              row.status.toUpperCase() === DashboardEnums.DRAFT
                                ? `${adminRoot}/campaigns/create-campaign/${row.id}`
                                : `${adminRoot}/dashboards/all-campaigns/campaign/${row.id}`
                            }
                          >
                            <span
                              onMouseEnter={(e) => {
                                e.target.style.color = 'blue';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.color = 'black';
                              }}
                              tabIndex="0"
                              role="button"
                            >
                              {getByDisplayValue(cell, row)}
                            </span>
                          </NavLink>
                        ) : (
                          getByDisplayValue(cell, row)
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Colxx>
  );
};

export default React.memo(DataTableView);
