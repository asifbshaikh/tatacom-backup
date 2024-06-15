import React, { useState as useStateMock } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import ScheduleAndGoals from 'containers/campaigns/schedule-campaigns/ScheduleAndGoals';
import { createRef } from 'react';
import moment from 'moment';
import configureMockStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import CommonEnums from 'enums/commonEnums';

jest.mock('react-timezone-select', () => {
  return function cb() {
    return <div data-testid="react-timezone-mock">Mocked Timezone</div>;
  };
});

jest.mock('redux/campaigns/actions', () => {
  return {
    ...jest.requireActual('redux/campaigns/actions'),
    scheduleSmsCampaign: jest.fn(),
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    campaignID: 128,
  }),
  useRouteMatch: () => ({ url: '/dashboards/all-campaigns/campaign/128' }),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('ScheduleAndGoals component', () => {
  const ref = createRef(null);
  const setShowCampaignTimezone = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation((init) => [init, setShowCampaignTimezone]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockStore = configureMockStore();
  const insitialStateObj = {
    campaignsApp: {
      createCampaign: {
        selectAudience: {
          channelType: CommonEnums.SMS,
          campaignType: 'one_time',
          campaignName: 'Test',
          campaignTags: '',
          selectedUserAttribute: 'email',
          globalControlGroup: false,
          campaignControlGroup: false,
          triggerCriteria: {
            included_filters: {
              filter_operator: 'and',
              filters: [
                {
                  filter_operator: 'and',
                  filters: [
                    {
                      filter_type: 'user_behavior',
                      executed: true,
                      operator: 'at_least',
                      value: 1,
                      attributes: {
                        filter_operator: 'and',
                        filters: [],
                      },
                    },
                  ],
                },
              ],
            },
            trigger_relation: 'after',
            trigger_attr: 'If Action',
            time_value: 1,
            time_multiplier: 60,
            trigger_message_type: 'immediately',
          },
          audience_type: 'allUsers',
          exclude_users: false,
          included_filters: {
            filter_operator: 'and',
            filters: [
              {
                filter_operator: 'or',
                filter_type: 'nested_filters',
                filters: [
                  {
                    filter_type: 'all_users',
                    name: 'All Users',
                    id: 'digo_all_users',
                  },
                ],
              },
            ],
          },
          excluded_filters: {
            filter_operator: 'and',
            filters: [
              {
                filter_operator: 'or',
                filter_type: 'nested_filters',
                filters: [
                  {
                    filter_type: 'filterByUsers',
                  },
                ],
              },
            ],
          },
          stepIndex: 2,
          segmentId: '',
          queryId: '',
          inAppTriggerCriteria: '',
        },
        contentConfiguration: {
          category: '',
        },
        scheudleAndGoals: {
          schedule_type: '',
          start_date: moment(new Date()).format('DD MMMM YYYY'),
          end_date: moment(new Date()).format('DD MMMM YYYY'),
          campaign_time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          occurrences: 1,
          repeat_on_day_of_week: ['Tuesday'],
          repeat_on_day_of_month: [1, 6],
          repeat_every: 1,
        },
      },
      successAdd: true,
      errorAdd: { errorMsg: 'Invalid data' },
      stepIndex: 4,
      convertedTinyUrls: [],
      convertedPersonalizedMsg: '',
      inboxId: 9,
      formEmailCreation: { bcc: '', cc: '', emailConnector: '' },
      saveAsDraftResponse: {},
      emailTemplate: null,
    },
    segmentationApp: {
      lastExecutedFilterId: 175,
    },
    dashboardCampaignsApp: {
      campaignInfo: {},
    },
  };

  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <ScheduleAndGoals formRef={ref} previous={jest.fn()} />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('render one time component', () => {
    const formError = { errorMsg: 'render failed' };
    const { getByText } = render(
      <CustomWrapper>
        <ScheduleAndGoals
          formRef={ref}
          previous={jest.fn()}
          campaignType="one_time"
          formSuccess={true}
          formError={formError}
        />
      </CustomWrapper>
    );
    expect(getByText(/Send Message Immediately/i)).toBeInTheDocument();
  });

  it('render periodic component', () => {
    const formError = {};
    const { getByText } = render(
      <CustomWrapper>
        <ScheduleAndGoals
          formRef={ref}
          previous={jest.fn()}
          campaignType="periodic"
          formError={formError}
        />
      </CustomWrapper>
    );
    expect(getByText(/send in user time zone/i)).toBeInTheDocument();
  });
  it('render event triggered component', () => {
    const formError = {};
    const { getByText } = render(
      <CustomWrapper>
        <ScheduleAndGoals
          formRef={ref}
          previous={jest.fn()}
          campaignType="event_trigger"
          formError={formError}
        />
      </CustomWrapper>
    );
    expect(getByText(/Start Date/i)).toBeInTheDocument();
  });
  it('previous and publish buttons click', () => {
    const { getByRole } = render(
      <CustomWrapper>
        <ScheduleAndGoals
          formRef={ref}
          previous={jest.fn()}
          campaignType="event_trigger"
        />
      </CustomWrapper>
    );

    const previousBtn = getByRole('button', {
      name: /Previous/i,
    });
    const PublishBtn = getByRole('button', {
      name: /Publish/i,
    });

    fireEvent.click(previousBtn);
    fireEvent.click(PublishBtn);

    expect(previousBtn).toBeValid();
    expect(previousBtn).toBeValid();
  });

  it('handles form submission with immediate scheduling for SMS', async () => {
    const mockData = {
      channelType: CommonEnums.SMS,
      smsSender: '12346677',
      templateRecordId: '80',
      message: 'Hello World http://wwww.google.com',
      actualMessage: 'Hello World http://wwww.google.com',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '123455678932',
      testUserAttribute: 'mobileNumber',
      testUserValue: '',
      personalisedParam: {
        fieldsArray: [],
      },
      defaultmessage: '',
      campaignTimeZone: 'Asia/Calcutta',
      campaignType: 'one_time',
      deliveryControl: {
        ignoreFrequencyCapping: false,
        countFrequencyCapping: false,
        requestLimit: '',
      },
      one_time: {
        sendCampaignType: 'Immediately',
        sendCampaignTime: 'at_fixed_time',
        atFixedTime: {
          startDate: '20 December 2023',
          sendTime: '2:15 PM',
        },
      },
    };
    const initialState = { ...insitialStateObj };
    const store = mockStore(initialState);

    render(
      <CustomWrapper>
        <ScheduleAndGoals
          {...mockData}
          formRef={ref}
          scheduleCampaign={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          campaignType="one_time"
          formSuccess={true}
          reschedule={false}
          store={store}
        />
      </CustomWrapper>
    );

    const publishBtn = screen.getByRole('button', {
      name: /Publish/i,
    });
    await act(async () => {
      fireEvent.click(publishBtn);
      expect(publishBtn).toBeValid();
    });
  });

  it('handles form submission with immediate Rescheduling for SMS', async () => {
    const initialState = { ...insitialStateObj };
    const store = mockStore(initialState);
    const mockData = {
      channelType: CommonEnums.SMS,
      smsSender: '12346677',
      templateRecordId: '80',
      message: 'Hello World http://wwww.google.com',
      actualMessage: 'Hello World http://wwww.google.com',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '123455678932',
      testUserAttribute: 'mobileNumber',
      testUserValue: '',
      personalisedParam: {
        fieldsArray: [],
      },
      defaultmessage: '',
      campaignTimeZone: 'Asia/Calcutta',
      campaignType: 'one_time',
      deliveryControl: {
        ignoreFrequencyCapping: false,
        countFrequencyCapping: false,
        requestLimit: '',
      },
      one_time: {
        sendCampaignType: 'Immediately',
        sendCampaignTime: 'at_fixed_time',
        atFixedTime: {
          startDate: '20 December 2023',
          sendTime: '2:15 PM',
        },
      },
    };
    render(
      <CustomWrapper>
        <ScheduleAndGoals
          {...mockData}
          formRef={ref}
          scheduleCampaign={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          campaignType="one_time"
          formSuccess={true}
          reschedule={true}
          store={store}
        />
      </CustomWrapper>
    );

    const rescheduleBtn = screen.getByRole('button', {
      name: /Reschedule/i,
    });
    await act(async () => {
      fireEvent.click(rescheduleBtn);
      expect(rescheduleBtn).toBeValid();
    });
  });

  it('handles form submission with atspecifictime scheduling for SMS', async () => {
    const initialState = {
      ...insitialStateObj,
      campaignsApp: {
        createCampaign: {
          scheudleAndGoals: {
            schedule_type: 'at_specific_time',
            start_date: moment(new Date()).format('DD MMMM YYYY'),
            send_campaign_time: 'at_fixed_time',
          },
        },
      },
    };
    const mockData = {
      channelType: CommonEnums.SMS,
      smsSender: '12346677',
      templateRecordId: '80',
      message: 'Hello World http://wwww.google.com',
      actualMessage: 'Hello World http://wwww.google.com',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '123455678932',
      testUserAttribute: 'mobileNumber',
      testUserValue: '',
      personalisedParam: {
        fieldsArray: [],
      },
      defaultmessage: '',
      campaignTimeZone: 'Asia/Calcutta',
      campaignType: 'one_time',
      deliveryControl: {
        ignoreFrequencyCapping: false,
        countFrequencyCapping: false,
        requestLimit: '',
      },
      one_time: {
        sendCampaignType: 'at_specific_date_and_time',
        sendCampaignTime: 'at_fixed_time',
        atFixedTime: {
          startDate: '21 December 2023',
          sendTime: '2:16 AM',
        },
      },
    };
    const store = mockStore(initialState);
    render(
      <CustomWrapper>
        <ScheduleAndGoals
          {...mockData}
          formRef={ref}
          scheduleCampaign={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          campaignType="one_time"
          formSuccess={true}
          reschedule={false}
          store={store}
        />
      </CustomWrapper>
    );
    const publishBtn = screen.getByRole('button', {
      name: /Publish/i,
    });
    await act(async () => {
      fireEvent.click(publishBtn);
      expect(publishBtn).toBeValid();
    });
  });

  it('handles form submission with atspecifictime Rescheduling for SMS', async () => {
    const initialState = {
      ...insitialStateObj,
      campaignsApp: {
        createCampaign: {
          scheudleAndGoals: {
            schedule_type: 'at_specific_time',
            start_date: moment(new Date()).format('DD MMMM YYYY'),
            send_campaign_time: 'at_fixed_time',
          },
        },
      },
    };
    const mockData = {
      channelType: CommonEnums.SMS,
      smsSender: '12346677',
      templateRecordId: '80',
      message: 'Hello World http://wwww.google.com',
      actualMessage: 'Hello World http://wwww.google.com',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '123455678932',
      testUserAttribute: 'mobileNumber',
      testUserValue: '',
      personalisedParam: {
        fieldsArray: [],
      },
      defaultmessage: '',
      campaignTimeZone: 'Asia/Calcutta',
      campaignType: 'one_time',
      deliveryControl: {
        ignoreFrequencyCapping: false,
        countFrequencyCapping: false,
        requestLimit: '',
      },
      one_time: {
        sendCampaignType: 'at_specific_date_and_time',
        sendCampaignTime: 'at_fixed_time',
        atFixedTime: {
          startDate: '21 December 2023',
          sendTime: '2:16 AM',
        },
      },
    };
    const store = mockStore(initialState);
    render(
      <CustomWrapper>
        <ScheduleAndGoals
          {...mockData}
          formRef={ref}
          scheduleCampaign={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          campaignType="one_time"
          formSuccess={true}
          reschedule={true}
          store={store}
        />
      </CustomWrapper>
    );
    const rescheduleBtn = screen.getByRole('button', {
      name: /Reschedule/i,
    });
    await act(async () => {
      fireEvent.click(rescheduleBtn);
      expect(rescheduleBtn).toBeValid();
    });
  });

  it('handles form submission with at_fixed_time & monthly periodic recheduling SMS', async () => {
    const initialState = {
      ...insitialStateObj,
      campaignsApp: {
        createCampaign: {
          scheudleAndGoals: {
            schedule_type: 'periodic',
            scheduling_frequency: 'monthly',
            start_date: moment(new Date()).format('DD MMMM YYYY'),
            end_date: moment(new Date()).format('DD MMMM YYYY'),
            repeat_on_day_of_week: [],
            repeat_on_day_of_month: [16, 11, 12, 19],
            send_campaign_time: 'at_fixed_time',
          },
        },
      },
    };
    const mockData = {
      channelType: CommonEnums.SMS,
      smsSender: '12346677',
      templateRecordId: '80',
      message: 'Hello World http://wwww.google.com',
      actualMessage: 'Hello World http://wwww.google.com',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '123455678932',
      testUserAttribute: 'mobileNumber',
      testUserValue: '',
      personalisedParam: {
        fieldsArray: [],
      },
      defaultmessage: '',
      campaignTimeZone: 'Asia/Calcutta',
      campaignType: 'periodic',
      deliveryControl: {
        ignoreFrequencyCapping: false,
        countFrequencyCapping: false,
        requestLimit: '',
      },
      periodic: {
        sendCampaignType: 'monthly',
        sendCampaignTime: 'at_fixed_time',

        atFixedTime: {
          startDate: '21 December 2023',
          sendTime: '2:25 PM',
          ends: 'Never',
          on: {
            endDate: '20 December 2023',
          },
          after: {
            occurrences: '',
          },
        },

        repeatEvery: 1,
        repeatOn: 'Date of Month',
        sendUserTimeZonePassed: '',
        daysOfMonth: [16, 11, 12, 19],
        daysOfWeek: [],
      },
    };
    const store = mockStore(initialState);
    render(
      <CustomWrapper>
        <ScheduleAndGoals
          {...mockData}
          formRef={ref}
          scheduleCampaign={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          campaignType="periodic"
          formSuccess={true}
          reschedule={true}
          store={store}
        />
      </CustomWrapper>
    );
    const rescheduleBtn = screen.getByRole('button', {
      name: /Reschedule/i,
    });
    await act(async () => {
      fireEvent.click(rescheduleBtn);
      expect(rescheduleBtn).toBeValid();
    });
  });

  it('handles form submission with event triggered scheduling', async () => {
    const initialState = {
      ...insitialStateObj,
      campaignsApp: {
        createCampaign: {
          scheudleAndGoals: {
            schedule_type: 'event_trigger',
            time_multiplier: 60,
            time_value: 1,
            start_date: moment(new Date()).format('DD MMMM YYYY'),
            end_date: moment(new Date()).format('DD MMMM YYYY'),
          },
        },
      },
    };
    const store = mockStore(initialState);
    const mockData = {
      channelType: CommonEnums.SMS,
      smsSender: '12346677',
      templateRecordId: '80',
      message: 'Hello World http://wwww.google.com',
      actualMessage: 'Hello World http://wwww.google.com',
      personalize: false,
      tinyUrlConversion: false,
      templateCustomized: false,
      templateId: '123455678932',
      testUserAttribute: 'mobileNumber',
      testUserValue: '',
      personalisedParam: {
        fieldsArray: [],
      },
      defaultmessage: '',
      campaignTimeZone: 'Asia/Calcutta',
      campaignType: 'event_trigger',
      deliveryControl: {
        ignoreFrequencyCapping: false,
        countFrequencyCapping: false,
        requestLimit: '',
      },
      event_trigger: {
        sendCampaignType: 'Active Continously',
        startDate: '20 December 2023',
        sendTime: '2:55 PM',
        endDate: '20 December 2023',
        endTime: '2:55 PM',
        trigger_relation: 'after',
        trigger_attr: 'If Action',
        time_value: 1,
        time_multiplier: 60,
      },
    };
    render(
      <CustomWrapper>
        <ScheduleAndGoals
          {...mockData}
          formRef={ref}
          scheduleCampaign={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          campaignType="event_trigger"
          formSuccess={true}
          reschedule={false}
          store={store}
        />
      </CustomWrapper>
    );

    const publishBtn = screen.getByRole('button', {
      name: /Publish/i,
    });
    await act(async () => {
      fireEvent.click(publishBtn);
      expect(publishBtn).toBeValid();
    });
  });

  it('window.onbeforeunload set on mount', () => {
    render(
      <CustomWrapper>
        <ScheduleAndGoals
          formRef={ref}
          previous={jest.fn()}
          formSuccess={true}
        />
      </CustomWrapper>
    );
    expect(window.onbeforeunload).toBeInstanceOf(Function);
  });

  it('cleanup function removes window.onbeforeunload on unmount', () => {
    const { unmount } = render(
      <CustomWrapper>
        <ScheduleAndGoals
          formRef={ref}
          previous={jest.fn()}
          formSuccess={true}
        />
      </CustomWrapper>
    );
    unmount();
    expect(window.onbeforeunload).toBeNull();
  });
});
