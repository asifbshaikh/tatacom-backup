/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */

import React from 'react';
import { Row, Button, Card, CardBody } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import { Colxx } from 'components/common/CustomBootstrap';

import DataTableView from 'containers/contacts/DataTableView';

import IntlMessages from 'helpers/IntlMessages';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';

function collect(props) {
  return { data: props.data };
}

const ListInboxesListing = ({ items, setModalOpenDelete, setEditFormData }) => {
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'TEAMS_SETTINGS.FORM.NAME.LABEL',
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
        Header: 'TEAMS_SETTINGS.FORM.DESCRIPTION.LABEL',
        accessor: 'description',
        cellClass: 'description-wrap',
      },
      {
        Header: 'TEAMS_SETTINGS.FORM.ACTION.LABEL',
        accessor: '',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return (
            <>
              {props.value}
              <NavLink to={`${adminRoot}/settings/teams/new/${props.row.id}`}>
                <Button color="theme-3" className="icon-button edit-button">
                  <i className="simple-icon-pencil" />
                </Button>
              </NavLink>
              <Button
                // outline
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
              id="TEAMS_SETTINGS.SIDEBAR_TXT"
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

export default React.memo(ListInboxesListing);
