/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { Button, Card, CardTitle, Input, NavLink, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { adminRoot } from 'constants/defaultValues';
import moment from 'moment';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import DataTableView from 'containers/contacts/DataTableView';
import { connect } from 'react-redux';
import { getUserAfterSegListData } from 'redux/actions';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import CustomDialog from './customDialog';

const SegmentDetailSampleUsers = ({
  sampleUsers,
  intl,
  queryId,
  segmentId,
  getUserAfterSegAction,
  usersAfterSegList,
}) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
    setFilterType({ name: '', email: '' });
  };
  const [filterType, setFilterType] = useState({ name: '', email: '' });
  const colorsArr = ['#d63548', '#f2d2d2', '#F57C52', '#9D9FA1'];

  const formatText = (name) => {
    return name ? name?.substring(0, 2).toUpperCase() : 'NA';
  };
  const { messages } = intl;
  useEffect(() => {
    if (modal) {
      getUserAfterSegAction({ segmentId, queryId, filterType });
    }
  }, [filterType, modal]);
  const userSegmentData = React.useMemo(
    () => [
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.USER_NAME',
        accessor: 'name',
        cellClass: 'list-item-heading',
        Cell: (props) => {
          return (
            <NavLink
              className="ml-2 text-primary active1"
              to={`${adminRoot}/segments/all-segments/${props.value}`}
            >
              {props.value}
            </NavLink>
          );
        },
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.EMAIL',
        accessor: 'email',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.MOBILE_NUMBER',
        accessor: 'phone_number',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.ID_USER',
        accessor: 'id',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.DIGO_ENGAGE_ID',
        accessor: 'digo_engage_id',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.FIRST_SEEN',
        accessor: 'first_seen',
        cellClass: 'text-muted',
        Cell: (props) => (
          <>
            {props.value
              ? moment
                  .unix(props.value)
                  .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT)
              : ''}
          </>
        ),
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.LAST_SEEN',
        accessor: 'last_seen',
        cellClass: 'text-muted',
        Cell: (props) => (
          <>
            {props.value
              ? moment
                  .unix(props.value)
                  .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT)
              : ''}
          </>
        ),
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.SESSIONS',
        accessor: 'no_of_sessions',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
      },
    ],
    []
  );

  return (
    <>
      <CustomDialog
        open={modal}
        title={messages['ALL_SEGMENTS.SEGMENT_DATA.AUDIENCE_LIST']}
        toggle={toggle}
        size="xl"
        className="user-after-seg-modal"
      >
        {userSegmentData ? (
          <>
            <Row>
              <Colxx xxs="12" className="d-flex mb-4">
                <Colxx xxs="4">
                  <Input
                    type="search"
                    name="keyword"
                    id="search"
                    placeholder={messages['ALL_SEGMENTS.LIST.SEARCH_BY_NAME']}
                    onChange={(e) => {
                      setFilterType({ ...filterType, name: e.target.value });
                    }}
                  />
                </Colxx>
                <Colxx xxs="4">
                  <Input
                    type="search"
                    name="keyword"
                    id="search"
                    placeholder={messages['ALL_SEGMENTS.LIST.SEARCH_BY_EMAIL']}
                    onChange={(e) => {
                      setFilterType({ ...filterType, email: e.target.value });
                    }}
                  />
                </Colxx>
              </Colxx>
            </Row>
            <div>
              <DataTableView
                colxxs="12"
                cols={userSegmentData}
                items={usersAfterSegList}
                key="ReactTblAllSegmentList"
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </CustomDialog>
      <Card body className="min-height-second-row">
        <CardTitle tag="h2" className="reachabilityTitle font-weight-bold">
          <IntlMessages id="ALL_SEGMENTS.LIST.SAMPLE_USERS" />
        </CardTitle>
        <div className="mt-2 simpleUsersBody justify-content-center">
          <div className="simpleUsersContent justify-content-center">
            {sampleUsers?.length > 0 &&
              sampleUsers?.map((el) => {
                return (
                  <NavLink
                    key={el.id}
                    className="ml-2 text-primary1 active1 noPadding"
                    to={`${adminRoot}/segments/all-segments/:userId/${el.id}`}
                  >
                    <p
                      className="simpleUserProfile"
                      style={{
                        background: colorsArr[Math.floor(Math.random() * 4)],
                      }}
                    >
                      {formatText(el?.name)}
                    </p>
                  </NavLink>
                );
              })}
          </div>
          <div className="d-flex show-more-btn">
            {sampleUsers?.length > 0 && (
              <Button
                className="simpleUserShowmore"
                onClick={() => setModal(!modal)}
              >
                <IntlMessages id="ALL_SEGMENTS.LIST.SHOW_MORE" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};
const mapStateToProps = ({ segmentationApp }) => {
  const { usersAfterSegList } = segmentationApp;
  return { usersAfterSegList };
};

export default connect(mapStateToProps, {
  getUserAfterSegAction: getUserAfterSegListData,
})(injectIntl(SegmentDetailSampleUsers));
