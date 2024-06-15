import React, { useState } from 'react';
import {
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Alert,
} from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import classNames from 'classnames';
import ScheduleAndGoalsSendCampaignHeader from '../schedule-campaigns/ScheduleAndGoalsSendCampaignHeader';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import ScheduleAndGoalsOneTime from '../schedule-campaigns/ScheduleAndGoalsOneTime';
import ScheduleAndGoalsPeriodic from '../schedule-campaigns/ScheduleAndGoalsPeriodic';
import FlowsEnums from 'enums/campaigns/flowsEnums';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';

const FixedTime = ({ form, formError }) => {
  const tabs = [
    {
      id: '1',
      type: ScheduleAndGoalsEnums.ONE_TIME,
      attribute_model: 'campaign_type_one_type',
      label: <IntlMessages id="S3SFTP.SCHEDULE.ONE_TIME" />,
    },
    {
      id: '2',
      type: ScheduleAndGoalsEnums.PERIODIC,
      attribute_model: 'campaign_type_periodic',
      label: <IntlMessages id="S3SFTP.SCHEDULE.PERIODIC" />,
    },
  ];

  const [showCampaignTimezone, setShowCampaignTimezone] = useState(false);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Nav tabs className="card-header-tabs mb-2">
            {tabs.map((item) => (
              <NavItem key={item.type}>
                <NavLink
                  to={`${item.type}`}
                  location={{}}
                  className={`${classNames({
                    active: form.values.scheduleType === item.type,
                    'nav-link pt-112 pb-012': true,
                  })} `}
                  onClick={() => {
                    form.setFieldValue('scheduleType', item.type);
                  }}
                >
                  {item.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Colxx>
      </Row>
      <Row>
        <TabContent activeTab={form.values.scheduleType} className="w-100">
          {tabs.map((item) => {
            return (
              <div key={item.type}>
                {form.values.scheduleType === item.type ? (
                  <TabPane tabId={item.type}>
                    <Card>
                      <CardBody>
                        {formError && formError.errorMsg && (
                          <Alert color="danger" className="rounded">
                            {formError.errorMsg}
                          </Alert>
                        )}
                        <ScheduleAndGoalsSendCampaignHeader
                          form={form}
                          campaignType={item.type}
                          showCampaignTimezone={showCampaignTimezone}
                          moduleName={S3SFTPImportEnums.MODULE_NAME}
                        />
                        {item.type === ScheduleAndGoalsEnums.ONE_TIME && (
                          <ScheduleAndGoalsOneTime
                            form={form}
                            campaignType={item.type}
                            setShowCampaignTimezone={setShowCampaignTimezone}
                            moduleName={FlowsEnums.MODULE_NAME}
                          />
                        )}
                        {item.type === ScheduleAndGoalsEnums.PERIODIC && (
                          <ScheduleAndGoalsPeriodic
                            form={form}
                            campaignType={item.type}
                            setShowCampaignTimezone={setShowCampaignTimezone}
                            moduleName={S3SFTPImportEnums.MODULE_NAME}
                          />
                        )}
                      </CardBody>
                    </Card>
                  </TabPane>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </TabContent>
      </Row>
    </>
  );
};

export default FixedTime;
