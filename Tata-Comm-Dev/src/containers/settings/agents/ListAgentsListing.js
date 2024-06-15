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

const ListAgentsListing = ({
  items,
  setModalOpenDelete,
  setEditFormData,
  setModalOpen,
}) => {
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'AGENT_MGMT.LIST.NAME',
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
        Header: 'AGENT_MGMT.LIST.EMAIL',
        accessor: 'email',
        cellClass: 'description-wrap',
      },
      {
        Header: 'AGENT_MGMT.ADD.FORM.AGENT_TYPE.LABEL',
        accessor: 'role',
        Cell: (props) => {
          return (
            <IntlMessages
              id={`AGENT_MGMT.AGENT_TYPES.${props.value.toUpperCase()}`}
            />
          );
        },
      },
      {
        Header: 'AGENT_MGMT.LIST.STATUS',
        accessor: 'confirmed',
        Cell: (props) => {
          return (
            <IntlMessages
              id={`${
                props.value
                  ? 'AGENT_MGMT.LIST.VERIFIED'
                  : 'AGENT_MGMT.LIST.VERIFICATION_PENDING'
              }`}
            />
          );
        },
      },
      {
        Header: 'AGENT_MGMT.LIST.ACTION',
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
                className="icon-button  edit-button"
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
              id="AGENT_MGMT.SIDEBAR_TXT"
              values={{
                p: (...chunks) => <p>{chunks}</p>,
                b: (...chunks) => <b>{chunks}</b>,
              }}
            />
          </CardBody>
        </Card>
      </Colxx>
    </Row>
  );
};

export default React.memo(ListAgentsListing);
