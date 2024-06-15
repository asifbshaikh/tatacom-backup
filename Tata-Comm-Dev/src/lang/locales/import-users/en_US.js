module.exports = {
  IMPORT_USERS: {
    UPLOAD_CSV: {
      UPLOAD: 'Upload Audience',
      DRAG_AND_DROP_CSV:
        'Drag your file here Or Click here to upload (Only CSV file)',
      REMOVE_CSV: 'Remove',
    },
    CHECKBOXES: {
      CHECK_FIRST_ROW: 'First row contains column names',
      UPDATE_USERS: 'Update existing audience only',
      SKIPPED_COLUMNS: 'Show Skipped Columns',
      CREATE_CUSTOM_SEGMENTS: 'Create Custom Segments',
      ANONYMOUS_IDENTIFIER: 'Anonymous ID',
      UPDATE_USERS_TOOLTIP:
        'Enabling this option will only update existing audience, no action will be taken on new audience.',
    },
    SAMPLE_CSV: {
      DOWNLOAD_SAMPLE_CSV: 'Download a sample file',
      SAMPLE_FILENAME: 'Sample-User-Details',
      DOWNLOAD_SAMPLE_CSV_TOOLTIP:
        'File should be opened in a CSV editor for modification.',
    },
    BUTTONS: {
      PREVIOUS: 'Previous',
      NEXT: 'Next',
      FINISH: 'Finish',
    },
    MAP_CSV_DATA: {
      MAP: 'Map Columns',
      MAP_COLUMN: 'Map this column to:',
      ADD_SKIPPED_COLUMN: 'Include the column',
      SKIP_COLUMN: 'Skip the column',
    },
    SELECTION_OF_USER: {
      'STEP-1': 'Step-1 : Selection of type of audience',
      DESCRIPTION: 'Select Audience Type',
    },
    REGISTERED: {
      USER: 'Registered Audience',
      'USE-CASE': 'Application Scenarios -',
      'USE-CASE_DESCRIPTION':
        'This feature is most commonly used to update the audience attributes of existing audience.',
      PREREQUISITE: 'Prerequisite -',
      PREREQUISITE_DESCRIPTION:
        'It is mandatory for your list to contain a column that holds a unique identifier for each item, which identifies audience account in your system.',
    },
    ANONYMOUS: {
      USER: 'Anonymous Audience',
      'USE-CASE': 'Application Scenarios -',
      'USE-CASE_DESCRIPTION':
        'This feature is most commonly used for sending Emails, SMS to potential customers.',
      PREREQUISITE: 'Prerequisite -',
      PREREQUISITE_DESCRIPTION:
        'It is mandatory that you mark a column from your list (email, mobile number, etc) as an identifier for this audience.',
    },
    UPLOAD_USER: {
      'STEP-2': 'Step-2 : Upload the selected type of audience',
      DESCRIPTION: 'Please upload the CSV file to import audience',
    },
    WIZARD: {
      'STEP-1': 'Select Audience',
      'STEP-2': 'Upload',
      'STEP-3': 'Map',
    },
    LIST: {
      UPLOADED_DATE: 'Uploaded Date',
      FILE_NAME: 'File Name',
      IMPORT_TYPE: 'Import Type',
      TOTAL_ROWS_IN_FILE: 'Total Rows In File',
      NEW_USERS_ADDED: 'Added',
      USERS_UPDATED: 'Updated',
      USERS_FAILED: 'Failed',
      SKIPPED_RECORDS: 'Skipped Records',
      CUSTOM_SEGMENT: 'Custom Segment',
      STATUS: 'Status',
      DATA: {
        REGISTERED: 'Registered',
        ANONYMOUS: 'Anonymous',
        FAILED: 'Failed',
        COMPLETED: 'Completed',
        CREATED: 'Created',
        PROCESSING: 'Processing',
      },
      TOOLTIP: {
        COMPLETED:
          'The import is complete, but there are errors. Please check your email for details on failed records.',
        FAILED:
          'Your file import has failed. Please upload valid file and try again.',
        PROCESSING:
          'Your imported file is processing. Please refresh the page to check the latest status.',
        CREATED:
          'Your imported file is created. Please refresh the page to check the latest status.',
      },
    },
    COLUMN_TYPE_OPTIONS: {
      STRING: 'String',
      DATE_TIME: 'Date Time',
      NUMBER: 'Number',
      BOOLEAN: 'Boolean',
      DATE: 'Date',
    },
    ALERTS: {
      INVALID_FILE_NAME: 'Invalid Filename with these character set !@#$%^&*?',
      INVALID_FILE_SIZE: 'Filename should not exceed 30  character set.',
      HAS_NOT_HEADER:
        "Please uncheck 'First row contains column names' checkbox",
    },
    API_UPLOAD_MESSAGE: {
      SUCCESS_MESSAGE: 'Successfully uploaded the file',
    },
    PLACEHOLDER: {
      SELECT_TYPE: 'Select Type',
      SELECT_ATTRIBUTE: 'Select Attribute',
    },
    ERROR_MSG: {
      SELECT_TYPE: 'Select Type',
      SET_CUSTOM_ATTRIBUTE: 'Set custom attribute name first then select type.',
      ATTRIBUTE_ALREADY_EXISTS: 'This attribute already exists',
      FILE_TYPE_ERROR: 'File type must be .csv',
      FILE_SIZE_ERROR: 'CSV File should be less than 10MB',
      FILE_NAME_ERROR: 'File name should not contain * and %.',
      VALIDATE_ATTRIBUTE_MAPPING: 'Each attribute has to be mapped or skipped.',
      CUSTOM_ATTRIBUTE_NAME_REQUIRED: 'Custom attribute name is required.',
      VALIDATE_MANDATORY_EMAIL_PHONE_EXISTS:
        'Mandatory to map phone number and email attributes',
      COLUMN_REQUIRED_CUSTOMER_ID:
        'Attached file must have "Customer ID" in the first column',
      COLUMN_REQUIRED_EMAIL_PHONE:
        'Attached file must have "Email" in the first column and "Phone Number" in the second column.',
    },
    MODAL: {
      MODAL_HEADER: 'Warning !',
      MODAL_BODY:
        'It will discard the changes you made. Do you wish to continue ?',
      MODAL_FOOTER_BUTTON: 'Yes',
      MODAL_FOOTER_CANCEL: 'No',
    },
    COLUMN_CARDS: {
      EMAIL: 'Email',
      PHONE_NUMBER: 'Phone Number',
      CUST_ID: 'Customer Id',
      STRING: 'String',
    },
  },
};
