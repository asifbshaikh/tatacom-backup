module.exports = {
  CHANNEL_MGMT: {
    HEADER: 'Channels',
    CHANNEL: {
      SMS: 'SMS',
      EMAIL: 'EMAIL',
      WHATSAPP: 'WHATSAPP',
      MOBILEPUSH: 'MOBILE-PUSH',
      WEBPUSH: 'WEB-PUSH',
      CREATE: 'Create',
      SELECT_CONNECTOR: 'Select Connector',
      SAVED_MSG: 'Saved successfully!',
      COUNTRY_DROPDOWN: 'Country(Country Code)',
      SELECT_DAYS: 'Select Days',
      START_TIME: 'Start Time',
      END_TIME: 'End Time',
      END_TIME_ERROR_MESSAGE: 'End Time should be greater than Start Time',
      SEND_TIME_ERROR_MESSAGE: 'Send Time should be greater than current Time',
      END_DATE_ERROR_MESSAGE: 'End Date should be greater than Start Date',
      NO_INBOX: 'No Inbox',
    },
    TABS: {
      CONNECTOR_CONFIG: 'CONNECTOR CONFIG',
      GENERAL_SETTINGS: 'GENERAL SETTINGS',
      FC_AND_DND: 'FC & DND',
      SMS_GENERAL: 'SMS GENERAL',
      SUBSCRIPTION_KEWORDS: 'SUBSCRIPTION & KEWORDS',
      MOBILE_PUSH: {
        ANDRIOD: 'Android',
        IOS: 'iOS',
        WINDOWS: 'Windows',
      },
    },
    EMAIL_CHANNEL: {
      TITLE: 'Email Channel Configuration',
      DESC: 'Configure your SMTP configuration here',
      BUTTON: {
        SAVE: 'SAVE',
        UPDATE: 'UPDATE',
        CREATE: '+ Create',
        REMOVE: 'Remove',
        ADD_ANOTHER: 'Add another',
      },
      SMTP_HOSTNAME: {
        LABEL: 'Email Connector',
        PLACEHOLDER: 'Enter Connector Name',
      },
      SMTP_PORT: {
        LABEL: 'SMTP Port',
      },
      SMTP_PROTOCOL: {
        LABEL: 'SMTP Protocol',
        SSL: 'SSL',
        TLS: 'TLS',
        NONE: 'None',
      },
      SMTP_AUTHENTICATION: {
        ON: 'ON',
        OFF: 'OFF',
        LABEL: 'SMTP Authentication',
      },
      SMTP_USERNAME: {
        LABEL: 'SMTP Username',
      },
      SMTP_PASSWORD: {
        LABEL: 'SMTP Password',
      },
      MAXIMUM_SEND_RATE: {
        LABEL: 'Maximum send rate',
        PLACEHOLDER: '10',
      },
      BOUNCES_AND_COMPLIANT_TRACKING: {
        LABEL: 'Bounces & Complaint Tracking ',
      },
      API_KEY: {
        LABEL: 'API Key',
        PLACEHOLDER: 'Enter API Key',
      },
      API_URL: {
        LABEL: 'API URL',
        PLACEHOLDER: 'Enter API URL',
      },
      UNSUBSCRIBE_SETTINGS: {
        LABEL: 'Unsubscribe Settings',
        TRACKING: 'Tracking',
        NONE: 'None',
      },
      UNSUBSCRIBE_URL: {
        LABEL: 'Unsubscribe URL',
      },
      GENERAL_SETTINGS: {
        CURRENT_CONNECTOR: {
          LABEL: 'Current Connector',
        },
        FROM_EAMIL_ADDRESS: {
          LABEL: "'From' Email Address(s)",
        },
        USER_ATTRIBUTE_THAT_STORES_USER_EMAIL_ADDRESS: {
          LABEL: "User Attribute that stores user's email address ",
        },
      },
      FREQUENCY_CAPPING: {
        TITLE: 'FREQUENCY CAPPING',
        TOGGEL_BUTTON_TITLE: 'Frequency Capping',
        SUB_HEADING:
          'Limit the number of emails you send to your users in a given period',
        TIMEZONE_TITLE: 'Refresh the Frequency Capping Daily at',
        INITIAL_STR: 'Send a Maximum of',
        MIDDLE_STR: 'emails to users in ',
        LAST_STR: 'emails to users in ',
      },
      FC_CRIETERIA_2: 'emails to users in',
      ADD_CONFIG_BTN: '+Add Configuration',
      ADD_CONFIG_LABEL: 'Add Configuration',
      EDIT_CONFIG_LABEL: 'Edit Configuration',
      HOST_NAME: 'Host Name',
      PORT: 'Port',
      PROTOCOl: 'Protocol',
      USER_NAME: 'User Name',
      ACTION: 'Action',
      DND_NOTE: '**Control when Email are received by your users',
      FREQUENCY_CAPPING_NOTE:
        '**Limit the number of email you send to your users in a given period',
      SAVE_SEND_CRITERIA: {
        RADIO_LABEL_3:
          'Send only one message across Email/Connectors Campaigns',
      },
    },
    SMS_CHANNEL: {
      FREQUENCY_CAPPING: 'FREQUENCY CAPPING',
      DO_NOT_DISTURB: 'DO NOT DISTURB',
      NO_CONNECTOR_SELECTED: 'No Connector Selected',
      DND_LABEL: 'DND',
      DND_NOTE: '**Control when SMS are received by your users',
      FREQUENCY_CAPPING_LABEL: 'Frequency Capping',
      FREQUENCY_CAPPING_NOTE:
        '**Limit the number of SMS you send to your users in a given period',
      FC_CRIETERIA_1: 'Send a maximum of',
      FC_CRIETERIA_2: 'SMS to users in',
      FC_CRIETERIA_3: 'days',
      FC_REFRESH_TEXT: 'Refresh the Frequency Capping Daily at',
      MSG_DND_PERIOD_LABEL: 'For the messages generated during the DND period',
      MSG_DND_PERIOD: {
        RADIO_LABEL_1: 'Discard these messages and do not send them later',
        RADIO_LABEL_2:
          'Save these messages and send them after DND period is over',
      },
      SAVE_SEND_CRITERIA_LABEL: 'Save and Send Criteria',
      SAVE_SEND_CRITERIA: {
        RADIO_LABEL_1: 'Send all the queued messages',
        RADIO_LABEL_2: 'Send only one message from each campaign',
        RADIO_LABEL_3: 'Send only one message across SMS/Connectors Campaigns',
      },
      ORDER_QUOTED_MSG_LABEL: 'Order in which queued messages should be sent',
      ORDER_QUOTED_MSG: {
        RADIO_LABEL_1: 'Send most recent message first (Last in first out)',
        RADIO_LABEL_2: 'Send least recent message first (First in first out)',
      },
      CONTROL_QUEQED_MSG_LABLE: 'Control queued messages sending',
      CONTROL_QUEQED_MSG: {
        RADIO_LABEL_1: 'Send all messages at once',
        RADIO_LABEL_2A: 'Send messages at a gap of',
        RADIO_LABEL_2B: 'mins',
      },
      SET_DND_PERIOD: {
        SET_DND_PERIOD_LABEL: 'Set DND Period',
        TO: 'to',
        TIMEZONE_NOTE: "DND will be activated based on user's timezone",
      },
      SENDER_TYPE: 'Sender Type',
      SENDER_NAME: 'Sender Name',
      SENDER_ID: 'Sender ID',
      KALEYRA: 'Kaleyra',
      TATA: 'Tata',
      SENDER_TYPE_SELECT: {
        PROMOTIONAL: 'Promotional',
        TRANSACTIONAL: 'Transactional',
      },
      SENDER_NAME_PLACEHOLDER: 'Please enter a sender name',
      SENDER_ID_PLACEHOLDER: 'Please enter a sender ID',
      API_KEY_PLACEHOLDER: 'Please enter a API Key',
      CALLBACK_URL_PLACEHOLDER: 'Please enter a callback url',
      INBOX_NAME_PLACEHOLDER: 'Select Inbox',
      API_KEY_LABEL: 'API Key',
      CALLBACK_URL_LABEL: 'Callback URL',
      INBOX_NAME: 'Inbox Name',
      REQUIRED_VALIDATION: 'This field is required!',
      MIN_EMAIL_COUNT: 'Minimum value required is 1',
      URL_VALIDATION_MSG: 'Callback URL must be a valid URL!',
      API_PROVIDER: 'API Provider',
      ACTION: 'Action',
      ADD_CONFIG_BTN: '+Add Configuration',
      ADD_CONFIG_LABEL: 'Add Configuration',
      EDIT_CONFIG_LABEL: 'Edit Configuration',
      SAVE: 'Save',
      UPDATE: 'Update',
      APP_TIMEZONE: 'App Timezone',
      USER_TIMEZONE: 'User TimeZone',
      INBOX_MAPPED_ERROR_MESSAGE: 'Selected Inbox is already mapped',
    },
    WHATSAPP_CHANNEL: {
      CHANNEL_NAME: 'Name',
      API_PROVIDER: 'API Provider',
      PHONE_NUMBER: 'Phone Number',
      PHONE_NUMBER_ID: 'Phone Number Id',
      API_TOKEN: 'Api Token',
      WABA_ID: 'WABA Id',
      AUTH_KEY: 'Auth Key(Kong)',
      CHANNEL_NAME_PLACEHOLDER: 'Please enter Name',
      PHONE_NUMBER_PLACEHOLDER: 'Please enter a Phone number',
      PHONE_NUMBER_ID_PLACEHOLDER: 'Please enter a Phone number ID',
      API_TOKEN_PLACEHOLDER: 'Please enter a API Key',
      WABA_ID_PLACEHOLDER: 'Please enter a WABA ID',
      AUTH_KEY_PLACEHOLDER: 'Please enter a Authorization Token',
      TATA_COMMUNICATIONS: 'TATA Communications',
      FC_CRIETERIA_2: 'Whatsapp to users in',
      FREQUENCY_CAPPING_NOTE:
        '**Limit the number of whatsapp you send to your users in a given period',
      SAVE_SEND_CRITERIA: {
        RADIO_LABEL_3:
          'Send only one message across Whatsapp/Connectors Campaigns',
      },
      DND_NOTE: '**Control when Whatsapp are received by your users',
      TABLE_HEADER: {
        ACTION: 'Action',
        NAME: 'Name',
        PHONE_NUMBER: 'Phone Number',
        PHONE_NUMBER_ID: 'Phone Number Id',
        API_KEY_LABEL: 'API Key',
        API_PROVIDER_LABEL: 'API Provider',
        AUTH_KEY_LABEL: 'Auth Key',
        WABA_ID: 'WABA Id',
      },
      API: {
        DELETE: {
          SUCCESS_MESSAGE: 'Deleted Successfully',
        },
      },
    },
    MOBILE_CHANNEL: {
      DEFAULT_NOTIFICATION_ICON: 'Default Notification Icon',
      RECOMMENDED_ICON_SIZE: 'Recommended Size - 192px × 192px',
      UPLOAD: 'Browse & Upload',
      CHANNEL_NAME_API: 'mobile_push',
      ANDROID: {
        PLATFORM: 'android',
        FCM_AUTHENTICATION: 'FCM Authentication',
        PRIVATE_KEY: 'Private key file - (Recommended)',
        FCM_SERVER_KEY: 'FCM Server key (Legacy)',
        FILE_TYPE: 'Key file - JSON(.json)',
        FILE_UPLOADED: 'Uploaded!',
        NOTIFICATION_ALERT_UPDATE: 'Configuration added successfully.',
        NOTIFICATION_ALERT_ADDED: 'Configuration updated successfully.',
        FORM: {
          SERVER_KEY: 'Server Key',
          ADDITIONAL_SERVER_KEY: 'Additional Server Key (Optional)',
          PACKAGE_NAME:
            'Package Name (Optional) (You can find your package name as application ID in build.gradle file)',
          PLACEHOLDER: {
            SERVER_KEY: 'Enter GSM Key',
            ADDITIONAL_SERVER_KEY: 'Enter additional server key',
            PACKAGE_NAME: 'Enter package name',
          },
          ERRORS: {
            SERVER_KEY: 'Please enter GSM Key is required',
            ADDITIONAL_SERVER_KEY:
              'Please enter additional server key is required',
            PACKAGE_NAME: 'Please enter package name is required',
          },
        },
      },
      IOS: {
        IOS_AUTHENTICATION: 'iOS Authentication',
        APNS_AUTHENTICATION_KEY: 'APNS Authentication Key',
        APNS_PROVIDER_CERTIFICATE: 'APNS Provider Certificate',
        SHOW_IOS_IMPRESSION_TEXT:
          'Show iOS impression count in Campaign Analytics and all campaigns page. Requires additional integration with iOS SDK',
        FILE_TYPE: 'Key file - iPhone(.p8):',
        IPHONE_CERTIFICATE: 'iPhone Certificate',
        IPHONE_CERTIFICATE_FILE_TYPE: 'Certificate file - iPhone(.pem):',
        IPAD_CERTIFICATE: 'iPad Certificate',
        IPAD_CERTIFICATE_FILE_TYPE: 'Certificate file - iPad(.pem):',
        FORM: {
          TEAM_ID: 'Team ID',
          KEY_ID: 'Key ID',
          BUNDLE_ID: 'Bundle ID',
          BUNDLE_ID_FOR_IPAD: 'Bundle ID For iPad',
          SHOW_IOS_IMPRESSIONS: 'Show iOS impressions',
          PASSWORD: 'Password for the key',
          PLACEHOLDER: {
            TEAM_ID: 'Enter team id',
            KEY_ID: 'Enter key id',
            BUNDLE_ID: 'Enter bundle id',
            BUNDLE_ID_FOR_IPAD: 'Enter bundle id for iPad',
            PASSWORD: 'Password',
          },
          ERROR_MESSAGES: {
            KEY_FILE: 'Please provide key file',
            TEAM_ID: 'Team ID is required',
            KEY_ID: 'Key ID is required',
            BUNDLE_ID: 'Bundle ID is required',
            I_PHONE_CERTIFICATE: 'Iphone Certificate is required',
            I_PHONE_CERTIFICATE_PWD: 'Iphone Certificate password is required',
          },
        },
      },
    },
  },
};
