/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Card, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Form, Formik } from 'formik';
import { Colxx } from 'components/common/CustomBootstrap';
import { adminRoot } from 'constants/defaultValues';
import DataTableView from 'containers/contacts/DataTableView';
import QueryResults from 'components/create-segment/QueryResults';
import {
  clearEditSegmentData,
  getEditSegmentData,
  segmentCreate,
  updateSegment,
  userCountFilterSegmentReset,
} from 'redux/segmentation/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import IntlMessages from 'helpers/IntlMessages';
import {
  createSegmentFiltersInitialValues,
  isExcludeUserSelected,
} from 'data/segments/createSegmentFilterData';
import CustomDialog from './customDialog';
import { userItems } from './all-segmentshelpers';
import CreateSegmentPopover from './create-segment/widgets/CreateSegmentPopover';
import ListCreateSegmentHeading from './create-segment/widgets/ListCreateSegmentHeading';
import { createSegmentvalidationSchema } from '../../../components/create-segment/createSegmentValidationSchema';
import CreateSegmentFilter from 'components/create-segment/CreateSegmentFilter';

const CreateSegment = ({
  match,
  segmentCreateActiom,
  lastExecutedFilterId,
  successSegmentAdd,
  successSegmentUpdate,
  successAdd,
  errorUpdate,
  getEditSegDataAction,
  segmentData,
  updateSegmentAction,
  clearEditSegmentDataAction,
  clearUserCount,
}) => {
  const [searchAllSegments, setSearchAllSegments] = useState('');
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const history = useHistory();
  const { search } = history.location;
  const params = new URLSearchParams(search);
  const segmentId = params.get('segmentId');
  const segmentType = params.get('type');
  const handleSearch = (e) => {
    setSearchAllSegments(e.target.value);
  };
  const handleSubmitSerach = () => {
    setModal(!modal);
  };

  const createSegment = (campaignName, form) => {
    const getFiltersData = isExcludeUserSelected(form.values);
    if (segmentType === 'Edit') {
      updateSegmentAction({
        name: campaignName,
        type: 'Filter',
        source: 'Segmentation',
        filter_id: lastExecutedFilterId,
        created_from: 'direct_from_filter',
        segment_id: segmentId,
        audience_type: form.values.audience_type,
        exclude_users: form.values.exclude_users,
        ...getFiltersData,
      });
    } else {
      segmentCreateActiom({
        name: campaignName,
        type: 'Filter',
        source: 'Segmentation',
        filter_id: lastExecutedFilterId,
        created_from: 'direct_from_filter',
        audience_type: form.values.audience_type,
        exclude_users: form.values.exclude_users,
        ...getFiltersData,
      });
    }
  };
  if (successSegmentAdd || successSegmentUpdate) {
    const successMsg = successSegmentAdd
      ? 'ALL_SEGMENTS.API_SUCCESS_MESSAGE.SEGMEMT_CREATED_SUCCESS'
      : 'ALL_SEGMENTS.API_SUCCESS_MESSAGE.SEGMEMT_UPDATE_SUCCESS';
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      'Success',
      6000,
      null,
      null
    );
    history.push(`${adminRoot}/segments/all-segments`);
  }
  if (successAdd) {
    const success = 'ALL_SEGMENTS.API_SUCCESS_MESSAGE.SUCCESS';
    NotificationManager.success(
      <IntlMessages id={success} />,
      'Success',
      6000,
      null,
      null
    );
    clearUserCount({});
  }
  if (errorUpdate) {
    NotificationManager.error(errorUpdate, 'Error', 6000, null, null);
  }

  useEffect(() => {
    if (segmentId) {
      getEditSegDataAction(segmentId);
    }
    return () => {
      clearEditSegmentDataAction({});
    };
  }, [segmentId]);

  const userSegmentData = React.useMemo(
    () => [
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.USER_NAME',
        accessor: 'userName',
        cellClass: 'list-item-heading w-20',
        // eslint-disable-next-line react/display-name
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
        cellClass: 'text-muted  w-20',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.MOBILE_NUMBER',
        accessor: 'mobileNumber',
        cellClass: 'text-muted  w-20',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.ID_USER',
        accessor: 'id_user',
        cellClass: 'text-muted  w-10',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.DIGO_ENGAGE_ID',
        accessor: 'digoEngageId',
        cellClass: 'text-muted  w-20',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.FIRST_SEEN',
        accessor: 'firstSeen',
        cellClass: 'text-muted  w-40',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.LAST_SEEN',
        accessor: 'lastSeen',
        cellClass: 'text-muted  w-40',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.SEGMENT_DATA.SESSIONS',
        accessor: 'sessions',
        cellClass: 'text-muted  w-40',
        Cell: (props) => <>{props.value}</>,
      },
    ],
    []
  );

  const segmentDataObject = {
    audience_type:
      segmentData?.segment_filter?.audience_type ??
      createSegmentFiltersInitialValues.audience_type,
    exclude_users:
      segmentData?.segment_filter?.exclude_users ??
      createSegmentFiltersInitialValues.exclude_users,
    included_filters:
      segmentData?.segment_filter &&
      Object.keys(segmentData?.segment_filter?.filter_hash.included_filters)
        .length > 0
        ? segmentData?.segment_filter?.filter_hash.included_filters
        : createSegmentFiltersInitialValues.included_filters,
    excluded_filters:
      segmentData?.segment_filter &&
      Object.keys(segmentData?.segment_filter?.filter_hash.excluded_filters)
        .length > 0
        ? segmentData?.segment_filter?.filter_hash.excluded_filters
        : createSegmentFiltersInitialValues.excluded_filters,
  };

  return (
    <Formik
      initialValues={{
        ...createSegmentFiltersInitialValues,
        ...segmentDataObject,
      }}
      validationSchema={createSegmentvalidationSchema}
      validateOnBlur
      validateOnChange
      validateOnMount
      enableReinitialize
    >
      {(form) => (
        <Form className="av-tooltip">
          <CustomDialog open={modal} title="Search" toggle={toggle} size="xl">
            <Colxx xxs="12" md="3" className="mb-5 searchSegements">
              <InputGroup
                className="mb-3 serachInput"
                onSubmit={handleSubmitSerach}
              >
                <Input
                  type="text"
                  placeholder="CREATE_SEGMENT.SEARCH_FILTER"
                  onChange={handleSearch}
                  value={searchAllSegments}
                />
                <InputGroupAddon
                  addonType="append"
                  onClick={handleSubmitSerach}
                >
                  <i className="simple-icon-magnifier" />
                </InputGroupAddon>
              </InputGroup>
            </Colxx>
            <p>
              {`Showing ${
                userItems?.filter((el) =>
                  Object.values(el)?.includes(searchAllSegments)
                )?.length
              } of ${userItems?.length}
              results for ${searchAllSegments}`}
            </p>
            {userSegmentData && userItems ? (
              <div>
                <DataTableView
                  colxxs="12"
                  cols={userSegmentData}
                  items={userItems?.filter((el) =>
                    Object.values(el)?.includes(searchAllSegments)
                  )}
                  key="ReactTblAllSegmentList"
                />
              </div>
            ) : (
              <></>
            )}
          </CustomDialog>
          <ListCreateSegmentHeading
            match={match}
            heading="CREATE_SEGMENT.LIST.CREATE_SEGMENT_HEADER"
            segmentName={
              segmentId &&
              `${
                segmentType && segmentType === 'Duplicate'
                  ? segmentType
                  : '' ?? ''
              }  ${segmentData?.name ?? ''}`
            }
          />
          <div>
            <Card>
              <div className="user-filter">
                <br />
                <CreateSegmentFilter form={form} isCreateSegment={false} />
                <div className="float-right mr-1">
                  <CreateSegmentPopover
                    createSegment={createSegment}
                    form={form}
                    segmentName={segmentId && segmentData?.name}
                    type={segmentType}
                    isFiltersValid={!form.isValid}
                  />
                </div>
              </div>
            </Card>
            <br />
            <br />
            <div className="query-results">
              <QueryResults />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const {
    lastExecutedFilterId,
    successSegmentAdd,
    successSegmentUpdate,
    successAdd,
    errorUpdate,
    editSegmentData,
  } = segmentationApp;
  return {
    lastExecutedFilterId,
    successSegmentAdd,
    successSegmentUpdate,
    successAdd,
    errorUpdate,
    segmentData: editSegmentData,
  };
};
export default connect(mapStateToProps, {
  segmentCreateActiom: segmentCreate,
  getEditSegDataAction: getEditSegmentData,
  updateSegmentAction: updateSegment,
  clearEditSegmentDataAction: clearEditSegmentData,
  clearUserCount: userCountFilterSegmentReset,
})(CreateSegment);
