/* eslint-disable react/display-name */
import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, CardBody, CardTitle, Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import RadialProgressCard from 'components/cards/RadialProgressCard';
import { Colxx } from 'components/common/CustomBootstrap';
import ProgressBarWithTitle from './ProgressBarWithTitle';

const SegmentDetailReachability = ({ intl, segReachability }) => {
  const { messages } = intl;
  const byChannels = segReachability?.by_channels;

  return (
    <>
      <Card body className="min-height-second-row reachability-style pt-2 pb-2">
        <CardTitle tag="h2" className="reachabilityTitle font-weight-bold">
          <IntlMessages id="ALL_SEGMENTS.LIST.REACHABILITY" />
        </CardTitle>

        <CardBody className="pt-2 pb-2">
          <Row className="mt-2 circle-progress-parent">
            <Colxx xxs="3" className="d-flex text-align-center">
              <h6 className="mt-2 font-weight-bold">
                <IntlMessages id="ALL_SEGMENTS.LIST.REACHABLE_USERS" />
              </h6>
            </Colxx>
            <Colxx xxs="6" className="radial-card-style">
              <RadialProgressCard
                title={segReachability?.reachable_users_count ?? 0}
                percent={Number(segReachability?.reachability_percentage) ?? 0}
                stylesOptions={{
                  pathColor: '#fff',
                  backgroundColor: '#3e98c7',
                }}
                endText={
                  messages['ALL_SEGMENTS.SEGMENT_ANALYTICS.OF_TOTAL_USER_COUNT']
                }
              />
            </Colxx>
            <Colxx xxs="3" />
          </Row>

          <Row className="mt-3">
            <Colxx xxs="12">
              <h3 className="font-weight-bold">
                <IntlMessages id="ALL_SEGMENTS.SEGMENT_ANALYTICS.REACHABILITY_BY_CHANNEL" />
              </h3>
            </Colxx>
          </Row>

          <Row className="mt-4">
            <Colxx xxs="6">
              <ProgressBarWithTitle
                title={messages['ALL_SEGMENTS.SEGMENT_ANALYTICS.PUSH']}
                percent={Number(
                  byChannels?.push_reachability?.reachability_percentage
                )}
                total={segReachability?.total_users ?? 0}
                outOfValue={byChannels?.push_reachability?.reachable_users ?? 0}
              />
            </Colxx>
            <Colxx xxs="6">
              <ProgressBarWithTitle
                title={messages['ALL_SEGMENTS.SEGMENT_ANALYTICS.EMAIL']}
                percent={Number(
                  byChannels?.email_reachability?.reachability_percentage
                )}
                total={segReachability?.total_users ?? 0}
                outOfValue={
                  byChannels?.email_reachability?.reachable_users ?? 0
                }
              />
            </Colxx>
            <Colxx xxs="6">
              <ProgressBarWithTitle
                title={messages['ALL_SEGMENTS.SEGMENT_ANALYTICS.SMS']}
                percent={Number(
                  byChannels?.sms_reachability?.reachability_percentage
                )}
                total={segReachability?.total_users ?? 0}
                outOfValue={byChannels?.sms_reachability?.reachable_users ?? 0}
              />
            </Colxx>
            <Colxx xxs="6">
              <ProgressBarWithTitle
                title={messages['ALL_SEGMENTS.SEGMENT_ANALYTICS.WHATSAPP']}
                percent={Number(
                  byChannels?.whatsapp_reachability?.reachability_percentage
                )}
                total={segReachability?.total_users ?? 0}
                outOfValue={
                  byChannels?.whatsapp_reachability?.reachable_users ?? 0
                }
              />
            </Colxx>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default injectIntl(SegmentDetailReachability);
