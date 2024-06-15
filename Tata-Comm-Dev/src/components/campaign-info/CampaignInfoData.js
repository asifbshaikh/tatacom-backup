import React, { useEffect, useState } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import CommonEnums from 'enums/commonEnums';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import IntlMessages from 'helpers/IntlMessages';
import { Card, Row } from 'reactstrap';
import { getWhatsAppCampaignTemplatesList } from 'redux/campaigns/actions';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getWhatsAppMessageFormat } from 'helpers/campaignHelper';
import DataTableView from 'containers/contacts/DataTableView';

const CampaignInfoData = ({ data, templateListWADetailedList }) => {
  const campaignType = data?.campaign?.campaign_type;
  const [templateMessage, setTemplateMessage] = useState();
  useEffect(() => {
    const messageArray = templateListWADetailedList?.filter((list) => {
      return list.name === data?.campaign?.message;
    });
    if (messageArray.length > 0) {
      if (messageArray[0]?.components) {
        setTemplateMessage(
          getWhatsAppMessageFormat(messageArray[0]?.components)
        );
      }
    }
  }, [templateListWADetailedList, data]);

  const emailRevisionData = React.useMemo(() => [
    {
      Header: 'DASHBOARD.CAMPAIGN_INFO.LABELS.EMAIL_INFO_LABELS.CONNECTOR',
      accessor: 'smtp_address',
    },
    {
      Header: 'DASHBOARD.CAMPAIGN_INFO.LABELS.EMAIL_INFO_LABELS.FROM',
      accessor: 'from_email_address',
    },
    {
      Header: 'DASHBOARD.CAMPAIGN_INFO.LABELS.EMAIL_INFO_LABELS.REPLY',
      accessor: 'reply_to_email_address',
    },
    {
      Header: 'DASHBOARD.CAMPAIGN_INFO.LABELS.EMAIL_INFO_LABELS.SUBJECT',
      accessor: 'subject',
    },
    {
      Header: 'DASHBOARD.CAMPAIGN_INFO.LABELS.EMAIL_INFO_LABELS.SENDER_NAME',
      accessor: 'sender_name',
    },
  ]);

  const emailList = data?.campaign?.campaign_details
    ? data?.campaign?.campaign_details.map((element) => {
        return {
          smtp_address: data?.campaign?.channel_info?.smtp_address,
          from_email_address: element?.from_email_address,
          reply_to_email_address: element?.reply_to_email_address,
          subject: element?.subject,
          sender_name: element?.sender_name,
        };
      })
    : [];

  return (
    <Card>
      <Row className="campaignInfo1">
        <Colxx className="campaignInfo2">
          <span>
            {data?.campaign ? (
              DashboardEnums[(data?.campaign?.select_audience).toUpperCase()]
            ) : (
              <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.TARGET_AUDIENCE" />
            )}
          </span>
          <p className="mt-4">
            <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.CUSTOM_FILTERS" />
          </p>
        </Colxx>
        <Colxx className="campaignInfo2">
          <span>
            <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.FILTERS" />
          </span>
          <p className="mt-4 font-weight-bold">
            {data?.campaign ? data?.campaign?.segment_filter_description : ''}
          </p>
        </Colxx>
      </Row>
      <Separator className="mb-5" />
      <Row className="mt-4 pl-3 pr-3">
        <Colxx xxs="12">
          <h2 className="font-weight-bold">
            {campaignType && (
              <IntlMessages
                id={`DASHBOARD.CAMPAIGN_INFO.LABELS.${campaignType?.toUpperCase()}_INFO`}
              />
            )}
          </h2>
        </Colxx>
      </Row>
      {campaignType?.toLowerCase() === CommonEnums.EMAIL ? (
        <>
          <div className="segmentList">
            <DataTableView
              cols={emailRevisionData}
              items={emailList}
              key="ReactTblAllSegmentList"
            />
          </div>
        </>
      ) : (
        <>
          <Colxx xxs="12" className="mt-3 " />
          <div className="smssegmentedViewStyle">
            <div className="smssegmentStyleHeader font-weight-bold">
              <IntlMessages id="DASHBOARD.CAMPAIGN_INFO.LABELS.MESSAGE" />
            </div>
            <div className="smssegmentStyle">
              <p className="text-break">
                {campaignType === CommonEnums.WHATSAPP_LABEL && templateMessage
                  ? templateMessage
                  : data?.campaign?.message &&
                    campaignType !== CommonEnums.WHATSAPP_LABEL
                  ? data?.campaign?.message
                  : 'No Message Found'}
              </p>
            </div>
          </div>
        </>
      )}
      {/* Below commented code is for future use */}
      {/* <Separator className="mb-5" />
            <Row className="mt-4 pl-3 pr-3">
              <Colxx xxs="12">
                <h4 className="font-weight-bold">
                  <IntlMessages id="CAMPAIGN.ANALYTICS.CAMPAIGN_GOAL_INFO" />
                </h4>
              </Colxx>
            </Row>
            <Colxx xxs="12" className="mt-3">
              <IntlMessages id="Attribution window: hours" />
            </Colxx>
            <div className="smssegmentStyle3">
              <div className="campaignSegmentedGrid">
                <div className="headingSegment">
                  <h3>Goal Name</h3>
                </div>
                <div className="headingSegment">
                  <h3>Event Name</h3>
                </div>
                <div className="headingSegment">
                  <h3>Attribute Name</h3>
                </div>
                <div className="headingSegment">
                  <h3>Attribute Value</h3>
                </div>
                <div className="segment">
                  <p>Goal1 (Primary Goal)</p>
                </div>
                <div className="segment">
                  <p>orderSuccessful</p>
                </div>
                <div className="segment">
                  {data?.campaign_goals ? <p /> : <p />}
                </div>
                <div className="segment">
                  {data?.campaign_goals ? <p /> : <p />}
                </div>
              </div>
            </div> */}
    </Card>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const {
    createCampaign: { contentConfiguration },
    templateListWADetailedList,
  } = campaignsApp;
  return {
    ...contentConfiguration,
    templateListWADetailedList,
  };
};

export default connect(mapStateToProps, {
  getWACampaignTemplatesList: getWhatsAppCampaignTemplatesList,
})(injectIntl(CampaignInfoData));
