import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { viewQueryDetails } from 'redux/segmentation/actions';
import SegmentDetailReachability from 'views/app/segments/SegmentDetailReachability';
import SegmentDetailSampleUsers from 'views/app/segments/SegmentDetailSampleUsers';

const QueryDetails = ({
  expandedRowId,
  viewQueryDetailsAction,
  queryDetails,
}) => {
  useEffect(() => {
    viewQueryDetailsAction(expandedRowId);
  }, []);
  const sampleUsers = queryDetails?.list_query_result?.sample_users?.slice(
    0,
    10
  );

  const reachabilityPayload = queryDetails?.list_query_result?.reachable_users;

  return (
    <div className="segmentTypeContainer reachability">
      <Row>
        <Col sm="6">
          <SegmentDetailReachability segReachability={reachabilityPayload} />
        </Col>
        <Col sm="6" className="reachability">
          <SegmentDetailSampleUsers
            sampleUsers={sampleUsers}
            queryId={expandedRowId}
          />
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { queryDetails } = segmentationApp;
  return { queryDetails };
};

export default connect(mapStateToProps, {
  viewQueryDetailsAction: viewQueryDetails,
})(QueryDetails);
