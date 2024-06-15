/* eslint-disable react/display-name */
import { Colxx } from 'components/common/CustomBootstrap';
import React, { useEffect } from 'react';
import { Row } from 'reactstrap';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getViewSegData } from 'redux/actions';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import SegmentDetailInfo from './SegmentDetailInfo';
import SegmentDetailAnalytics from './SegmentDetailAnalytics';
import SegmentDetailReachability from './SegmentDetailReachability';
import SegmentDetailSampleUsers from './SegmentDetailSampleUsers';
import SegmentDetailEditHistory from './SegmentDetailEditHistory';
import ViewSegmentDetailsHeading from './ViewSegmentDetailsHeading';

const SegmentType = ({ match, viewSegmentAllData, getViewSegDataAction }) => {
  const { segmentionId } = useParams();
  useEffect(() => {
    getViewSegDataAction({ id: segmentionId });
  }, []);

  let sampleUsers = [];
  if (Array.isArray(viewSegmentAllData?.sample_users)) {
    sampleUsers = viewSegmentAllData?.sample_users?.slice(0, 10)?.map((el) => {
      return {
        name: el.name,
        id: el.id,
      };
    });
  }

  return (
    <>
      <div className="segmentTypeContainer">
        <ViewSegmentDetailsHeading
          match={match}
          heading="ALL_SEGMENTS.SEGMENT_INFO"
          segmentName={viewSegmentAllData?.segment_details?.name}
        />

        <Row>
          <Colxx xxs="7" className="mb-5">
            <SegmentDetailInfo
              segType={viewSegmentAllData?.segment_details?.type}
              segDetails={viewSegmentAllData?.segment_details}
            />
          </Colxx>

          <Colxx xxs="5" className="mb-5">
            <SegmentDetailAnalytics
              segType={viewSegmentAllData?.segment_details?.type}
              segAnalytics={viewSegmentAllData?.reachable_users}
            />
          </Colxx>
        </Row>

        <Row className="reachability">
          <Colxx xxs="7" className="mb-5">
            <SegmentDetailReachability
              segReachability={viewSegmentAllData?.reachable_users}
            />
          </Colxx>

          <Colxx xxs="5" className="mb-5">
            <SegmentDetailSampleUsers
              sampleUsers={sampleUsers}
              segmentId={segmentionId}
            />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-5">
            <SegmentDetailEditHistory
              segId={segmentionId}
              segType={viewSegmentAllData?.segment_details?.type}
              revHistoryData={viewSegmentAllData?.revision_history}
            />
          </Colxx>
        </Row>
      </div>
    </>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { usersAfterSegList, viewSegmentData } = segmentationApp;
  return {
    usersAfterSegListData: usersAfterSegList,
    viewSegmentAllData: viewSegmentData,
  };
};

export default connect(mapStateToProps, {
  getViewSegDataAction: getViewSegData,
})(injectIntl(SegmentType));
