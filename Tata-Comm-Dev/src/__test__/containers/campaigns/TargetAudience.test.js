import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import TargetAudience from 'containers/campaigns/TargetAudience';
import { createRef } from 'react';
import { act } from 'react-dom/test-utils';
import configureMockStore from 'redux-mock-store';
import { Router } from 'react-router-dom/cjs/react-router-dom.min';
import { createMemoryHistory } from 'history';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import { getColumnAttributeList } from 'redux/actions';

describe('SmsTargetAudience btns click', () => {
  const history = createMemoryHistory();
  history.push('/create-campaign?segmentId=186', { segmentName: 'Test' });
  const mockStore = configureMockStore();
  const mockData = {
    channelType: 'sms',
    campaignType: 'event_trigger',
    campaignName: '',
    campaignTags: '',
    selectedUserAttribute: '',
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
                executed: 'true',
                name: 'APP_OPENED',
                operator: 'at_least',
                value: 1,
                attributes: {
                  filter_operator: 'and',
                  filters: [],
                },
                category: 'Lifecycle',
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
  };
  const form = {
    values: {
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
    },
    errors: {},
    setFieldValue: jest.fn(),
  };

  const mockData1 = {
    channelType: 'sms',
    campaignType: 'one_time',
    campaignName: 'Test',
    selectedUserAttribute: 'name',
  };
  const initialStateObj = {
    campaignsApp: { createCampaign: { selectAudience: mockData } },
    importusersApp: {
      colAttributesList: {
        name: {
          name: 'Name',
          type: 'string',
        },
        email: {
          name: 'Email',
          type: 'string',
        },
        phone_number: {
          name: 'Phone Number',
          type: 'string',
        },
        pubsub_token: {
          name: 'Pubsub Token',
          type: 'string',
        },

        campaign_name: {
          name: 'Campaign Name',
          type: 'string',
        },
        publisher_name: {
          name: 'Publisher Name',
          type: 'string',
        },
        install_status: {
          name: 'Install Status',
          type: 'string',
        },
      },
    },
  };

  const initialStateObjOnetime = {
    campaignsApp: { createCampaign: { selectAudience: mockData1 } },
    importusersApp: {
      colAttributesList: {
        name: {
          name: 'Name',
          type: 'string',
        },
        email: {
          name: 'Email',
          type: 'string',
        },
        phone_number: {
          name: 'Phone Number',
          type: 'string',
        },
        pubsub_token: {
          name: 'Pubsub Token',
          type: 'string',
        },

        campaign_name: {
          name: 'Campaign Name',
          type: 'string',
        },
        publisher_name: {
          name: 'Publisher Name',
          type: 'string',
        },
        install_status: {
          name: 'Install Status',
          type: 'string',
        },
      },
    },
  };
  const initialState = { ...initialStateObj };
  const store = mockStore(initialState);

  const initialState1 = { ...initialStateObjOnetime };
  const store1 = mockStore(initialState1);

  const ref = createRef(null);
  it('stepper buttons click without crashing', async () => {
    render(
      <CustomWrapper>
        <Router history={history}>
          <TargetAudience
            formRef={ref}
            form={form}
            next={jest.fn()}
            previous={jest.fn()}
            addTargetUsers={jest.fn()}
            store={store}
            getColumnAttributeListAction={getColumnAttributeList}
          />
        </Router>
      </CustomWrapper>
    );
    const previousBtn = screen.getByRole('button', {
      name: /previous/i,
    });
    const nextBtn = screen.getByRole('button', {
      name: /next/i,
    });

    await act(async () => {
      fireEvent.click(previousBtn);
      await waitFor(() => {
        fireEvent.click(nextBtn);
        expect(previousBtn).toBeInTheDocument();
        expect(nextBtn).toBeInTheDocument();
      });
    });
  });

  it('campaign type is event triggered cover event-triggered branch', async () => {
    render(
      <CustomWrapper>
        <Router history={history}>
          <TargetAudience
            formRef={ref}
            form={form}
            previous={jest.fn()}
            addTargetUsers={jest.fn()}
            store={store}
            getColumnAttributeListAction={getColumnAttributeList}
          />
        </Router>
      </CustomWrapper>
    );

    await act(async () => {
      expect(
        screen.getByRole('heading', {
          name: /trigger criteria/i,
        })
      ).toBeInTheDocument();
    });
  });
  it('channel type is inAPP cover InApp component', async () => {
    mockData.channelType = 'inApp';
    initialStateObj.importusersApp.colAttributesList = [];
    render(
      <CustomWrapper>
        <TargetAudience
          formRef={ref}
          form={form}
          previous={jest.fn()}
          addTargetUsers={jest.fn()}
          store={store}
          getColumnAttributeListAction={getColumnAttributeList}
        />
      </CustomWrapper>
    );
    await act(async () => {
      expect(
        screen.getByRole('heading', {
          name: /target platforms\*/i,
        })
      ).toBeInTheDocument();
    });
  });

  it('handle next button click channel type is sms', async () => {
    mockData.channelType = 'sms';
    render(
      <CustomWrapper>
        <TargetAudience
          formRef={ref}
          previous={jest.fn()}
          addTargetUsers={jest.fn()}
          store={store1}
        />
      </CustomWrapper>
    );
    await act(async () => {
      expect(screen.getByText('Campaign Info')).toBeInTheDocument();

      const campaignName = screen.getByTestId('campaignNameField');
      fireEvent.change(campaignName, { target: { value: 'Test Campaign' } });

      const userAttrSelect = screen.getByTestId('userAttributeField');
      fireEvent.change(userAttrSelect, { target: { value: 'name' } });
      const nextBtn = screen.getByRole('button', {
        name: /next/i,
      });

      fireEvent.click(nextBtn);
    });
  });

  it('handle previous button click channel type is sms', async () => {
    mockData.channelType = 'sms';
    render(
      <CustomWrapper>
        <TargetAudience
          formRef={ref}
          previous={jest.fn()}
          addTargetUsers={jest.fn()}
        />
      </CustomWrapper>
    );
    await act(async () => {
      expect(screen.getByText('Campaign Info')).toBeInTheDocument();

      const previousBtn = screen.getByRole('button', {
        name: /previous/i,
      });
      fireEvent.click(previousBtn);
    });
  });
});
