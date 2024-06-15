/* eslint-disable react/display-name */
import React from 'react';
import { Row, Button } from 'reactstrap';
import SocialLinks from 'components/cards/SocialLinks';
import { getTimeFromTimeStamp } from 'helpers/TringReactHelper';
import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import ContextMenuContainer from '../pages/ContextMenuContainer';
import DataTableView from './DataTableView';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';

function collect(props) {
  return { data: props.data };
}

const ListPageListing = ({
  items,
  onCheckItem,
  onContextMenuClick,
  onContextMenu,
  setModalOpen,
  setModalOpenDelete,
  setModalOpenDetails,
  setEditFormData,
  setModalOpenLabel,
}) => {
  const tableCols = React.useMemo(
    () => [
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.NAME',
        accessor: 'name',
        cellClass: 'text-nowrap name-column-fixed',
        headerClassName: 'name-column-fixed',
        Cell: (props) => {
          let propsVal = props.value;
          propsVal =
            propsVal?.length > 20
              ? propsVal.substring(0, 20).concat('...')
              : propsVal;
          return (
            <>
              <NavLink to={`${adminRoot}/contacts/details/${props.row.id}`}>
                <div
                  className="rt-cell-data column-sticky pr-5"
                  title={props?.value}
                >
                  {propsVal}
                </div>
              </NavLink>
            </>
          );
        },
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.EMAIL_ADDRESS',
        accessor: 'email',
        cellClass: 'hover-effect',

        Cell: (props) => {
          let propsVal = props.value;
          propsVal =
            propsVal?.length > 20
              ? propsVal.substring(0, 20).concat('...')
              : propsVal;
          return (
            <>
              <div
                className="rt-cell-data column-sticky pr-5"
                title={props?.value}
              >
                {propsVal}
              </div>
            </>
          );
        },
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.PHONE_NUMBER',
        accessor: 'phone_number',
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.COMPANY',
        accessor: 'additional_attributes.company_name',
        cellClass: 'hover-effect',
        Cell: (props) => {
          let propsVal = props.value;
          propsVal =
            propsVal?.length > 20
              ? propsVal.substring(0, 20).concat('...')
              : propsVal;
          return (
            <>
              <div
                className="rt-cell-data column-sticky pr-5"
                title={props?.value}
              >
                {propsVal}
              </div>
            </>
          );
        },
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.CITY',
        accessor: 'city',
        cellClass: 'hover-effect',
        Cell: (props) => {
          let propsVal = props.value;
          propsVal =
            propsVal?.length > 20
              ? propsVal.substring(0, 20).concat('...')
              : propsVal;
          return (
            <>
              <div
                className="rt-cell-data column-sticky pr-5"
                title={props?.value}
              >
                {propsVal}
              </div>
            </>
          );
        },
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.COUNTRY',
        accessor: 'country',
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.SOCIAL_PROFILES',
        accessor: 'additional_attributes.social_profiles.facebook',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return <SocialLinks props={props.row} className="mr-2" />;
        },
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.LAST_ACTIVITY',
        accessor: 'last_activity_at',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return getTimeFromTimeStamp(props.value);
        },
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.CONVERSATIONS',
        accessor: 'conversations_count',
        cellClass: 'w-10',
      },
      {
        Header: 'CONTACTS_PAGE.LIST.TABLE_HEADER.ACTION',
        accessor: 'action',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return (
            <>
              <NavLink to={`${adminRoot}/contacts/details/${props.row.id}`}>
                <Button
                  color="theme-3"
                  className="icon-button ml-1 edit-button"
                >
                  <i className="simple-icon-eye" />
                </Button>
              </NavLink>
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
        cols={tableCols}
        items={items}
        key="ReactTblContacts"
        isSelect={false}
        onCheckItem={onCheckItem}
        collect={collect}
        setModalOpen={setModalOpen}
        setModalOpenDetails={setModalOpenDetails}
      />
      <ContextMenuContainer
        onContextMenuClick={onContextMenuClick}
        onContextMenu={onContextMenu}
        setModalOpenLabel={setModalOpenLabel}
      />
    </Row>
  );
};

export default React.memo(ListPageListing);
