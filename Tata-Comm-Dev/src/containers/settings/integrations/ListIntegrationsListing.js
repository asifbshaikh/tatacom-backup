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

const ListIntegrationsListing = ({
  items,
  setModalOpenDelete,
  setEditFormData,
  setModalOpen,
}) => {
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'INTEGRATION_SETTINGS.WEBHOOK.LIST.TABLE_HEADER.0',
        accessor: 'url',
        cellClass: 'text-nowrap data-wrap hover-effect ',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-endpoint-${props.row.id}`}
            />

            <span id={`tooltip-endpoint-${props.row.id}`}>{props.value}</span>
          </>
        ),
      },
      {
        Header: 'INTEGRATION_SETTINGS.WEBHOOK.LIST.TABLE_HEADER.1',
        accessor: '',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return (
            <>
              {props.value}
              <Button
                color="theme-3"
                className="icon-button ml-1 edit-button"
                onClick={() => {
                  setModalOpen(true);
                  setEditFormData(props.row);
                }}
              >
                <i className="simple-icon-pencil" />
              </Button>
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
              id="INTEGRATION_SETTINGS.WEBHOOK.SIDEBAR_TXT"
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

export default React.memo(ListIntegrationsListing);
