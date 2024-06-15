/* author: Tirouvengadaramanane
Description: Dashboard infoviw page
*/
import React, { useState, useEffect } from 'react';
import { Button, Card, Row } from 'reactstrap';

import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCampaignInfo } from 'redux/dashboard-campaigns/actions';
import { getWhatsAppCampaignTemplatesList } from 'redux/actions';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import ListDashboardCampaignsHeading from 'containers/dashboards/campaigns/ListDashboardCampaignsHeading';
import IntlMessages from 'helpers/IntlMessages';
import AnalyticsData from 'components/campaign-info/AnalyticsData';
import {
  getDateTimeWithFormat,
  getStartDateTimeWithFormat,
} from 'helpers/Utils';
import CampaignInfoData from 'components/campaign-info/CampaignInfoData';
import { getConvertedStringWithSpace } from 'helpers/campaignHelper';
import CommonEnums from 'enums/commonEnums';

const InfoView = ({
  match,
  campaignInfo,
  getDashboardCampaignInfo,
  getWACampaignTemplatesList,
}) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [showRefresh, setShowRefresh] = useState(false);
  const [campaignPage, setCampaignPage] = useState(false);
  const { campaignID } = useParams();

  useEffect(() => {
    const payload = {
      campaignID,
      type: 'Info',
    };
    getDashboardCampaignInfo(payload);
    setCampaignPage(true);
  }, []);

  useEffect(() => {
    if (campaignInfo?.campaign?.campaign_type === CommonEnums.WHATSAPP_LABEL) {
      getWACampaignTemplatesList({
        connectorId: campaignInfo?.campaign?.channel_info?.id,
      });
    }
  }, [campaignInfo]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container">
      <div className="app-row1">
        {activeTab === 'tab1' ? (
          <ListDashboardCampaignsHeading
            heading="DASHBOARD.CAMPAIGN.LABELS.ANALYTICS"
            match={match}
            setShowRefresh={setShowRefresh}
            showRefresh={showRefresh}
            campaignPage={campaignPage}
            campaignID={campaignID}
          />
        ) : (
          <ListDashboardCampaignsHeading
            heading="DASHBOARD.CAMPAIGN.LABELS.CAMPAIGN_INFO"
            match={match}
            setShowRefresh={setShowRefresh}
            showRefresh={showRefresh}
            campaignPage={campaignPage}
            campaignID={campaignID}
          />
        )}
      </div>
      <div>
        <h2>
          {campaignInfo?.campaign ? (
            <>
              <div title={campaignInfo?.campaign?.title}>
                {campaignInfo?.campaign?.title}
              </div>
            </>
          ) : (
            ''
          )}
        </h2>
      </div>
      <Separator className="mb-5" />
      <div className="smsDivStyle1">
        <Card>
          <div className="smsDivStyle1">
            <Row className="mt-4 pl-3 pr-3">
              <Colxx xxs="12">
                <h4 className="font-weight-bold">
                  {campaignInfo?.campaign &&
                    `${
                      CommonEnums[
                        `${(campaignInfo?.campaign?.campaign_type).toUpperCase()}_LABEL`
                      ]
                    } ${
                      campaignInfo?.campaign?.scheduling_type
                        ? `(${getConvertedStringWithSpace(
                            campaignInfo.campaign.scheduling_type
                          )})`
                        : ''
                    } ${
                      campaignInfo?.campaign?.campaign_scheduler
                        ?.schedule_type === CommonEnums.AS_SOON_AS_POSSIBLE ||
                      campaignInfo?.campaign?.campaign_scheduler
                        ?.schedule_type === CommonEnums.AT_SPECIFIC_TIME
                        ? ` - ${getConvertedStringWithSpace(
                            campaignInfo.campaign.campaign_scheduler
                              .schedule_type
                          )}`
                        : ''
                    } ${
                      campaignInfo?.campaign?.campaign_scheduler
                        ?.send_campaign_time
                        ? ` - ${getConvertedStringWithSpace(
                            campaignInfo.campaign.campaign_scheduler
                              .send_campaign_time
                          )}`
                        : ''
                    } ${
                      campaignInfo?.campaign?.campaign_scheduler
                        ?.scheduling_frequency
                        ? `(${getConvertedStringWithSpace(
                            campaignInfo.campaign.campaign_scheduler
                              .scheduling_frequency
                          )})`
                        : ''
                    }`}
                </h4>
              </Colxx>
            </Row>
            <Colxx xxs="12" className="mt-3">
              <div className="campaignInfoHeadingStyle">
                <div className="campaignInfoSegmentStyle">
                  <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.CREATED_ON" />
                  {getDateTimeWithFormat(campaignInfo?.campaign?.created_at)}
                </div>
                <div className="campaignInfoSegmentStyle">
                  <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.STATUS" />
                  {campaignInfo?.campaign?.status}
                </div>
                <div className="campaignInfoSegmentStyle">
                  <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.CONTACT_ATTRIBUTE" />
                  {campaignInfo?.campaign?.selected_contact_attribute}
                </div>
                <div className="campaignInfoSegmentStyle">
                  <IntlMessages id="scheduled time - " />
                  {getStartDateTimeWithFormat(
                    campaignInfo?.campaign?.campaign_scheduler?.start_date
                  )}
                </div>
              </div>
            </Colxx>
          </div>
        </Card>
      </div>
      <Separator className="mb-5" />
      <Colxx xxs="12" md="6">
        <div className="tabStyle">
          <Button
            key="tab1"
            className="mln-2"
            active={activeTab === 'tab1'}
            onClick={() => handleTabClick('tab1')}
            outline
            color="info"
          >
            <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.ANALYTICS" />
          </Button>
          <Button
            key="tab2"
            className="mln-2"
            active={activeTab === 'tab2'}
            onClick={() => handleTabClick('tab2')}
            outline
            color="info"
          >
            <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.CAMPAIGN_INFO" />
          </Button>
        </div>
      </Colxx>
      <div className="tab-content tabContent">
        <div
          className={`tab-pane ${activeTab === 'tab1' ? 'active' : ''}`}
          id="tab1"
        >
          <AnalyticsData
            data={campaignInfo?.campaign?.campaign_analytics}
            campaignType={campaignInfo?.campaign?.campaign_type}
            campaignID={campaignID}
          />
        </div>
        <div
          className={`tab-pane ${activeTab === 'tab2' ? 'active' : ''}`}
          id="tab2"
        >
          <CampaignInfoData data={campaignInfo} />
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const { campaignInfo } = dashboardCampaignsApp;
  return {
    campaignInfo,
  };
};
export default connect(mapStateToProps, {
  getDashboardCampaignInfo: getCampaignInfo,
  getWACampaignTemplatesList: getWhatsAppCampaignTemplatesList,
})(InfoView);
