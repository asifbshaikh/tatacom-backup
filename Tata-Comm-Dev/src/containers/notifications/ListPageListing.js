/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */

import React, { useEffect } from 'react';
import { Row, Button } from 'reactstrap';

import { getTimeFromTimeStamp } from 'helpers/TringReactHelper';

import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';

import DataTableView from 'containers/contacts/DataTableView';
import IntlMessages from 'helpers/IntlMessages';
import Pagination from '../pages/Pagination';
import { useDispatch } from 'react-redux';
import { setContainerClassnames } from 'redux/actions';
import CommonEnums from 'enums/commonEnums';
import { updateNotificationReadStatus } from 'redux/notifications/actions';
import { Colxx } from 'components/common/CustomBootstrap';
import NotificationEnums from 'enums/notifications/notificationEnums';

const ListPageListing = ({
  items,
  currentPage,
  totalPage,
  onChangePage,
  setModalOpen,
  setModalOpenDetails,
}) => {
  const { MENU_DEFAULT } = CommonEnums;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setContainerClassnames(1, MENU_DEFAULT, true));
  }, []);

  const tableCols = React.useMemo(
    () => [
      {
        accessor: 'primary_actor',
        cellClass: 'text-nowrap',
        Cell: (props) => {
          return (
            <>
              {props?.row?.primary_actor?.id &&
              props.row.primary_actor.id !== NotificationEnums.DELETED ? (
                <NavLink
                  to={
                    props.row.primary_actor.id
                      ? `${adminRoot}/inbox/list/conversations/${props.row?.primary_actor?.id}`
                      : '#'
                  }
                  onClick={() => {
                    const { primary_actor_id, primary_actor_type } = props.row;
                    if (primary_actor_id && primary_actor_type) {
                      dispatch(
                        updateNotificationReadStatus({
                          primary_actor_id: primary_actor_id,
                          primary_actor_type: primary_actor_type,
                        })
                      );
                    }
                  }}
                >
                  #
                  {props.row.primary_actor
                    ? props.row.primary_actor.id
                    : 'deleted'}
                  <Button
                    color="theme-3"
                    className="icon-button ml-1 edit-button"
                  >
                    <i className="simple-icon-eye" />
                  </Button>
                </NavLink>
              ) : (
                <>#{props?.row?.primary_actor?.id}</>
              )}
            </>
          );
        },
      },
      {
        accessor: 'push_message_title',
      },
      {
        accessor: 'notification_type',
        Cell: (props) => {
          return (
            <IntlMessages id={`NOTIFICATIONS_PAGE.TYPE_LABEL.${props.value}`} />
          );
        },
      },
      {
        accessor: 'primary_actor.meta',
        Cell: (props) => {
          return props.row.primary_actor &&
            props.row.primary_actor.meta &&
            props.row.primary_actor.meta.assignee
            ? props.row.primary_actor.meta.assignee.name
            : '';
        },
      },
      {
        accessor: 'created_at',
        Cell: (props) => {
          return getTimeFromTimeStamp(props.value);
        },
      },
      {
        accessor: 'read_at',
        Cell: (props) => {
          return !props.value ? <i className="iconsminds-mail-unread" /> : '';
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
        setModalOpen={setModalOpen}
        setModalOpenDetails={setModalOpenDetails}
        noHeader
      />
      {items?.length < 1 && (
        <Colxx xxs="12" className="text-center">
          <h6>
            <IntlMessages id="NOTIFICATIONS_PAGE.NO_NOTIFICATIONS" />
          </h6>
        </Colxx>
      )}
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
    </Row>
  );
};

export default React.memo(ListPageListing);
