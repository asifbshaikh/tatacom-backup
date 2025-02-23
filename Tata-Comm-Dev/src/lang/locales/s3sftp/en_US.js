module.exports = {
  S3SFTP: {
    WIZARD: {
      STEP_1: 'Source',
      STEP_2: 'Format',
      STEP_3: 'Import Configuration and action',
      STEP_4: 'Scheduling',
    },
    ALL_IMPORTS: {
      BUTTON: {
        S3SFTP_IMPORT: 'DB Import',
        AUDIENCE: 'Audience',
        EVENT: 'Event',
      },
      TAB: {
        AUDIENCE: 'Audience',
        EVENTS: 'Events',
      },
      TABLE_HEADER: {
        NAME: 'Name',
        TYPE: 'Type',
        CREATED_BY: 'Created On',
        CREATED_AT: 'Created On',
        LAST_RUN_AT: 'Last Run Time',
        STATUS: 'Status',
        FILE_PROCESSED: 'File Processed',
        ACTION: 'Action',
      },
      ACTION_BUTTON: {
        EDIT: 'Edit',
        DELETE: 'Delete',
        DEACTIVATE: 'Deactivate',
      },
    },
    SOURCE: {
      LABEL: {
        SELECT_SOURCE_TYPE: 'Select Source Type',
        SELECT_AUDIENCE_TYPE: 'Select Audience Type',
        SELECT_EVENT: 'Select Event',
        DOWNLOAD_A_SAMPLE_DATABASE_STRUCTURE_FILE:
          'Download a sample Database Structure file',
      },
      TITLE: {
        S3: 'S3',
        SFTP: 'SFTP',
        DATABASE: 'DATABASE',
        REGISTERED_AUDIENCE: 'Registered Audience',
        ANONYMOUS_AUDIENCE: 'Anonymous Audience',
      },
      DESCRIPTION: {
        S3: 'Import Audience from files stored in S3 buckets',
        SFTP: 'Import Audience from files stored in SFTP clients',
        DATABASE: 'Import Audience from tables in Database',
        REGISTERED_AUDIENCE:
          'These are the audience who have signed up or registered on your app or website',
        ANONYMOUS_AUDIENCE:
          'These are the audience who have not yet signed up but you have some data about them',
        SAMPLE_DB_STRUCTURE_FOR: 'Sample DB structure for ',
        AND: ' and ',
        AUDIENCE_SAMPLE_DB_INSTRUCTION:
          'Follow This DB Structure for Audience Import',
        EVENT_SAMPLE_DB_INSTRUCTION:
          'Follow This DB Structure for Event Import',
      },
    },
    BUTTONS: {
      PREVIOUS: 'Previous',
      NEXT: 'Next',
      UPDATE: 'Update',
      PUBLISH: 'Publish',
      FINISH: 'Finish',
    },
    CONFIGURE_SFTP: {
      DESCRIPTION: 'Configure SFTP',
      LABEL: {
        USERNAME: 'Username',
        PASSWORD: 'Password',
        FOLDER_URL: 'Folder URL',
        IMPORT_NAME: 'Import Name',
        FILE_CONFIGURE: 'File name configurations',
        DATE_TIME_FORMAT: 'Date time format',
        FETCH_FILE: 'Fetch File',
        FOLDER_DESCRIPTION: 'Only csv files are supported',
        REGISTER_VALID_FILE_DESCRIPTION:
          'File names should start with the prefix and datetime separated by "_" . Example: event_customer_login_31032023 ',
        REGISTER_EVENT_VALID_FILE_DESCRIPTION:
          'File names should start with the prefix <event name>_, eg:Purchase Summary_',
        REGISTER_EVENT_VALID_DATE_FILE_DESCRIPTION:
          'File names should be of the format registered_audience_data_<date time format>.csv, eg: registered_audience_data_01311996.csv',
        PREVIEW: 'Showing Preview of top 5 rows',
        PREFIX: 'Prefix',
        FILE_PREVIEW: 'File to preview',
        SAMPLE_FILE_NAME: 'event_customer_login_31032023.pgp',
      },
      PLACEHOLDER: {
        USERNAME: 'Enter Username',
        PASSWORD: 'Enter Password',
        FOLDER_URL: 'Enter Folder URL',
        IMPORT_NAME: 'Enter an import name',
        DATE_TIME_FORMAT: 'Select Date time format',
        PREFIX: 'Enter Prefix',
      },
      VALIDATION: {
        EMAIL_VALIDATION: 'At least one email is required',
        VALID_EMAIL: 'Valid email',
        INVALID_EMAIL: 'Invalid email',
        EMAIL_COUNT: 'Can not enter more then 10 emails',
        EMAIL_COUNT_EXCEEDED: 'Email Exceeded',
      },
    },
    IMPORT_CONFIG: {
      MAP_COLUMNS: 'Map Columns',
      LABEL: {
        TOTAL_COLUMNS: 'Total Column in file',
        COLUMN_NAME: 'Column Name',
        MAP_ATTRIBUTE: 'Map attribute',
        MORE_ACTION: 'More action',
        MARKED_AUDIENCE_IDENTIFIER: 'Marked as audience identifier',
        SKIP_COLUMN: 'Skip column',
        ADD_ATTRIBUTE: 'Add attribute',
        ACTIONS: 'Actions',
        SEND_IMPORT_STATUS: 'Send import status to',
        EMAIL_NOTE: 'Maximum of 10 emails can be entered',
        ADD_COLUMN: 'Add Column',
        ATTRIBUTE: 'Attribute',
        DATA_TYPE: 'Data type',
        CANCEL: 'Cancel',
        SUBMIT: 'Submit',
        CREATE_NEW_ATTRIBUTE: 'Create new attribute',
        SELECT_EMAIL_ID: 'Select email id',
        ATTRIBUTE_NAME: 'Attribute name',
      },
      PLACEHOLDER: {
        ENTER_COLUMN_NAME: 'Enter Column name',
        ATTRIBUTE: 'Select attribute',
        DATA_TYPE: 'Select data type',
        SELECT_EMAIL_ID: 'Select email id',
        ATTRIBUTE_NAME: 'Enter Attribute name',
      },
    },
    CONFIGURE_S3: {
      LABEL: {
        SELECT_FILE: 'Select file',
        S3_BUCKET_NAME: 'S3 Bucket Name',
        S3_ACCESS_KEY: 'S3 access key',
        S3_SECRET_KEY: 'S3 secret key',
        REGION: 'Region',
        OPTIONAL: '(optional)',
        FOLDER_PATH: 'Folder path',
        FOLDER_DESCRIPTION: 'Only csv files are supported',
        IMPORT_NAME: 'Import Name',
      },

      PLACEHOLDER: {
        S3_BUCKET_NAME: 'Enter S3 bucket name',
        S3_ACCESS_KEY: 'Enter S3 access key',
        S3_SECRET_KEY: 'Enter S3 secret key',
        REGION: 'Select Region',
        FOLDER_PATH: 'Enter folder path',
        IMPORT_NAME: 'Enter an import name',
      },
    },
    CONFIGURE_DB: {
      LABEL: {
        IMPORT_NAME: 'Import Name',
        IMPORT_SOURCE: 'Import source',
        DATABASE_CONNECTION: 'Database Connection',
        TABLE_NAME: 'Table Name',
        TABLE_MULTIPLE: 'Table contains multiple events',
        COLUMN_TIME: 'Column containing timestamp',
        PREVIEW: 'Preview',
      },
      PLACEHOLDER: {
        IMPORT_NAME: 'Enter an import name',
        IMPORT_SOURCE: 'Select import source',
        TABLE_NAME: 'Enter Table Name',
        COLUMN_TIME: 'Enter Column containing timestamp',
      },
    },
    DB_SETTING: {
      DB_SETTING_LABEL: 'Database Connection',
      DATABASE_CONNECTION: 'Database Connection',
      ADD_CONNECTION: 'Add Connection',
      ADD_NEW_CONNECTION: 'Add New Connection',
      EDIT_CONNECTION: 'Edit Connection',
      MANAGE:
        'Manage your database connections here. These connections can be used to setup various import export on Engage',
      CONNECTION_DETAILS: 'Connection Details',
      LABEL: {
        CONNECTION_NAME: 'Connection Name',
        DATABASE: 'Database',
        LOGIN_CREDENTIALS: 'Login Credentials',
        USERNAME: 'Username',
        PASSWORD: 'Password',
        TEST_CONNECTION: 'Test Connection',
        SAVE_CONNECTION: 'Save Connection',
        EDIT_CONNECTION: 'Edit Connection',
        RESET: 'Reset',
        HOST: 'Host',
        PORT: 'Port',
        ADAPTER: 'Adapter',
        ENCODING: 'Encoding',
        TABLE_NAME: 'Table Name',
        AUDIENCE_IMPORTS: 'Audience imports',
        EVENT_IMPORTS: 'Event imports',
        CONNECTION_NAME_TOOLTIP:
          'Enter the name which will be shown as display name on engage dashboard',
        DATABASE_TOOLTIP: 'Enter the name of the source database',
        ADAPTER_TOOLTIP:
          'Enter the type of database(eg: postgresql, mongo, etc.)',
        HOST_TOOLTIP: 'Enter the host information of database',
        PORT_TOOLTIP: 'Enter the port number',
        ENCODING_TOOLTIP:
          'Enter the encoding type of source database(eg: UTF-8, unicode, etc.)',
        USERNAME_TOOLTIP: 'Enter the username of source database',
        PASSWORD_TOOLTIP: 'Enter the password of source database',
      },
      PLACEHOLDER: {
        CONNECTION_NAME: 'Enter Connection Name',
        DATABASE: 'Enter Database',
        USERNAME: 'Enter Username',
        PASSWORD: 'Enter Password',
        HOST: 'Enter Host',
        PORT: 'Enter Port',
        ADAPTER: 'Enter Adapter',
        ENCODING: 'Enter Encoding',
        TABLE_NAME: 'Enter Table Name',
      },

      MESSAGES: {
        SUCCESS_DB_TEST: 'Test connection established successfully',
        SUCCESS_DB_SAVE: 'Connection saved successfully',
        SUCCESS_DB_IMPORT: 'DB imported successfully',
        UPDATE_DB_IMPORT: 'DB updated successfully',
      },
    },
    SCHEDULE: {
      ONE_TIME: 'One Time',
      PERIODIC: 'Periodic',
      SCHEDULE_ONE_TIME: 'Schedule One Time',
      SCHEDULE_PERIODIC: 'Schedule Periodic',
      LABEL: {
        START_TIME: 'Start Time',
        DB_IMPORT_WILL_NEXT_START_ON: 'DB import will next start on',
        START_DB_IMPORT_IMMEDIATELY: 'Start DB import immediately',
        TIME_ZONE: 'Time Zone',
      },
    },
    DB_CONNECTION_LIST: {
      LABEL: {
        CONNECTION_NAME: 'Connection Name',
        DATABASE_NAME: 'Database Name',
        CREATED_AT: 'Created On',
        ACTION: 'Action',
      },
      DELETE_MODAL: {
        MODAL_TITLE: 'Delete Database Connection',
        CONFIRM_MESSAGE: 'Are you sure to delete?',
        CONFIRM_BUTTON: 'Yes, Delete',
        DENY_BUTTON: 'No, Keep',
        API: {
          SUCCESS_MESSAGE: 'Connection deleted successfully',
          ERROR_MESSAGE:
            'Could not delete DB Connection. Please try again later.',
        },
      },
    },
    IMPORT_SCHEDULER_DETAIL: {
      IMPORT_SCHEDULER_INFO: 'Import Scheduler Info',
      IMPORT_TYPE: 'Import Type',
      ONE_TIME: 'Immediately',
      PERIODIC: 'Periodic',
      FIXED_TIME: 'Fixed Time',
      REGISTERED_AUDIENCE: 'Registered',
      ANONYMOUS_AUDIENCE: 'Anonymous',
      STATUS: 'Status',
      DATABASE: 'Database',
      TABLENAME: 'Table Name',
      LAST_RUN_TIME: 'Last Run Time',
      NEXT_RUN_TIME: 'Next Run Time',
      TIME_ZONE: 'Time Zone',
      IMPORT_NAME: 'Import Name',
      SEGMENT_NAME: 'Segment Name',
      PROCESSED_COUNT: 'Processed Rows Count',
      TOTAL_ROWS_COUNT: 'Total Rows Count',
      SYNCED_COUNT: 'Synced Count',
      CREATED_AT: 'Created On',
      LAST_UPDATED: 'Last Updated',
      RUN_TIME: 'Run Time',
      SOURCE_DB: 'Source DB',
      DELETE_MODAL: {
        MODAL_TITLE: 'Deactivate Database Import',
        CONFIRM_MESSAGE: 'Are you sure to deactivate?',
        CONFIRM_BUTTON: 'Yes, Deactivate',
        DENY_BUTTON: 'No, Keep',
        API: {
          SUCCESS_MESSAGE: 'Database Import deactivated successfully',
          ERROR_MESSAGE:
            'Could not deactivate Database Import. Please try again later.',
        },
      },
    },
  },
};
