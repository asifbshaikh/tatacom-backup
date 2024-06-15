import React from 'react';
import { Button, Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import DataTableView from 'containers/contacts/DataTableView';
import Pagination from '../../../pages/Pagination';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';

const SMSTemplatesListing = ({
  items,
  setModalOpen,
  setModalOpenDelete,
  setEditFormData,
  setViewData,
  onChangePage,
  currentPage,
  totalPage,
}) => {
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'SMS_TEMPLATE.LIST.TABLE_HEADER.NAME',
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
        Header: 'SMS_TEMPLATE.LIST.TABLE_HEADER.TEMPLATE_ID',
        accessor: 'template_id',
        cellClass: 'text-nowrap data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-id-${props.row.id}`}
            />

            <span id={`tooltip-id-${props.row.id}`}>{props.value}</span>
          </>
        ),
      },
      {
        Header: 'SMS_TEMPLATE.LIST.TABLE_HEADER.PE_ID',
        accessor: 'pe_id',
        cellClass: 'text-nowrap data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-peid-${props.row.id}`}
            />

            <span id={`tooltip-peid-${props.row.id}`}>{props.value}</span>
          </>
        ),
      },
      {
        Header: 'SMS_TEMPLATE.LIST.TABLE_HEADER.TELEMARKETER_ID',
        accessor: 'telemarketer_id',
        cellClass: 'text-nowrap data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-telemarketer-${props.row.id}`}
            />

            <span id={`tooltip-telemarketer-${props.row.id}`}>
              {props.value}
            </span>
          </>
        ),
      },
      {
        Header: 'SMS_TEMPLATE.LIST.TABLE_HEADER.SENDER_ID',
        accessor: 'sender_id',
        cellClass: 'text-nowrap data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-senderId-${props.row.id}`}
            />

            <span id={`tooltip-senderId-${props.row.id}`}>{props.value}</span>
          </>
        ),
      },
      {
        Header: 'SMS_TEMPLATE.LIST.TABLE_HEADER.REGISTERED_DLT',
        accessor: 'registered_dlt',
        cellClass: 'text-nowrap data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-registeredid-${props.row.id}`}
            />

            <span id={`tooltip-registeredid-${props.row.id}`}>
              {props.value}
            </span>
          </>
        ),
      },
      {
        Header: 'SMS_TEMPLATE.LIST.TABLE_HEADER.ACTION',
        accessor: 'action',
        cellClass: 'text-nowrap',
        /* eslint-disable react/display-name */
        Cell: (props) => {
          return (
            <>
              <NavLink to="#">
                <Button
                  color="theme-3"
                  data-testid="view-template-modal"
                  className="icon-button ml-1 edit-button"
                  onClick={() => {
                    setModalOpen(true);
                    setEditFormData(props.row);
                    setViewData(true);
                  }}
                >
                  <i className="simple-icon-eye" />
                </Button>
              </NavLink>
              <Button
                color="theme-3"
                className="icon-button ml-1 edit-button"
                data-testid="edit-template-modal"
                onClick={() => {
                  setModalOpen(true);
                  setEditFormData(props.row);
                }}
              >
                <i className="simple-icon-pencil" />
              </Button>
              <Button
                color="theme-3"
                data-testid="delete-template-modal"
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
    <>
      <Row>
        <DataTableView
          colxxs="12"
          cols={tableCols}
          items={items}
          key="ReactTblTemplates"
          setModalOpen={setModalOpen}
        />
      </Row>
      <Row>
        <Colxx xxs="12">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onChangePage={(i) => onChangePage(i)}
          />
        </Colxx>
      </Row>
    </>
  );
};

export default React.memo(SMSTemplatesListing);
