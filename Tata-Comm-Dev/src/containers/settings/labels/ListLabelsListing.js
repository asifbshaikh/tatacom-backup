/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */

import React from 'react';

import { Row, Button, Card, CardBody } from 'reactstrap';

import { Colxx } from 'components/common/CustomBootstrap';

import DataTableView from 'containers/contacts/DataTableView';

import IntlMessages from 'helpers/IntlMessages';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';

function collect(props) {
  return { data: props.data };
}

const ListLabelsListing = ({
  items,
  setModalOpenDelete,
  setEditFormData,
  setModalOpen,
}) => {
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'LABEL_MGMT.LIST.TABLE_HEADER.0',
        accessor: 'title',
        cellClass: 'text-nowrap data-wrap hover-effect ',
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
        Header: 'LABEL_MGMT.LIST.TABLE_HEADER.1',
        accessor: 'description',
        cellClass: 'description-wrap',
      },
      {
        Header: 'LABEL_MGMT.LIST.TABLE_HEADER.2',
        accessor: 'color',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return (
            <>
              <span
                className="log-indicator align-middle mr-1 "
                style={{
                  backgroundColor: props.value,
                  border: props.value,
                }}
              />
              {props.value}
            </>
          );
        },
      },
      {
        Header: 'LABEL_MGMT.LIST.TABLE_HEADER.3',
        accessor: '',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return (
            <>
              {props.value}
              <Button
                color="theme-3"
                className="icon-button edit-button"
                onClick={() => {
                  setModalOpen(true);
                  setEditFormData(props.row);
                }}
              >
                <i className="simple-icon-pencil" />
              </Button>
              <Button
                color="theme-3"
                className="icon-button edit-button"
                onClick={() => {
                  setModalOpenDelete(true);
                  setEditFormData(props.row);
                }}
              >
                <i className="simple-icon-trash" />
              </Button>
            </>
          );
        },
      },
    ],
    []
  );
  return (
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
            <IntlMessages
              id="LABEL_MGMT.SIDEBAR_TXT"
              values={{
                p: (...chunks) => <p>{chunks}</p>,
                b: (...chunks) => <b>{chunks}</b>,
                linebreak: <br />,
              }}
            />
          </CardBody>
        </Card>
      </Colxx>
    </Row>
  );
};

export default React.memo(ListLabelsListing);
