import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InfoView from 'views/app/infoview/index';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import { CustomWrapper } from 'test-utils';

describe('InfoView Page testing', () => {
  const mockStore = configureStore([]);
  const commonProps = {
    match: {
      url: '/app/accounts/8/dashboards/all-campaigns/campaign/970#tab1',
      path: '',
    },
  };
  const flattenMessages = (nestedMessages, prefix = '') => {
    if (nestedMessages === null) {
      return {};
    }
    return Object.keys(nestedMessages).reduce((messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string' || typeof value === 'number') {
        Object.assign(messages, { [prefixedKey]: value });
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }

      return messages;
    }, {});
  };
  const initialState = {
    dashboardCampaignsApp: {
      campaignInfo: {
        campaign: {
          id: 970,
          title: 'test by amar',
          display_id: 418,
          description: null,
          account_id: 4,
          sender_id: null,
          enabled: true,
          campaign_status: 0,
          scheduling_type: 'one_time',
          campaignable_id: 659,
          campaignable_type: 'Campaign::SmsCampaign',
          total_order_value: '0.0',
          number_of_conversion_events: 0,
          number_of_unique_conversions: 0,
          exclude_users: false,
          select_audience: 'allUsers',
          send_campaign_to_the_opted_out_users: null,
          status: 'Completed',
          personalise_mapping_attribute: {},
          segment_attribute: {
            segment_filter_id: 2450,
          },
          segment_filter_description: 'All Users',
          selected_contact_attribute: 'phone_number',
          inbox_id: 101,
          inbox: {
            id: 101,
            avatar_url: '',
            channel_id: 79,
            name: 79,
            channel_type: 'Channel::TataSmsc',
          },
          message: 'Sample test\nhttps://su.digo.link/MqO5rKN',
          campaign_type: 'SMS',
          trigger_rules: {},
          trigger_only_during_business_hours: false,
          created_at: 1700221316,
          updated_at: 1700221318,
          campaign_analytics: {
            campaign_id: 970,
            name: 'test by amar',
            tiny_url_report: [
              {
                statusCode: 200,
                message: 'success',
                link: {
                  shorturl: 'https://su.digo.link/MqO5rKN',
                  url: 'https://psljira.atlassian.net/browse/DE03-342',
                  title: 'https://psljira.atlassian.net/browse/DE03-342',
                  clicks: '0',
                  OS: 'Desktop\\Tablet',
                  country: null,
                  IP: null,
                  click_time: null,
                },
              },
            ],
            delivery_status: {
              sent: 5,
            },
            ab_comparison: {
              sent: {
                value: 5,
                percentage: false,
              },
              delivered: {
                value: null,
                percentage: false,
              },
              conversion_events: {
                value: 10,
                percentage: false,
              },
              conversions: {
                value: 43,
                percentage: true,
              },
              delivery_rate: {
                value: 0.0,
                percentage: true,
              },
              failed_to_send: {
                value: 0,
                percentage: false,
              },
              generic_api_call_error: {
                value: 0,
                percentage: false,
              },
              tcl: {
                value: 0,
                percentage: false,
              },
              invalid_mobile_number: {
                value: 0,
                percentage: false,
              },
              other: {
                value: 0,
                percentage: false,
              },
              failed_to_deliver: {
                value: 0,
                percentage: false,
              },
              system_failure: {
                value: 0,
                percentage: false,
              },
              blocked_for_user: {
                value: 0,
                percentage: false,
              },
              pending_delivery_confirmation: {
                value: 0,
                percentage: false,
              },
            },
          },
          campaignable: {
            id: 659,
            account_id: 4,
            campaign_tag_id: null,
            template_id: '10112',
            template_record_id: 102,
            created_at: '2023-11-17T11:41:56.967Z',
            updated_at: '2023-11-17T11:41:56.967Z',
            tiny_urls: ['https://su.digo.link/MqO5rKN'],
            template: null,
          },
          campaign_goals: [],
          campaign_scheduler: {
            id: 846,
            campaign_type: 'Campaign::SmsCampaign',
            periodic_type: null,
            trigger_criteria_first: [],
            trigger_criteria_second: [],
            campaign_id: 970,
            account_id: 4,
            created_at: '2023-11-17T11:41:57.007Z',
            updated_at: '2023-11-17T11:41:58.163Z',
            campaign_time_zone: null,
            schedule_type: 'as_soon_as_possible',
            scheduling_frequency: null,
            send_campaign_time: null,
            start_date: '2023-11-17T11:41:57.005Z',
            end_date: null,
            repeat_every: null,
            send_if_user_timezone_expired: false,
            occurrences: null,
            repeat_on_day_of_month: [],
            repeat_on_day_of_week: [],
            best_time_for_user: null,
            on_best_time: false,
            cron_expression: null,
            occurrence_count: 0,
            status: 'success',
            alternate_timezone: null,
            is_template_customized: null,
            base_url: null,
            trigger_relation: null,
            trigger_attr: null,
            time_value: null,
            time_multiplier: null,
          },
        },
      },
    },
  };
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders InfoView component with props', async () => {
    const { container } = render(
      <CustomWrapper>
        <InfoView {...commonProps} />
      </CustomWrapper>
    );

    expect(container).toBeInTheDocument();

    const tab2 = screen.getByText('CAMPAIGN INFO');
    fireEvent.click(tab2);
    expect(screen.getByText('Campaign Info')).toBeInTheDocument();

    const tab1 = screen.getByText('ANALYTICS');
    fireEvent.click(tab1);
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });
});
