/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */

import React, { useState } from 'react';

import { Row, Button, Card, CardBody, Nav, NavItem } from 'reactstrap';

import { Colxx } from 'components/common/CustomBootstrap';

import DataTableView from 'containers/contacts/DataTableView';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import IntlMessages from 'helpers/IntlMessages';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';

function collect(props) {
  return { data: props.data };
}
const tabs = [
  {
    attribute_model: 'conversation_attribute',
    label: <IntlMessages id="ATTRIBUTES_MGMT.TABS.CONVERSATION" />,
  },
  {
    attribute_model: 'contact_attribute',
    label: <IntlMessages id="ATTRIBUTES_MGMT.TABS.CONTACT" />,
  },
];

const ListAttributesListing = ({
  items,
  setModalOpenDelete,
  setEditFormData,
  setModalOpen,
}) => {
  const [activeFirstTab, setActiveFirstTab] = useState(
    'conversation_attribute'
  );
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'ATTRIBUTES_MGMT.LIST.TABLE_HEADER.0',
        accessor: 'attribute_display_name',
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
        Header: 'ATTRIBUTES_MGMT.LIST.TABLE_HEADER.1',
        accessor: 'attribute_description',
        cellClass: 'description-wrap',
      },
      {
        Header: 'ATTRIBUTES_MGMT.LIST.TABLE_HEADER.2',
        accessor: 'attribute_display_type',
      },
      {
        Header: 'ATTRIBUTES_MGMT.LIST.TABLE_HEADER.3',
        accessor: 'attribute_key',
        cellClass: 'data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-key-${props.row.id}`}
            />
            <span id={`tooltip-key-${props.row.id}`}>{props.value}</span>
          </>
        ),
      },
      {
        Header: 'ATTRIBUTES_MGMT.LIST.TABLE_HEADER.4',
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
    <>
      <Row>
        <Colxx xxs="12">
          <Nav tabs className="card-header-tabs mb-2">
            {tabs.map((item) => (
              <NavItem key={item.attribute_model}>
                <NavLink
                  to="#"
                  location={{}}
                  className={`${classnames({
                    active: activeFirstTab === item.attribute_model,
                    'nav-link pt-112 pb-012': true,
                  })} `}
                  onClick={() => {
                    setActiveFirstTab(item.attribute_model);
                  }}
                >
                  {item.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Colxx>
      </Row>
      <Row>
        <DataTableView
          colxxs="8"
          cols={tableCols}
          items={items.filter(
            (item) => item.attribute_model === activeFirstTab
          )}
          key="ReactTblContacts"
          collect={collect}
        />
        <Colxx xxs="4">
          <Card className="mb-4">
            <CardBody>
              <IntlMessages
                id="ATTRIBUTES_MGMT.SIDEBAR_TXT"
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
    </>
  );
};

export default React.memo(ListAttributesListing);
