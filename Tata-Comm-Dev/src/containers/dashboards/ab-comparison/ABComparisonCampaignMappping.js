import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState, Suspense, useRef } from 'react';
import { Card, CardBody, CardHeader, Container } from 'reactstrap';
import { connect } from 'react-redux';
import {
  getCampaignAnalytics,
  cleanABComparisonAnalyticsData,
  getAbDashboardCampaign1List,
  getAbDashboardCampaign2List,
} from 'redux/dashboard-campaigns/actions';
import { injectIntl } from 'react-intl';
import { Separator } from 'components/common/CustomBootstrap';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
const CampaignSelection = React.lazy(() =>
  import('components/ab-comparison/CampaignSelection')
);

const ABComparisonCampaignMappping = ({
  intl,
  getAbDashboardCampaign1ListAction,
  getAbDashboardCampaign2ListAction,
  abDashboardCampaign1List,
  abDashboardCampaign2List,
  getDashboardCampaignInfo,
  campaign1Info,
  campaign2Info,
  cleanABComparisonAnalyticsDataAction,
  abCampaign1Pagination,
  abCampaign2Pagination,
}) => {
  const { messages } = intl;
  const CAMPAIGN_1 = DashboardEnums.AB_CAMPAIGN_1,
    CAMPAIGN_2 = DashboardEnums.AB_CAMPAIGN_2;
  const heading1 = 'DASHBOARD.AB_COMPARISON.SELECT_CAMPAIGN_1';
  const heading2 = 'DASHBOARD.AB_COMPARISON.SELECT_CAMPAIGN_2';
  const [campaign1Query, setCampaign1Query] = useState('');
  const [campaign2Query, setCampaign2Query] = useState('');

  const [channel1Value, setChannel1Value] = useState('');
  const [channel2Value, setChannel2Value] = useState('');
  const [campaign1Id, setCampaign1Id] = useState('');
  const [campaign2Id, setCampaign2Id] = useState('');
  const [campaign1Attributes, setCampaign1Attributes] = useState(null);
  const [campaign2Attributes, setCampaign2Attributes] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [ticking] = useState(true);
  const [count, setCount] = useState(0);
  const [campaign1Page, setCampaign1Page] = useState(1);
  const [campaign2Page, setCampaign2Page] = useState(1);
  const timeoutC1Handler = useRef(null);
  const timeoutC2Handler = useRef(null);

  const [campaign1Options, setCampaign1Options] = useState(
    abDashboardCampaign1List || []
  );
  const [campaign2Options, setCampaign2Options] = useState(
    abDashboardCampaign2List || []
  );
  const setFilterCampaignList = (event, type, noReset) => {
    const payload = {
      page: 1,
      selectedPageSize: 10,
      channel_types: event?.value,
      type,
    };
    if (type === CAMPAIGN_1) {
      if (campaign1Query) {
        payload.campaign_name = campaign1Query;
      }
      payload.page = campaign1Page;
      getAbDashboardCampaign1ListAction(payload);
    } else if (type === CAMPAIGN_2) {
      if (campaign2Query) {
        payload.campaign_name = campaign2Query;
      }
      payload.page = campaign2Page;
      getAbDashboardCampaign2ListAction(payload);
    }

    if (!noReset) {
      if (type === CAMPAIGN_1) {
        cleanABComparisonAnalyticsDataAction({ campaign1Info: {} });
      } else {
        cleanABComparisonAnalyticsDataAction({ campaign2Info: {} });
      }
    }
  };

  const getCampaign = (campaignId, selectedType) => {
    if (selectedType === messages[heading1]) {
      setCampaign1Id(campaignId);
    } else {
      setCampaign2Id(campaignId);
    }
  };

  useEffect(() => {
    if (abDashboardCampaign1List && campaign1Page === 1) {
      setCampaign1Options(abDashboardCampaign1List);
    } else {
      setCampaign1Options((prevState) => [
        ...prevState,
        ...abDashboardCampaign1List,
      ]);
    }
  }, [abDashboardCampaign1List]);

  useEffect(() => {
    if (abDashboardCampaign2List && campaign2Page === 1) {
      setCampaign2Options(abDashboardCampaign2List);
    } else {
      setCampaign2Options((prevState) => [
        ...prevState,
        ...abDashboardCampaign2List,
      ]);
    }
  }, [abDashboardCampaign2List]);

  useEffect(() => {
    if (timeoutC1Handler.current) {
      clearTimeout(timeoutC1Handler.current);
    }
    timeoutC1Handler.current = setTimeout(() => {
      if (channel1Value) {
        setCampaign1Page(1);
        setFilterCampaignList(channel1Value, CAMPAIGN_1, true);
      }
    }, 500);
    return () => {
      if (timeoutC1Handler.current) {
        clearTimeout(timeoutC1Handler.current);
      }
    };
  }, [campaign1Query]);

  useEffect(() => {
    if (timeoutC2Handler.current) {
      clearTimeout(timeoutC2Handler.current);
    }
    timeoutC2Handler.current = setTimeout(() => {
      if (channel2Value) {
        setCampaign2Page(1);
        setFilterCampaignList(channel2Value, CAMPAIGN_2, true);
      }
    }, 500);
    return () => {
      if (timeoutC2Handler.current) {
        clearTimeout(timeoutC2Handler.current);
      }
    };
  }, [campaign2Query]);

  useEffect(() => {
    if (channel1Value) {
      setFilterCampaignList(channel1Value, CAMPAIGN_1, true);
    }
  }, [campaign1Page]);

  useEffect(() => {
    if (channel2Value) {
      setFilterCampaignList(channel2Value, CAMPAIGN_2, true);
    }
  }, [campaign2Page]);

  useEffect(() => {
    if (channel1Value) {
      setCampaign1Id('');
      setCampaign1Page(1);
      setFilterCampaignList(channel1Value, CAMPAIGN_1);
    }
  }, [channel1Value]);

  useEffect(() => {
    if (channel2Value) {
      setCampaign2Id('');
      setCampaign2Page(1);
      setFilterCampaignList(channel2Value, CAMPAIGN_2);
    }
  }, [channel2Value]);

  useEffect(() => {
    const apiTimer = setTimeout(() => ticking && setCount(count + 1), 60000);
    return () => {
      clearTimeout(apiTimer);
    };
  });

  useEffect(() => {
    return () => {
      cleanABComparisonAnalyticsDataAction();
    };
  }, []);

  useEffect(() => {
    if (campaign1Id) {
      const payload = {
        campaignID: campaign1Id,
        type: 'Info',
        campaign: '1',
      };
      getDashboardCampaignInfo(payload);
    }
  }, [campaign1Id, count, ticking]);

  useEffect(() => {
    if (campaign2Id) {
      const payload = {
        campaignID: campaign2Id,
        type: 'Info',
        campaign: '2',
      };
      getDashboardCampaignInfo(payload);
    }
  }, [campaign2Id, count, ticking]);

  useEffect(() => {
    if (campaign1Info?.campaign?.campaign_analytics?.ab_comparison) {
      setCampaign1Attributes(
        campaign1Info.campaign.campaign_analytics.ab_comparison
      );
    } else {
      setCampaign1Attributes(null);
    }
    if (campaign2Info?.campaign?.campaign_analytics?.ab_comparison) {
      setCampaign2Attributes(
        campaign2Info.campaign.campaign_analytics.ab_comparison
      );
    } else {
      setCampaign2Attributes(null);
    }
  }, [campaign1Info, campaign2Info]);

  const onScrollToBottom = (campainType) => {
    if (
      campainType === CAMPAIGN_1 &&
      abCampaign1Pagination &&
      abCampaign1Pagination.total_pages &&
      campaign1Page < abCampaign1Pagination.total_pages
    ) {
      setCampaign1Page((prevState) => {
        if (prevState < abCampaign1Pagination.total_pages) {
          return prevState + 1;
        } else {
          return prevState;
        }
      });
    }

    if (
      campainType === CAMPAIGN_2 &&
      abCampaign2Pagination &&
      abCampaign2Pagination.total_pages &&
      campaign2Page < abCampaign2Pagination.total_pages
    ) {
      setCampaign2Page((prevState) => {
        if (prevState < abCampaign2Pagination.total_pages) {
          return prevState + 1;
        } else {
          return prevState;
        }
      });
    }
  };

  useEffect(() => {
    let c1Attributes = [],
      c2Attributes = [];
    if (campaign1Attributes && Object.keys(campaign1Attributes)) {
      c1Attributes = Object.keys(campaign1Attributes);
    }
    if (campaign2Attributes && Object.keys(campaign2Attributes)) {
      c2Attributes = Object.keys(campaign2Attributes);
    }
    setAttributes([...new Set([...c1Attributes, ...c2Attributes])]);
  }, [campaign1Attributes, campaign2Attributes]);

  return (
    <>
      <Container fluid>
        <Card>
          <CardHeader>
            <h2 className="mt-4">
              <b>
                <IntlMessages id="DASHBOARD.AB_COMPARISON.SELECT_CAMPAIGNS" />
              </b>
            </h2>
          </CardHeader>
          <Separator className="mb-5 mx-2 de-seperator-light" />
          <CardBody>
            <table className="table table-borderless de-ab-table">
              <thead className="white-card mb-2">
                <tr>
                  <td>
                    <div className="pt-5 de-selection-label">
                      <p className="my-2">
                        <IntlMessages id="DASHBOARD.AB_COMPARISON.CHANNEL_TYPE" />{' '}
                        :
                      </p>
                      <p className="mt-3 ">
                        <IntlMessages id="DASHBOARD.AB_COMPARISON.CAMPAIGN_NAME" />{' '}
                        :
                      </p>
                    </div>
                  </td>
                  <td>
                    <Suspense fallback={''}>
                      <CampaignSelection
                        sectionTitle="DASHBOARD.AB_COMPARISON.CAMPAIGN_1"
                        heading={heading1}
                        setFilterCampaignList={(e) => {
                          setFilterCampaignList(e, CAMPAIGN_1);
                        }}
                        campaigns={campaign1Options}
                        getCampaign={getCampaign}
                        campaign={campaign1Id}
                        channelValue={channel1Value}
                        campaignQuery={campaign1Query}
                        setChannelValue={setChannel1Value}
                        onCampaignSearch={(query) => {
                          setCampaign1Query(query);
                        }}
                        onScrollBottom={() => {
                          onScrollToBottom(CAMPAIGN_1);
                        }}
                      />
                    </Suspense>
                  </td>
                  <td>
                    <Suspense fallback={''}>
                      <CampaignSelection
                        sectionTitle="DASHBOARD.AB_COMPARISON.CAMPAIGN_2"
                        heading={heading2}
                        setFilterCampaignList={(e) => {
                          setFilterCampaignList(e, CAMPAIGN_2);
                        }}
                        campaigns={campaign2Options}
                        getCampaign={getCampaign}
                        campaign={campaign2Id}
                        channelValue={channel2Value}
                        setChannelValue={setChannel2Value}
                        campaignQuery={campaign2Query}
                        onCampaignSearch={(query) => {
                          setCampaign2Query(query);
                        }}
                        onScrollBottom={() => {
                          onScrollToBottom(CAMPAIGN_2);
                        }}
                      />
                    </Suspense>
                  </td>
                </tr>
              </thead>
              <tbody>
                {attributes?.map((item, index) => {
                  return (
                    <tr key={`ab_compare_${index}`}>
                      <td className="font-weight-bold text-primary bg-white">
                        {/* replace value with label*/}
                        {campaign1Attributes?.[item]?.label ||
                          campaign2Attributes?.[item]?.label ||
                          '-'}
                      </td>
                      <td className="text-center bg-white">
                        {campaign1Attributes && campaign1Attributes?.[item] ? (
                          <>
                            <>{campaign1Attributes[item]?.value ?? 0}</>
                            <>
                              {campaign1Attributes[item].percentage ? '%' : ''}
                            </>
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="text-center bg-white">
                        {campaign2Attributes && campaign2Attributes?.[item] ? (
                          <>
                            <>{campaign2Attributes[item]?.value ?? 0}</>
                            <>
                              {campaign2Attributes[item].percentage ? '%' : ''}
                            </>
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const {
    abDashboardCampaign1List,
    abDashboardCampaign2List,
    loadedDashboardCampaignList,
    campaign1Info,
    campaign2Info,
    abCampaign1Pagination,
    abCampaign2Pagination,
  } = dashboardCampaignsApp;
  return {
    abDashboardCampaign1List,
    abDashboardCampaign2List,
    loadedDashboardCampaignList,
    campaign1Info,
    campaign2Info,
    abCampaign1Pagination,
    abCampaign2Pagination,
  };
};

export default connect(mapStateToProps, {
  getAbDashboardCampaign1ListAction: getAbDashboardCampaign1List,
  getAbDashboardCampaign2ListAction: getAbDashboardCampaign2List,
  getDashboardCampaignInfo: getCampaignAnalytics,
  cleanABComparisonAnalyticsDataAction: cleanABComparisonAnalyticsData,
})(injectIntl(ABComparisonCampaignMappping));
