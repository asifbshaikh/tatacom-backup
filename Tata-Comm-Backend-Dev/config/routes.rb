Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  # AUTH STARTS
  match 'auth/:provider/callback', to: 'home#callback', via: [:get, :post]
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    confirmations: 'devise_overrides/confirmations',
    passwords: 'devise_overrides/passwords',
    sessions: 'devise_overrides/sessions',
    token_validations: 'devise_overrides/token_validations'
  }, via: [:get, :post]

  ## renders the frontend paths only if its not an api only server
  if ActiveModel::Type::Boolean.new.cast(ENV.fetch('CW_API_ONLY_SERVER', false))
    root to: 'api#index'
  else
    root to: 'dashboard#index'

    get '/app', to: 'dashboard#index'
    get '/app/*params', to: 'dashboard#index'
    get '/app/accounts/:account_id/settings/inboxes/new/twitter', to: 'dashboard#index', as: 'app_new_twitter_inbox'
    get '/app/accounts/:account_id/settings/inboxes/new/:inbox_id/agents', to: 'dashboard#index', as: 'app_twitter_inbox_agents'

    resource :widget, only: [:show]
    namespace :survey do
      resources :responses, only: [:show]
    end
  end

  get '/api', to: 'api#index'
  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      # ----------------------------------
      # start of account scoped api routes
      resources :accounts, only: [:create, :show, :update] do
        member do
          post :update_active_at
        end

        scope module: :accounts do
          namespace :actions do
            resource :contact_merge, only: [:create]
          end

          resource :bulk_actions, only: [:create]
          resources :agents, only: [:index, :create, :update, :destroy]
          resources :templates, only: [:index]
          resources :agent_bots, only: [:index, :create, :show, :update, :destroy]

          resources :callbacks, only: [] do
            collection do
              post :register_facebook_page
              get :register_facebook_page
              post :facebook_pages
              post :reauthorize_page
            end
          end
          resources :canned_responses, except: [:show, :edit, :new]
          resources :automation_rules, except: [:edit] do
            post :clone
          end
          resources :campaigns, only: [:index, :create, :show, :update, :destroy] do
            collection do
              get :reports
            end
          end

          namespace :channels do
            resource :twilio_channel, only: [:create]
          end
          namespace :channels do
            resource :tata_communications_whatsapp_channel, only: [:create]
          end
          namespace :channels do
            resource :tata_channel, only: [:create]
          end
          resources :conversations, only: [:index, :create, :show] do
            collection do
              get :meta
              get :search
              post :filter
            end
            scope module: :conversations do
              resources :messages, only: [:index, :create, :destroy]
              resources :assignments, only: [:create]
              resources :labels, only: [:create, :index]
              resource :direct_uploads, only: [:create]
            end
            member do
              post :mute
              post :unmute
              post :transcript
              post :toggle_status
              post :toggle_typing_status
              post :update_last_seen
              post :custom_attributes
            end
          end

          resources :contacts, only: [:index, :show, :update, :create, :destroy] do
            collection do
              get :active
              get :search
              post :filter
              post :import
            end
            member do
              get :contactable_inboxes
              post :destroy_custom_attributes
            end
            scope module: :contacts do
              resources :conversations, only: [:index]
              resources :contact_inboxes, only: [:create]
              resources :labels, only: [:create, :index]
              resources :notes
            end
          end
          resources :csat_survey_responses, only: [:index] do
            collection do
              get :metrics
            end
          end
          resources :custom_attribute_definitions, only: [:index, :show, :create, :update, :destroy]
          resources :custom_filters, only: [:index, :show, :create, :update, :destroy]
          resources :inboxes, only: [:index, :show, :create, :update, :destroy] do
            get :assignable_agents, on: :member
            get :campaigns, on: :member
            get :agent_bot, on: :member
            post :set_agent_bot, on: :member
            delete :avatar, on: :member
          end
          resources :inbox_members, only: [:create, :show], param: :inbox_id do
            collection do
              delete :destroy
              patch :update
            end
          end
          resources :labels, only: [:index, :show, :create, :update, :destroy]

          resources :notifications, only: [:index, :update] do
            collection do
              post :read_all
              get :unread_count
            end
          end
          resource :notification_settings, only: [:show, :update]

          resources :teams do
            resources :team_members, only: [:index, :create] do
              collection do
                delete :destroy
                patch :update
              end
            end
          end

          namespace :twitter do
            resource :authorization, only: [:create]
          end

          resources :webhooks, except: [:show]
          namespace :integrations do
            resources :apps, only: [:index, :show]
            resources :hooks, only: [:create, :update, :destroy]
            resource :slack, only: [:create, :update, :destroy], controller: 'slack'
          end
          resources :working_hours, only: [:update]

          namespace :kbase do
            resources :portals do
              resources :categories do
                resources :folders
              end
              resources :articles
            end
          end
        end
      end
      # end of account scoped api routes
      # ----------------------------------

      namespace :integrations do
        resources :webhooks, only: [:create]
      end

      resource :profile, only: [:show, :update] do
        delete :avatar, on: :collection
        member do
          post :availability
        end
      end

      resource :notification_subscriptions, only: [:create, :destroy]

      namespace :widget do
        resource :direct_uploads, only: [:create]
        resource :config, only: [:create]
        resources :campaigns, only: [:index]
        resources :events, only: [:create]
        resources :messages, only: [:index, :create, :update]
        resources :conversations, only: [:index, :create] do
          collection do
            post :update_last_seen
            post :toggle_typing
            post :transcript
            get  :toggle_status
          end
        end
        resource :contact, only: [:show, :update] do
          collection do
            post :destroy_custom_attributes
          end
        end
        resources :inbox_members, only: [:index]
        resources :labels, only: [:create, :destroy]
      end
    end

    namespace :v2 do
      resources :accounts, only: [], module: :accounts do
        resources :reports, only: [:index] do
          collection do
            get :summary
            get :agents
            get :inboxes
            get :labels
            get :teams
          end
        end
      end
    end

    namespace :v3 do
      resources :accounts, only: [] do
        member do
          get :setting
          post :generate_access_token
          post :create_event_log
          get :get_event_log
        end
        scope module: :accounts do

          # inbox
          resources :inboxes, only: [:index, :show, :create, :update, :destroy]

          resources :global_control_groups do
            member do
              get :download_users_csv_file
            end
          end

          resources :notification_channels, only: [:index, :create, :update,:show]

          resources :import_users do
            collection do
              post :import
              get :user_attribute_mapping
            end
          end

          # resources :campaigns

          resources :templates, only: [:index,:create,:show,:update, :destroy] do
            collection do
              get :search_template
              post :upload_template
              get :show_template
              post :get_template_id_by_sender_id
            end
          end
          resources :user_audiences do
          end
          resources :campaign_schedulers, only: [:index,:create,:show,:update, :destroy] do
            collection do

            end
          end
          resources :contacts do
            collection do
              get :user_audience_count
              get :select_target_audience
              get 'test_phone_number_validity'
            end
          end
          resources :devices
          resources :campaign_tags, only: [:index,:create] do
          end
          post :generate, to: 'tiny_url#generate'
          post :tiny_url_tracking_report, to: 'tiny_url#tiny_url_tracking_report'
          resources :contacts do
            member do
              patch :simulate_interaction
              get :best_time_to_send
              get :test_phone_number_validity
            end
          end
          resources :users do
            collection do
              patch :simulate_interaction
              get :best_time_to_send
              post :validate_uid
              get 'validate_email'
            end
            resources :contacts_reports, only: [:index] do
              member do
                put :rerun_report, to: 'rerun_report'
                put :download_file, to: 'download_file'
              end
            end
          end
          resources :campaigns do
            collection do
              get :calculate_metrics
              get :campaign_info
              post :test_sms_message_via_tatasms
              post :personalize_message
              # post :webhook_response
              post :save_as_draft
              post :generate_tiny_url_report
              post :test_campaign_via_tataemail
              post '/:action_type', action: :create, params: :action_type
              post '/:campaign_type/test', action: :perform_test, params: :campaign_type
            end
            member do
              get :calculate_revenue
              get :get_campaign_analytics
              put :reschedule
              put '/:action_type', action: :update, params: :action_type
            end
          end
          resources :channels do
            collection do
              post :test_sms
              get  :fetch_all_sender_id
              post :test_email
            end
            member do
              get :whatsapp_templates
            end
          end

          resources :segments do
            collection do
              post :get_user_count_by_filter, to: 'get_user_count_by_filter'
              get :get_user_property_list, to: 'get_user_property_list'
              get :get_user_events, to: 'get_user_events'
              get :get_user_event_attributes, to: 'get_user_event_attributes'
              get :get_custom_segments, to: 'get_custom_segments'
              get :get_archieve_segments, to: 'get_archieve_segments'
              post :query_rerun, to: 'query_rerun'
              post :query_filter_rerun_success_email, to: 'query_filter_rerun_success_email'
              post :create_duplicate, to: 'create_duplicate', path: '/clone'
              post :export_segment_filter_users, to: 'export_segment_filter_users', path: '/export_users'
              get :sample_users_details, to: 'sample_users_details'
              get :campaign_channel_type_list
            end
            member do
              patch :archieve_unarchieve, to: 'archieve_unarchieve'
              post :export_segment_users, to: 'export_segment_users', path: '/export_users'
              post :edit_file_segment, to: 'edit_file_segment'
              put :restore_version, to: 'restore_version'
            end
          end

          resources :segment_filters, only: [:index,:show]
          resources :custom_attribute
          resources :email_general_settings, only: [:create,:update,:show]
          resources :email_configs
          resources :campaign_details, only: [:create, :update, :destroy] do
            collection do
              get :show_campaign_details
            end
          end
          resources :email_templates do
            collection do
              get :get_predefined_templates
            end
          end

          resources :s3_configurations do
            collection do
              get :download_csv
              get :downloadable_csv_preview
            end
          end

          resources :contact_support_mails, only: [:index,:create,:show,:update, :destroy]

          resources :contact_support_mails, only: [:index,:create,:show,:update, :destroy]

          resources :webhooks do
            collection do
              post :whatsapp
              post :sms
            end
          end
          resources :report_schedulers

          get :whatsapp_phone_numbers, to: 'channels#whatsapp_phone_numbers'
          post :create_custom_attribute, to: 'custom_attributes_events#create_custom_attribute'
          post :create_custom_event, to: 'custom_attributes_events#create_custom_event'
          post :map_custom_event, to: 'custom_attributes_events#map_custom_event'
          post :map_custom_attribute, to: 'custom_attributes_events#map_custom_attribute'

          get :all_countries, to: 'fc_dnd_settings#all_countries'
          resources :fc_dnd_settings
          resources :configurations, path: "configurations/:source_type/" do
            collection do
              post :test_connection
              get :configuration_list
            end
          end
          resources :crm_cdp_schedules, path: "schedule_details/:source_type/" do
            collection do
              post :preview
            end
            member do
              patch :deactivate
              get :imports
            end
          end
          resources :data_sync_imports, only: [:index, :show]
          resources :csat_survey_responses, only: [:index]
          resources :conversations, only: [] do
            scope module: :conversations do
              resources :messages, only: [:index]
            end
          end
        end
      end
      post '/dummy_apis/email', to: 'dummy_apis#email'
      post '/dummy_apis/whatsapp', to: 'dummy_apis#whatsapp'
    end
  end

  # ----------------------------------------------------------------------
  # Routes for platform APIs
  namespace :platform, defaults: { format: 'json' } do
    namespace :api do
      namespace :v1 do
        resources :users, only: [:create, :show, :update, :destroy] do
          member do
            get :login
          end
        end
        resources :agent_bots, only: [:index, :create, :show, :update, :destroy]
        resources :accounts, only: [:create, :show, :update, :destroy] do
          resources :account_users, only: [:index, :create] do
            collection do
              delete :destroy
            end
          end
        end
      end
    end
  end

  # ----------------------------------------------------------------------
  # Routes for inbox APIs Exposed to contacts
  namespace :public, defaults: { format: 'json' } do
    namespace :api do
      namespace :v1 do
        resources :inboxes do
          scope module: :inboxes do
            resources :contacts, only: [:create, :show, :update] do
              resources :conversations, only: [:index, :create] do
                resources :messages, only: [:index, :create, :update]
              end
            end
          end
        end
        resources :csat_survey, only: [:show, :update]
      end
    end
  end

  # ----------------------------------------------------------------------
  # Used in mailer templates
  resource :app, only: [:index] do
    resources :accounts do
      resources :conversations, only: [:show]
    end
  end

  # ----------------------------------------------------------------------
  # Routes for channel integrations
  mount Facebook::Messenger::Server, at: 'bot'
  get 'webhooks/twitter', to: 'api/v1/webhooks#twitter_crc'
  post 'webhooks/twitter', to: 'api/v1/webhooks#twitter_events'
  post 'webhooks/line/:line_channel_id', to: 'webhooks/line#process_payload'
  post 'webhooks/viber', to: 'webhooks/viber#process_payload'
  post 'webhooks/wechat', to: 'webhooks/wechat#process_payload'
  post 'webhooks/kakao', to: 'webhooks/kakao#process_payload'
  post 'webhooks/telegram/:bot_token', to: 'webhooks/telegram#process_payload'
  post 'webhooks/whatsapp/:phone_number', to: 'webhooks/whatsapp#process_payload'
  post 'webhooks/sms/:phone_number', to: 'webhooks/sms#process_payload'
  get 'webhooks/instagram', to: 'webhooks/instagram#verify'
  post 'webhooks/instagram', to: 'webhooks/instagram#events'

  namespace :twitter do
    resource :callback, only: [:show]
  end

  namespace :twilio do
    resources :callback, only: [:create]
  end
  namespace :tata do
    resources :callback, only: [:create]
  end

  # ----------------------------------------------------------------------
  # Routes for external service verifications
  get 'apple-app-site-association' => 'apple_app#site_association'
  get '.well-known/assetlinks.json' => 'android_app#assetlinks'

  # ----------------------------------------------------------------------
  # Internal Monitoring Routes
  require 'sidekiq/web'
  require 'sidekiq/cron/web'

  devise_for :super_admins, path: 'super_admin', controllers: { sessions: 'super_admin/devise/sessions' }
  devise_scope :super_admin do
    get 'super_admin/logout', to: 'super_admin/devise/sessions#destroy'
    namespace :super_admin do
      root to: 'dashboard#index'

      resource :app_config, only: [:show, :create]

      # order of resources affect the order of sidebar navigation in super admin
      resources :accounts
      resources :users, only: [:index, :new, :create, :show, :edit, :update]
      resources :access_tokens, only: [:index, :show]
      resources :installation_configs, only: [:index, :new, :create, :show, :edit, :update]
      resources :agent_bots, only: [:index, :new, :create, :show, :edit, :update]
      resources :platform_apps, only: [:index, :new, :create, :show, :edit, :update]

      # resources that doesn't appear in primary navigation in super admin
      resources :account_users, only: [:new, :create, :destroy]
    end
    # authenticated :super_admin do
    #   mount Sidekiq::Web => '/monitoring/sidekiq'
    # end
      mount Sidekiq::Web => '/monitoring/sidekiq'
  end

  namespace :installation do
    get 'onboarding', to: 'onboarding#index'
    post 'onboarding', to: 'onboarding#create'
  end

  # ----------------------------------------------------------------------
  # Routes for testing
  resources :widget_tests, only: [:index] unless Rails.env.production?

end
