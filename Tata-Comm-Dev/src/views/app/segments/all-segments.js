/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';

import Select from 'react-select';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
  UncontrolledPopover,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import CustomSelectInput from 'components/common/CustomSelectInput';
import Switch from 'rc-switch';
import IntlMessages from 'helpers/IntlMessages';
import { NavLink, useHistory } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import DataTableView from 'containers/contacts/DataTableView';
import {
  getSegmentation,
  saveAppliedFiltersInAllSegment,
  segmentationArchieve,
  userCountFilterSegmentReset,
} from 'redux/segmentation/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import Pagination from 'containers/pages/Pagination';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import { NotificationManager } from 'components/common/react-notifications';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';
import ListAllsegmentsHeading from './ListAllsegmentsHeading';
import ExportUserPopOver from './create-segment/widgets/ExportUserPopOver';
import EditFileSegmentPopOver from './create-segment/widgets/EditFileSegmentPopOver';

function AllSegments({
  match,
  segmentationList,
  getSegmentationAction,
  totalCount,
  archieveSegmentAction,
  archieved,
  saveFiltersAction,
  allSegAppliedFilters,
  clearUserCount,
}) {
  const [archievedSegment, setArchievedSegment] = useState(
    allSegAppliedFilters.toggleFilter
  );
  const [selectedOption, setSelectedOption] = useState(
    allSegAppliedFilters.segmentType
  );
  const [searchAllSegments, setSearchAllSegments] = useState(
    allSegAppliedFilters.searchString
  );
  const [modal, setModal] = useState(false);
  const [updateArchieve, setUpdateArchieve] = useState(false);
  const [archievedMessage, setArchievedMessage] = useState('');
  const [segmentId, setSegmentId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSizes = [10, 15, 20, 25];
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const totalPageCount = Math.ceil(totalCount / selectedPageSize);
  const history = useHistory();

  const toggle = () => setModal(!modal);

  const [openActionMenu, setOpenActionMenu] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showEditFileSegment, setShowEditFileSegment] = useState(false);

  useEffect(() => {
    return () => {
      if (
        !history.location.pathname.includes(
          createSegementEnums.CONDITION.ALL_SEGMENTS
        )
      ) {
        saveFiltersAction({
          searchString: '',
          segmentType: [],
          toggleFilter: false,
        });
      }
    };
  }, []);
  const refresh = () => {
    const selectedFilter = selectedOption.map((val) => val.value);
    const filter = selectedFilter.join();
    const param = {
      pageno: currentPage,
      selectedPageSize,
      query: searchAllSegments !== '' ? searchAllSegments : undefined,
      filter,
      archievedSegment,
    };
    getSegmentationAction(param);
  };
  useEffect(() => {
    saveFiltersAction({
      searchString: searchAllSegments,
      segmentType: selectedOption,
      toggleFilter: archievedSegment,
    });
    refresh();
  }, [
    searchAllSegments,
    selectedOption,
    currentPage,
    archievedSegment,
    updateArchieve,
    selectedPageSize,
  ]);

  const handleAction = () => {
    setOpenActionMenu(!openActionMenu);
  };
  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };
  const archieveSegment = (id) => {
    archieveSegmentAction(id);
    setUpdateArchieve(!updateArchieve);
  };
  const exportSegmentUser = (id) => {
    setSegmentId(id);
    setShowExport(true);
  };
  const handleEditFileSegment = (id, segmentType) => {
    setSegmentId(id);
    if (segmentType === SegmentationEnums.FILTER) {
      history.push(
        `${adminRoot}/segments/create-segment?segmentId=${id}&type=Edit`
      );
    } else {
      setShowEditFileSegment(true);
    }
  };
  if (archieved) {
    refresh();
    const successMsg =
      archievedMessage === 'archieved'
        ? 'ALL_SEGMENTS.API_SUCCESS_MESSAGE.SEGMEMT_ARCHIEVED_SUCCESS'
        : 'ALL_SEGMENTS.API_SUCCESS_MESSAGE.SEGMEMT_UN_ARCHIEVED_SUCCESS';
    NotificationManager.success(
      <IntlMessages id={successMsg} />,
      'Success',
      6000,
      null,
      null
    );
  }

  const segmentsData = React.useMemo(
    () => [
      {
        Header: 'ALL_SEGMENTS.LIST.SEGMENT_NAME',
        accessor: 'name',
        Cell: (props) => {
          let propsVal = props.value;
          propsVal =
            propsVal.length > 20
              ? propsVal.substring(0, 20).concat('...')
              : propsVal;
          return (
            <NavLink
              className="text-primary active1"
              to={`${adminRoot}/segments/all-segments/segment-info/${props.row.id}`}
            >
              <div className="rt-cell-data" title={props.value}>
                {propsVal}
              </div>
            </NavLink>
          );
        },
      },
      {
        Header: 'ALL_SEGMENTS.LIST.SEGMENT_TYPE',
        accessor: 'segment_type',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'ALL_SEGMENTS.LIST.CREATED_ON',
        accessor: 'created_at',
        Cell: (props) => {
          return moment
            .unix(props.value)
            .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT);
        },
      },
      {
        Header: 'ALL_SEGMENTS.LIST.LAST_RUN_TIME',
        accessor: 'last_run_at',
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
        Header: 'ALL_SEGMENTS.LIST.ACTION',
        accessor: 'archieved',
        Cell: (props) => {
          return (
            <>
              {!props.row.archived && (
                <div key={props?.row?.id}>
                  <button
                    id={`_${props?.row?.id}`}
                    type="button"
                    className="simpleButton"
                    onClick={handleAction}
                  >
                    <i className="simple-icon-options-vertical mr-2" />
                  </button>
                  <UncontrolledPopover
                    placement="left-start"
                    target={`_${props?.row?.id}`}
                    trigger="focus"
                    id="listActionPopOver"
                  >
                    <button
                      type="button"
                      className="simpleButton"
                      onClick={() => {
                        history.push(
                          `${adminRoot}/segments/all-segments/segment-info/${props.row.id}`
                        );
                      }}
                    >
                      <IntlMessages id="ALL_SEGMENTS.LIST.VIEW" />
                    </button>

                    <button
                      type="button"
                      className="simpleButton controlledBtn"
                      onClick={() => {
                        handleEditFileSegment(
                          props?.row?.id,
                          props?.row?.segment_type
                        );
                      }}
                    >
                      <IntlMessages id="ALL_SEGMENTS.LIST.EDIT" />
                    </button>
                    <button
                      type="button"
                      className={`simpleButton controlledBtn ${
                        props?.row &&
                        props?.row?.segment_type === SegmentationEnums.FILE
                          ? 'disabled'
                          : ''
                      }`}
                      disabled={
                        props?.row &&
                        props?.row?.segment_type === SegmentationEnums.FILE
                      }
                      onClick={() => {
                        history.push(
                          `${adminRoot}/segments/create-segment?segmentId=${props?.row?.id}&type=Duplicate`
                        );
                      }}
                    >
                      <IntlMessages id="ALL_SEGMENTS.LIST.DUPLICATE" />
                    </button>
                    <button
                      type="button"
                      className="simpleButton"
                      onClick={() => {
                        archieveSegment(props?.row?.id);
                        setArchievedMessage('archieved');
                      }}
                    >
                      <IntlMessages id="ALL_SEGMENTS.LIST.ARCHIVE" />
                    </button>
                    <button
                      type="button"
                      className="simpleButton"
                      onClick={() => {
                        exportSegmentUser(props?.row?.id);
                      }}
                    >
                      <IntlMessages id="ALL_SEGMENTS.LIST.EXPORT_USERS" />
                    </button>
                    <button
                      type="button"
                      className="simpleButton"
                      onClick={() => {
                        clearUserCount();
                        history.push(
                          `${adminRoot}/campaigns/create-campaign?segmentId=${props?.row?.id}`,
                          { segmentName: props?.row?.name }
                        );
                      }}
                    >
                      <IntlMessages id="ALL_SEGMENTS.LIST.CREATE_CAMPIGN" />
                    </button>
                  </UncontrolledPopover>
                </div>
              )}
              {props.row.archived && (
                <button
                  type="button"
                  className="simpleButton btn-secondary"
                  onClick={() => {
                    archieveSegment(props?.row?.id);
                    setArchievedMessage('unArchieved');
                  }}
                >
                  {' '}
                  <IntlMessages id="ALL_SEGMENTS.LIST.UNARCHIVE" />
                </button>
              )}
            </>
          );
        },
      },
    ],
    []
  );
  const selectData = [
    {
      label: 'File',
      value: 'File',
      key: 0,
    },
    {
      label: 'Filter',
      value: 'Filter',
      key: 1,
    },
  ];
  // filter data with search
  const handleSearch = (e) => {
    setSearchAllSegments(e.target.value);
  };

  return (
    <>
      <ListAllsegmentsHeading
        match={match}
        heading="ALL_SEGMENTS.LIST.ALL_SEGMENT_HEADER"
        toggleModal={toggle}
        totalItemCount={totalCount}
        pageSizes={pageSizes}
        changePageSize={handlePageSizeChange}
        selectedPageSize={selectedPageSize}
        startIndex={startIndex}
        endIndex={endIndex}
      />
      <Row className="segmentBody">
        <Colxx xxs="12" md="3" className="mb-3">
          <InputGroup className="mb-3 serachInput">
            <Input
              type="text"
              placeholder="Search All Segments"
              onChange={handleSearch}
              value={searchAllSegments}
            />
            <InputGroupAddon addonType="append">
              <i className="simple-icon-magnifier" />
            </InputGroupAddon>
          </InputGroup>
        </Colxx>
        <Colxx xxs="12" md="3" className="mb-3">
          <Select
            isMulti
            placeholder={
              <IntlMessages id="ALL_SEGMENTS.FILTER.SELECT_SEGMENT_TYPE" />
            }
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            value={selectedOption}
            onChange={(value) => setSelectedOption(value)}
            options={selectData}
          />
        </Colxx>
        <Colxx xxs="12" md="6">
          <div className="archivedSegments">
            <Switch
              id="Archived Segments"
              className="custom-switch custom-switch-primary"
              checked={archievedSegment}
              onChange={(primary) => setArchievedSegment(primary)}
            />
            <Label htmlFor="dusbv" className="mt-2">
              <IntlMessages id="ALL_SEGMENTS.LIST.ARCHIVED_SEGMENTS" />
            </Label>
          </div>
        </Colxx>
      </Row>
      {segmentsData && segmentationList ? (
        <div className="segmentList">
          <DataTableView
            colxxs="14"
            cols={segmentsData}
            items={segmentationList}
            key="ReactTblAllSegmentList"
          />
        </div>
      ) : (
        <></>
      )}
      {showExport && (
        <ExportUserPopOver
          showExport={showExport}
          segmentId={segmentId}
          setShowExport={setShowExport}
        />
      )}
      {showEditFileSegment && (
        <EditFileSegmentPopOver
          showEditFileSegment={showEditFileSegment}
          segmentId={segmentId}
          setShowEditFileSegment={setShowEditFileSegment}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPage={totalPageCount}
        onChangePage={(i) => setCurrentPage(i)}
      />
    </>
  );
}

const mapStateToProps = ({ segmentationApp }) => {
  const {
    segmentationList,
    loadedSegmentation,
    totalCount,
    archieved,
    allSegAppliedFilters,
  } = segmentationApp;
  return {
    segmentationList,
    loadedSegmentation,
    totalCount,
    archieved,
    allSegAppliedFilters,
  };
};
export default connect(mapStateToProps, {
  getSegmentationAction: getSegmentation,
  archieveSegmentAction: segmentationArchieve,
  saveFiltersAction: saveAppliedFiltersInAllSegment,
  clearUserCount: userCountFilterSegmentReset,
})(AllSegments);
