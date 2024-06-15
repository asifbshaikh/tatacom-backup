import React from 'react';
import {
  Row,
  Button,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Alert,
  NavLink,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form } from 'formik';
import classNames from 'classnames';
import * as Yup from 'yup';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { injectIntl } from 'react-intl';
import FlowsEnums from 'enums/campaigns/flowsEnums';
import EventTrigger from './EventTrigger';
import FixedTime from './FixedTime';
import FlowExit from './FlowExit';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import ScheduleFlow from './ScheduleFlow';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import Settings from './Settings';
import moment from 'moment';
import { DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY } from 'constants/appConstant';

const FlowConditions = ({ formRef, formError, previous, next }) => {
  const history = useHistory();

  const tabs = [
    {
      id: '1',
      type: FlowsEnums.ON_EVENT_TRIGGER,
      attribute_model: FlowsEnums.ON_EVENT_TRIGGER,
      label: (
        <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.ON_EVENT_TRIGGER" />
      ),
    },
    {
      id: '2',
      type: FlowsEnums.AT_FIXED_TIME,
      attribute_model: FlowsEnums.ON_EVENT_TRIGGER,
      label: (
        <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.AT_FIXED_TIME" />
      ),
    },
    {
      id: '3',
      type: FlowsEnums.FLOW_EXIT,
      attribute_model: FlowsEnums.ON_EVENT_TRIGGER,
      label: (
        <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.ON_FLOW_EXIT" />
      ),
    },
  ];

  const initialValues = {
    enterFlow: FlowsEnums.ON_EVENT_TRIGGER,
    triggerCriteria: {
      included_filters: {
        filter_operator: createSegementEnums.CONDITION.AND,
        filters: [
          {
            filter_operator: createSegementEnums.CONDITION.AND,
            filters: [
              {
                filter_type: createSegementEnums.CONDITION.USER_BEHAVIOR,
                executed: createSegementEnums.CONDITION.TRUE,
                name: '',
                operator: TargetAudienceEnums.AT_LEAST,
                value: TargetAudienceEnums.TIME_VALUE,
                attributes: {
                  filter_operator: createSegementEnums.CONDITION.AND,
                  filters: [],
                },
              },
            ],
          },
        ],
      },
      trigger_relation: TargetAudienceEnums.AFTER,
      trigger_attr: TargetAudienceEnums.IF_ACTION,
      time_value: TargetAudienceEnums.TIME_VALUE,
      time_multiplier: TargetAudienceEnums.TIME_MULTIPLIER,
      trigger_message_type: TargetAudienceEnums.IMMEDIATELY,
    },
    schedule: {
      ends: '',
      endDate: '',
      endTime: '',
      campaignTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
      toggleSettings: false,
    },
    scheduleType: ScheduleAndGoalsEnums.ONE_TIME,
    campaignTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    periodic: {
      sendCampaignType: ScheduleAndGoalsEnums.DAILY,
      sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
      atFixedTime: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format('LT'),
        ends: '',
        on: {
          endDate: moment(new Date()).format(
            DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
          ),
        },
        after: {
          occurrences: '',
        },
      },
      repeatEvery: '',
      repeatOn: ScheduleAndGoalsEnums.DAY_OF_MONTH,
      sendUserTimeZonePassed: '',
      daysOfMonth: [],
      daysOfWeek: [],
      ends: '',
    },
    one_time: {
      sendCampaignType: ScheduleAndGoalsEnums.IMMEDIATELY,
      sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
      atFixedTime: {
        startDate: moment().format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
        sendTime: moment().format('LT'),
      },
    },
  };

  const flowSchema = Yup.object().shape({
    enterFlow: Yup.string(),
    schedule: Yup.object().shape({
      ends: Yup.string(),
      endDate: Yup.string(),
      endTime: Yup.string(),
      sendCampaignType: Yup.string(),
      toggleSettings: Yup.boolean(),
    }),
  });

  const handleSubmit = () => {
    next();
  };

  const handlePreviousBtnClick = () => {
    previous();
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={flowSchema}
        onSubmit={handleSubmit}
        validateOnMount
        validateOnChange
      >
        {(form) => (
          <Form>
            <Row>
              <Colxx xxs="12">
                <h2 className="font-weight-bold">
                  <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.USER_FLOW" />
                </h2>
                <Nav tabs className="card-header-tabs mb-2">
                  {tabs.map((item) => (
                    <NavItem key={item.type}>
                      <NavLink
                        to={`${item.type}`}
                        location={{}}
                        className={`${classNames({
                          active: form.values.enterFlow === item.type,
                          'nav-link pt-112 pb-012': true,
                        })} `}
                        onClick={() => {
                          form.setFieldValue('enterFlow', item.type);
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
              <TabContent activeTab={form.values.enterFlow} className="w-100">
                {tabs.map((item) => {
                  return (
                    <div key={item.type}>
                      {form.values.enterFlow === item.type ? (
                        <TabPane tabId={item.type}>
                          <Card>
                            <CardBody>
                              {formError && formError.errorMsg && (
                                <Alert color="danger" className="rounded">
                                  {formError.errorMsg}
                                </Alert>
                              )}

                              {item.type === FlowsEnums.ON_EVENT_TRIGGER && (
                                <EventTrigger form={form} />
                              )}
                              {item.type === FlowsEnums.AT_FIXED_TIME && (
                                <FixedTime form={form} formError={formError} />
                              )}
                              {item.type === FlowsEnums.FLOW_EXIT && (
                                <FlowExit form={form} />
                              )}

                              {(item.type === FlowsEnums.ON_EVENT_TRIGGER ||
                                item.type === FlowsEnums.FLOW_EXIT) && (
                                <>
                                  <ScheduleFlow form={form} />
                                  <Settings form={form} />
                                </>
                              )}

                              <StepperNavigationButtons
                                className="m-2  md=4"
                                rightBtnLabel={
                                  <IntlMessages id="DRIP_CAMPAIGN.BUTTONS.NEXT" />
                                }
                                handleLeftBtnClick={handlePreviousBtnClick}
                                handleRightBtnClick={() => {
                                  form.handleSubmit();
                                }}
                                rightBtnLabelDisable={
                                  !form.isValid &&
                                  !(Object.keys(form.errors) > 0)
                                }
                                leftBtnLabel={
                                  <IntlMessages id="S3SFTP.BUTTONS.PREVIOUS" />
                                }
                              />
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
          </Form>
        )}
      </Formik>
    </>
  );
};

export default injectIntl(FlowConditions);
