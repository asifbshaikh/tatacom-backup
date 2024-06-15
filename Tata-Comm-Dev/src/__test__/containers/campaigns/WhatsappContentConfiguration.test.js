import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import WhatsAppContentConfiguration from 'containers/campaigns/whatsapp-campaign/WhatsAppContentConfiguration';
import configureMockStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import React from 'react';

describe('WhatsAppContentConfiguration component', () => {
  const mockStore = configureMockStore();
  const formRef = React.createRef(null);

  afterEach(cleanup);

  const mockData = {
    channelType: 'whatsapp',
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
  };

  const initialStateObj = {
    campaignsApp: {
      loadedCampaigns: true,
      campaigns: [],
      createCampaign: {
        selectAudience: {},
        contentConfiguration: {},
        scheudleAndGoals: {},
      },
      smsCampaignTemplates: {
        totalCount: 0,
        templates: [],
      },
      campaignTags: [],
      senderIds: [],
      templateListBasedOnSenderId: [],
      convertedTinyUrls: [],
      convertedPersonalizedMsg: {},
      stepIndex: 0,
      saveAsDraftResponse: {},
      templates: [],
      loading: false,
      error: null,
      emailCampaignTemplates: {
        totalCount: 0,
        savedTemplates: [],
      },
      subject: '',
      previewText: '',
      emailConnector: '',
      senderName: '',
      fromEmailAddress: [],
      replyToEmailAddress: '',
      cc: '',
      bcc: '',
      emailAddress: [],
      formEmailCreation: {
        subject: '',
        emailConnector: '',
        senderName: '',
        fromEmailAddress: [],
        replyToEmailAddress: '',
        cc: '',
        bcc: '',
      },
      emailTemplate: null,
      emailTempId: null,
      templateListWABasedOnConnectorID: [
        [
          {
            value: 'evi2_customer_invoice',
            label: 'Evi2 Customer Invoice',
            category: 'With Media',
          },
          {
            value: '200mb_pdf_test',
            label: '200mb Pdf Test',
            category: 'With Media',
          },
        ],
        [
          {
            value: 'flow_test_template1',
            label: 'Flow Test Template1',
            category: 'Without Media',
          },
          {
            value: 'flow_test_template3',
            label: 'Flow Test Template3',
            category: 'Without Media',
          },
          {
            value: 'flow_in_template',
            label: 'Flow In Template',
            category: 'Without Media',
          },
          {
            value: 'test_tollfree_plus',
            label: 'Test Tollfree Plus',
            category: 'Without Media',
          },
        ],
      ],

      templateListWADetailedList: [
        [
          {
            value: 'evi2_customer_invoice',
            label: 'Evi2 Customer Invoice',
            category: 'With Media',
          },
          {
            value: '200mb_pdf_test',
            label: '200mb Pdf Test',
            category: 'With Media',
          },
        ],
        [
          {
            value: 'flow_test_template1',
            label: 'Flow Test Template1',
            category: 'Without Media',
          },
          {
            value: 'flow_test_template3',
            label: 'Flow Test Template3',
            category: 'Without Media',
          },
        ],
      ],
      errorTestWAAdd: {},
      successTestWAAdd: false,
      loadingTestWAAdd: false,
      inboxId: '',
      defaultBtn: true,
      campaignInfo: {
        campaign: {
          id: 970,
          title: 'test by abc',
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
          personalise_mapping_attribute: {
            custom_params: {
              parameters: [
                {
                  image: {
                    link: 'test',
                  },
                },
              ],
            },
          },
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
            name: 'test by abc',
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
      stepId: '',
      loaded: true,
      errorAdd: {},
      successAdd: false,
      loadingAdd: false,
    },
    importusersApp: {
      colAttributesList: [
        {
          name: 'Email',
          type: 'string',
          template_record_id: 80,
          template_id: '123455678932',
          sender_id: '12346677',
        },
      ],
    },
    settingsChannels: {
      tataWhatsAppConnectors: [
        {
          inbox_id: 63,
          id: 63,
          channel_id: 63,
          name: 'Test',
          channel_type: 'Channel::TataSmsc',
          greeting_enabled: false,
          greeting_message: null,
          working_hours_enabled: false,
          enable_email_collect: true,
          csat_survey_enabled: false,
          enable_auto_assignment: true,
          out_of_office_message: null,
          working_hours: [
            {
              day_of_week: 0,
              closed_all_day: true,
              open_all_day: false,
            },
          ],
          timezone: 'UTC',

          auth_token: 'RkaXJlY3RteHByZWZlbnRlcnByaXNlOkJ0WFFmOXpF',
          medium: 'Test',
          sender_id: '12346677',
          sender_type: 'promotional',
          callback_url: '',
        },
      ],
    },
  };

  const initialStateObj1 = {
    campaignsApp: {
      loadedCampaigns: true,
      campaigns: [],
      createCampaign: {
        selectAudience: {},
        contentConfiguration: {},
        scheudleAndGoals: {},
      },
      smsCampaignTemplates: {
        totalCount: 0,
        templates: [],
      },
      campaignTags: [],
      senderIds: [],
      templateListBasedOnSenderId: [],
      convertedTinyUrls: [],
      convertedPersonalizedMsg: {},
      stepIndex: 0,
      saveAsDraftResponse: {},
      templates: [],
      loading: false,
      error: null,
      emailCampaignTemplates: {
        totalCount: 0,
        savedTemplates: [],
      },
      subject: '',
      previewText: '',
      emailConnector: '',
      senderName: '',
      fromEmailAddress: [],
      replyToEmailAddress: '',
      cc: '',
      bcc: '',
      emailAddress: [],
      formEmailCreation: {
        subject: '',
        emailConnector: '',
        senderName: '',
        fromEmailAddress: [],
        replyToEmailAddress: '',
        cc: '',
        bcc: '',
      },
      emailTemplate: null,
      emailTempId: null,
      templateListWABasedOnConnectorID: [
        [
          {
            value: 'evi2_customer_invoice',
            label: 'Evi2 Customer Invoice',
            category: 'With Media',
          },
          {
            value: '200mb_pdf_test',
            label: '200mb Pdf Test',
            category: 'With Media',
          },
        ],
        [
          {
            value: 'flow_test_template1',
            label: 'Flow Test Template1',
            category: 'Without Media',
          },
          {
            value: 'flow_test_template3',
            label: 'Flow Test Template3',
            category: 'Without Media',
          },
        ],
      ],

      templateListWADetailedList: [
        [
          {
            value: 'evi2_customer_invoice',
            label: 'Evi2 Customer Invoice',
            category: 'With Media',
          },
          {
            value: '200mb_pdf_test',
            label: '200mb Pdf Test',
            category: 'With Media',
          },
        ],
        [
          {
            value: 'flow_test_template1',
            label: 'Flow Test Template1',
            category: 'Without Media',
          },
          {
            value: 'flow_test_template3',
            label: 'Flow Test Template3',
            category: 'Without Media',
          },
        ],
      ],
      loadingTestWAAdd: false,
      inboxId: '',
      defaultBtn: true,
      campaignInfo: {
        campaign: {
          id: 970,
          title: 'test by abc',
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
            name: 'test by abc',
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
      stepId: '',
      loaded: true,
      errorAdd: {},
      successAdd: false,
      loadingAdd: false,
      successTestWAAdd: true,
      errorTestWAAdd: { errorMsg: 'Invalid data' },
    },
    importusersApp: {
      colAttributesList: [],
    },
    settingsChannels: {
      tataWhatsAppConnectors: [
        {
          inbox_id: 63,
          id: 63,
          channel_id: 63,
          name: 'Test',
          channel_type: 'Channel::TataSmsc',
          greeting_enabled: false,
          greeting_message: null,
          working_hours_enabled: false,
          enable_email_collect: true,
          csat_survey_enabled: false,
          enable_auto_assignment: true,
          out_of_office_message: null,
          working_hours: [
            {
              day_of_week: 0,
              closed_all_day: true,
              open_all_day: false,
            },
          ],
          timezone: 'UTC',

          auth_token: 'RkaXJlY3RteHByZWZlbnRlcnByaXNlOkJ0WFFmOXpF',
          medium: 'Test',
          sender_id: '12346677',
          sender_type: 'promotional',
          callback_url: '',
        },
      ],
    },
  };

  const initialStateObj2 = {
    campaignsApp: {
      loadedCampaigns: true,
      campaigns: [],
      createCampaign: {
        selectAudience: {},
        contentConfiguration: {},
        scheudleAndGoals: {},
      },
      smsCampaignTemplates: {
        totalCount: 0,
        templates: [],
      },
      campaignTags: [],
      senderIds: [],
      templateListBasedOnSenderId: [],
      convertedTinyUrls: [],
      convertedPersonalizedMsg: {},
      stepIndex: 0,
      saveAsDraftResponse: {},
      templates: [],
      loading: false,
      error: null,
      emailCampaignTemplates: {
        totalCount: 0,
        savedTemplates: [],
      },
      subject: '',
      previewText: '',
      emailConnector: '',
      senderName: '',
      fromEmailAddress: [],
      replyToEmailAddress: '',
      cc: '',
      bcc: '',
      emailAddress: [],
      formEmailCreation: {
        subject: '',
        emailConnector: '',
        senderName: '',
        fromEmailAddress: [],
        replyToEmailAddress: '',
        cc: '',
        bcc: '',
      },
      emailTemplate: null,
      emailTempId: null,
      templateListWABasedOnConnectorID: [
        [
          {
            value: 'evi2_customer_invoice',
            label: 'Evi2 Customer Invoice',
            category: 'With Media',
          },
          {
            value: '200mb_pdf_test',
            label: '200mb Pdf Test',
            category: 'With Media',
          },
        ],
        [
          {
            value: 'flow_test_template1',
            label: 'Flow Test Template1',
            category: 'Without Media',
          },
          {
            value: 'flow_test_template3',
            label: 'Flow Test Template3',
            category: 'Without Media',
          },
          {
            value: 'flow_in_template',
            label: 'Flow In Template',
            category: 'Without Media',
          },
          {
            value: 'test_tollfree_plus',
            label: 'Test Tollfree Plus',
            category: 'Without Media',
          },
        ],
      ],

      templateListWADetailedList: [
        [
          {
            value: 'evi2_customer_invoice',
            label: 'Evi2 Customer Invoice',
            category: 'With Media',
          },
          {
            value: '200mb_pdf_test',
            label: '200mb Pdf Test',
            category: 'With Media',
          },
        ],
        [
          {
            value: 'flow_test_template1',
            label: 'Flow Test Template1',
            category: 'Without Media',
          },
          {
            value: 'flow_test_template3',
            label: 'Flow Test Template3',
            category: 'Without Media',
          },
        ],
      ],
      errorTestWAAdd: {},
      successTestWAAdd: false,
      loadingTestWAAdd: false,
      inboxId: '',
      defaultBtn: true,
      campaignInfo: {
        campaign: {
          id: 970,
          title: 'test by abc',
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
          personalise_mapping_attribute: {
            media_attribute: {
              parameters: [
                {
                  image: {
                    link: 'test',
                  },
                },
              ],
            },
          },
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
            name: 'test by abc',
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
      stepId: '',
      loaded: true,
      errorAdd: {},
      successAdd: false,
      loadingAdd: false,
    },
    importusersApp: {
      colAttributesList: [
        {
          name: 'Email',
          type: 'string',
          template_record_id: 80,
          template_id: '123455678932',
          sender_id: '12346677',
        },
      ],
    },
    settingsChannels: {
      tataWhatsAppConnectors: [
        {
          inbox_id: 63,
          id: 63,
          channel_id: 63,
          name: 'Test',
          channel_type: 'Channel::TataSmsc',
          greeting_enabled: false,
          greeting_message: null,
          working_hours_enabled: false,
          enable_email_collect: true,
          csat_survey_enabled: false,
          enable_auto_assignment: true,
          out_of_office_message: null,
          working_hours: [
            {
              day_of_week: 0,
              closed_all_day: true,
              open_all_day: false,
            },
          ],
          timezone: 'UTC',

          auth_token: 'RkaXJlY3RteHByZWZlbnRlcnByaXNlOkJ0WFFmOXpF',
          medium: 'Test',
          sender_id: '12346677',
          sender_type: 'promotional',
          callback_url: '',
        },
      ],
    },
  };

  const initialState = { ...initialStateObj };
  const initialState1 = { ...initialStateObj1 };
  const initialState2 = { ...initialStateObj2 };

  const store = mockStore(initialState);
  const store1 = mockStore(initialState1);
  const store2 = mockStore(initialState2);

  test('renders the component', async () => {
    render(
      <CustomWrapper>
        <WhatsAppContentConfiguration
          {...mockData}
          store={store}
          colAttributesList={[
            {
              name: 'Email',
              type: 'string',
            },
          ]}
          formRef={formRef}
          formSuccess={true}
          addContentConfiguration={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          next={jest.fn()}
        />
      </CustomWrapper>
    );

    const nextBtn = screen.getByRole('button', {
      name: /next/i,
    });
    await act(async () => {
      fireEvent.click(nextBtn);
      expect(nextBtn).toBeValid();
    });
  });

  it('click Previous button', async () => {
    render(
      <CustomWrapper>
        <WhatsAppContentConfiguration
          {...mockData}
          store={store1}
          colAttributesList={[
            {
              name: 'Email',
              type: 'string',
            },
          ]}
          addContentConfiguration={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          next={jest.fn()}
          formRef={formRef}
        />
      </CustomWrapper>
    );
    const previousBtn = screen.getByRole('button', {
      name: /previous/i,
    });
    await act(async () => {
      fireEvent.click(previousBtn);
      expect(previousBtn).toBeValid();
    });
  });

  it('Handle Personalize checkbox ', async () => {
    render(
      <CustomWrapper>
        <WhatsAppContentConfiguration
          channelType={'whatsapp'}
          store={store1}
          colAttributesList={[
            {
              name: 'Email',
              type: 'string',
            },
          ]}
          addContentConfiguration={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          next={jest.fn()}
          formRef={formRef}
        />
      </CustomWrapper>
    );
    const whatsappSelectSender = screen.getByTestId('sms-select-sender');
    fireEvent.change(whatsappSelectSender, {
      target: { value: '09876567890' },
    });

    const smsSelectCustomAttribute = screen.getByTestId(
      'test-custom-attribute'
    );
    fireEvent.change(smsSelectCustomAttribute);

    const smsOptOutCheckbox = screen.getByTestId('personalize');

    expect(smsOptOutCheckbox).not.toBeChecked();
    fireEvent.click(smsOptOutCheckbox);
    expect(smsOptOutCheckbox).toBeChecked();
  });

  it('Handle media attribute', async () => {
    render(
      <CustomWrapper>
        <WhatsAppContentConfiguration
          channelType={'whatsapp'}
          store={store2}
          colAttributesList={[
            {
              name: 'Email',
              type: 'string',
            },
          ]}
          addContentConfiguration={jest.fn()}
          updateStepIndexAction={jest.fn()}
          previous={jest.fn()}
          next={jest.fn()}
          formRef={formRef}
        />
      </CustomWrapper>
    );
    const whatsappSelectSender = screen.getByTestId('sms-select-sender');
    fireEvent.change(whatsappSelectSender, {
      target: { value: '09876567890' },
    });

    const smsSelectCustomAttribute = screen.getByTestId(
      'test-custom-attribute'
    );
    fireEvent.change(smsSelectCustomAttribute);

    const smsOptOutCheckbox = screen.getByTestId('personalize');

    expect(smsOptOutCheckbox).not.toBeChecked();
    fireEvent.click(smsOptOutCheckbox);
    expect(smsOptOutCheckbox).toBeChecked();
  });
});
