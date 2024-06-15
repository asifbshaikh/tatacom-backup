/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */

import React from 'react';
import { Row, Button, Card, CardBody, CardTitle } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import { Colxx } from 'components/common/CustomBootstrap';
import DataTableView from 'containers/contacts/DataTableView';
import IntlMessages from 'helpers/IntlMessages';
import Pagination from 'containers/pages/Pagination';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';

function collect(props) {
  return { data: props.data };
}

const ListInboxesListing = ({
  items,
  setModalOpenDelete,
  setEditFormData,
  handlePageChange,
  currentPage,
  totalPageCount,
}) => {
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'inboxes.name',
        accessor: 'name',
        cellClass: 'text-nowrap data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-name-${props.row.id}`}
            />

            <span id={`tooltip-name-${props.row.id}`}>{props.value}</span>
          </>
        ),
      },
      {
        Header: 'inboxes.channel_type',
        accessor: 'channel_name',
        cellClass: 'text-nowrap data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-channelName-${props.row.id}`}
            />

            <span id={`tooltip-channelName-${props.row.id}`}>
              {props.value}
            </span>
          </>
        ),
      },
      {
        Header: 'Action',
        accessor: '',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return (
            <>
              {props.value}
              <NavLink to={`${adminRoot}/settings/inboxes/${props.row.id}`}>
                <Button
                  color="theme-3"
                  className="icon-button ml-1 edit-button"
                >
                  <i className="simple-icon-pencil" />
                </Button>
              </NavLink>
              {!props.row.channel_id && (
                <Button
                  color="theme-3"
                  className="icon-button ml-1 edit-button"
                  onClick={() => {
                    setModalOpenDelete(true);
                    setEditFormData(props.row);
                  }}
                >
                  <i className="simple-icon-trash" />
                </Button>
              )}
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <Row>
        <DataTableView
          colxxs="8"
          cols={tableCols}
          items={items}
          key="ReactTblContacts"
          collect={collect}
        />
        <Colxx xxs="4">
          <Card className="mb-4">
            <CardBody>
              <CardTitle>
                <IntlMessages id="inboxes.help_heading" />
              </CardTitle>
              <p>
                <IntlMessages id="inboxes.help_p1" />
              </p>
              <p>
                <IntlMessages id="inboxes.help_p2" />
              </p>
              <p>
                <IntlMessages id="inboxes.help_p3" />
              </p>
              <p>
                <IntlMessages id="inboxes.help_p4" />
              </p>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="8">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPageCount}
            onChangePage={(i) => handlePageChange(i)}
          />
        </Colxx>
      </Row>
    </>
  );
};

export default React.memo(ListInboxesListing);
