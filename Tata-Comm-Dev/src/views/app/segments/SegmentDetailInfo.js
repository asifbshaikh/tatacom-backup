/* eslint-disable react/display-name */
import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import IntlMessages from 'helpers/IntlMessages';
import moment from 'moment';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';

const SegmentDetailInfo = ({ segType, segDetails }) => {
  return (
    <>
      <Card
        body
        className={
          segType === SegmentationEnums.FILTER
            ? 'card-height-filter-style'
            : 'card-height-style'
        }
      >
        <CardBody>
          <div className="customSegmentData">
            <div>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.SEGMENTS_TYPE" />
              </p>
              <p>
                <strong>{segDetails?.type}</strong>
              </p>
            </div>
            <div>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.CREATED_ON" />
              </p>
              <p>
                <strong>
                  {moment
                    .unix(segDetails?.created_on)
                    .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT)}
                </strong>
              </p>
            </div>
          </div>
          <br />
          <div className="customSegmentData">
            <div>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.LAST_RUN_TIME" />
              </p>
              <p>
                <strong>
                  {segDetails?.last_run_at !== 0
                    ? moment
                        .unix(segDetails?.last_run_at)
                        .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT)
                    : ' -- '}
                </strong>
              </p>
            </div>
            <div>
              <p>
                <IntlMessages id="ALL_SEGMENTS.LIST.SOURCE" />
              </p>
              <p>
                <strong>{segDetails?.source_type}</strong>
              </p>
            </div>
          </div>
          <br />
          <div>
            <p>
              <IntlMessages id="ALL_SEGMENTS.LIST.SEG_DESCRIPTION" />
            </p>
            <p>
              <strong>{segDetails?.description}</strong>
            </p>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default SegmentDetailInfo;
