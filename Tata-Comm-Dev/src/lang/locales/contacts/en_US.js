module.exports = {
  CONTACT_PANEL: {
    NOT_AVAILABLE: 'Not Available',
    EMAIL_ADDRESS: 'Email Address',
    PHONE_NUMBER: 'Phone number',
    COPY_SUCCESSFUL: 'Copied to clipboard successfully',
    COMPANY: 'Company',
    LOCATION: 'Location',
    CONVERSATION_TITLE: 'Conversation Details',
    VIEW_PROFILE: 'View Profile',
    BROWSER: 'Browser',
    OS: 'Operating System',
    INITIATED_FROM: 'Initiated from',
    INITIATED_AT: 'Initiated at',
    IP_ADDRESS: 'IP Address',
    NEW_MESSAGE: 'New message',
    CONVERSATIONS: {
      NO_RECORDS_FOUND:
        'There are no previous conversations associated to this contact.',
      TITLE: 'Previous Conversations',
    },
    LABELS: {
      CONTACT: {
        TITLE: 'Contact Labels',
        ERROR: "Couldn't update labels",
      },
      CONVERSATION: {
        TITLE: 'Conversation Labels',
        ADD_BUTTON: 'Add Labels',
      },
      LABEL_SELECT: {
        TITLE: 'Add Labels',
        PLACEHOLDER: 'Search labels',
        NO_RESULT: 'No labels found',
      },
    },
    MERGE_CONTACT: 'Merge contact',
    CONTACT_ACTIONS: 'Contact actions',
    MUTE_CONTACT: 'Mute Conversation',
    UNMUTE_CONTACT: 'Unmute Conversation',
    MUTED_SUCCESS: 'This conversation is muted for 6 hours',
    UNMUTED_SUCCESS: 'This conversation is unmuted',
    SEND_TRANSCRIPT: 'Send Transcript',
    EDIT_LABEL: 'Edit',
    SIDEBAR_SECTIONS: {
      CUSTOM_ATTRIBUTES: 'Custom Attributes',
      CONTACT_LABELS: 'Contact Labels',
      PREVIOUS_CONVERSATIONS: 'Previous Conversations',
    },
  },
  EDIT_CONTACT: {
    BUTTON_LABEL: 'Edit Contact',
    TITLE: 'Edit contact',
    DESC: 'Edit contact details',
  },
  CREATE_CONTACT: {
    BUTTON_LABEL: 'New Contact',
    TITLE: 'Create new contact',
    DESC: 'Add basic information details about the contact.',
  },
  IMPORT_CONTACTS: {
    BUTTON_LABEL: 'Import',
    TITLE: 'Import Contacts',
    DESC: 'Import contacts through a CSV file.',
    DOWNLOAD_LABEL: 'Download a sample csv.',
    FORM: {
      LABEL: 'CSV File',
      SUBMIT: 'Import',
      CANCEL: 'Cancel',
    },
    SUCCESS_MESSAGE: 'Contacts saved successfully',
    ERROR_MESSAGE: 'There was an error, please try again',
  },
  DELETE_CONTACT: {
    BUTTON_LABEL: 'Delete Contact',
    TITLE: 'Delete contact',
    DESC: 'Delete contact details',
    CONFIRM: {
      TITLE: 'Confirm Deletion',
      MESSAGE: 'Are you sure to delete {contactName} ?',
      YES: 'Yes, Delete',
      NO: 'No, Keep',
    },
    API: {
      SUCCESS_MESSAGE: 'Contact deleted successfully',
      ERROR_MESSAGE: 'Could not delete contact. Please try again later.',
    },
  },
  NEW_CONVERSATION_CONTACT: {
    FORM: {
      MESSAGE: {
        LABEL: 'Message',
        PLACEHOLDER: ' Write your Message Here',
      },
      INBOX: {
        LABEL: 'Inbox',
        PLACEHOLDER: 'Select Inboxes',
      },
      SUBJECT: 'Subject',
      TO: 'To',
      MESSAGE_REQUIRED: "Message can't be empty",
      INBOX_REQUIRED: 'Select an inbox',
      SUBJECT_REQUIRED: "Subject can't be empty",
      SUCCESS: 'New conversation created successfully.',
    },
  },
  CONTACT_FORM: {
    FORM: {
      SUBMIT: 'Submit',
      CANCEL: 'Cancel',
      AVATAR: {
        LABEL: 'Contact Avatar',
      },
      NAME: {
        PLACEHOLDER: 'Enter the full name of the contact',
        LABEL: 'Full Name',
      },
      FIRST_NAME: {
        PLACEHOLDER: 'Enter the first name of the contact',
        LABEL: 'First Name',
      },
      MIDDLE_NAME: {
        PLACEHOLDER: 'Enter the middle name of the contact',
        LABEL: 'Middle Name',
      },
      LAST_NAME: {
        PLACEHOLDER: 'Enter the last name of the contact',
        LABEL: 'Last Name',
      },
      BIO: {
        PLACEHOLDER: 'Enter the bio of the contact',
        LABEL: 'Bio',
      },
      EMAIL_ADDRESS: {
        PLACEHOLDER: 'Enter the email address of the contact',
        LABEL: 'Email Address',
        DUPLICATE: 'This email address is in use for another contact.',
      },
      PHONE_NUMBER: {
        PLACEHOLDER: 'Enter the phone number of the contact',
        LABEL: 'Phone Number',
        HELP: 'Phone number should be of E.164 format eg: +1415555555 [+][country code][area code][local phone number]',
        ERROR: 'Phone number should be either empty or of E.164 format',
        DUPLICATE: 'This phone number is in use for another contact.',
      },
      LOCATION: {
        PLACEHOLDER: 'Enter the location of the contact',
        LABEL: 'Location',
      },
      COMPANY_NAME: {
        PLACEHOLDER: 'Enter the company name',
        LABEL: 'Company Name',
      },
      GENDER: {
        PLACEHOLDER: 'Select Gender',
        LABEL: 'Gender',
      },
      CITY: {
        PLACEHOLDER: 'Enter City of the contact',
        LABEL: 'City',
      },
      ADDRESS: {
        PLACEHOLDER: 'Enter Address of the contact',
        LABEL: 'Address',
      },
      COUNTRY: {
        PLACEHOLDER: 'Select Country of the contact',
        LABEL: 'Country',
      },
      DATE_OF_BIRTH: {
        PLACEHOLDER: 'Select Date of Birth of the contact',
        LABEL: 'Birthday',
      },
      SOCIAL_PROFILES: {
        FACEBOOK: {
          PLACEHOLDER: 'Enter the Facebook username',
          LABEL: 'Facebook',
        },
        TWITTER: {
          PLACEHOLDER: 'Enter the Twitter username',
          LABEL: 'Twitter',
        },
        LINKEDIN: {
          PLACEHOLDER: 'Enter the LinkedIn username',
          LABEL: 'LinkedIn',
        },
        GITHUB: {
          PLACEHOLDER: 'Enter the Github username',
          LABEL: 'Github',
        },
      },
    },
    VALIDATION: {
      NAME: 'Please enter valid name',
      FIRST_NAME: 'Please enter valid first name',
      MIDDLE_NAME: 'Please enter valid middle name',
      LAST_NAME: 'Please enter valid last name',
      EMAIL: 'Invalid Email address',
      PHONE_NUMBER: 'Phone Number not in correct format',
      CITY: 'Please enter valid city name',
      BIRTH_DATE: 'Date of birth must be less than the current date',
    },
    SUCCESS_MESSAGE: 'Contact saved successfully',
    ERROR_MESSAGE: 'There was an error, please try again',
  },
  NEW_CONVERSATION: {
    BUTTON_LABEL: 'Start conversation',
    TITLE: 'New conversation',
    DESC: 'Start a new conversation by sending a new message.',
    NO_INBOX:
      "Couldn't find an inbox to initiate a new conversation with this contact.",
    FORM: {
      TO: {
        LABEL: 'To',
      },
      INBOX: {
        LABEL: 'Inbox',
        ERROR: 'Select an inbox',
      },
      SUBJECT: {
        LABEL: 'Subject',
        PLACEHOLDER: 'Subject',
        ERROR: "Subject can't be empty",
      },
      MESSAGE: {
        LABEL: 'Message',
        PLACEHOLDER: 'Write your message here',
        ERROR: "Message can't be empty",
      },
      SUBMIT: 'Send message',
      CANCEL: 'Cancel',
      SUCCESS_MESSAGE: 'Message sent!',
      GO_TO_CONVERSATION: 'View',
      ERROR_MESSAGE: "Couldn't send! try again",
    },
    PRIVATE_NOTES: 'private notes',
  },
  CONTACTS_PAGE: {
    HEADER: 'Contacts',
    FIELDS: 'Contact fields',
    SEARCH_BUTTON: 'Search',
    SEARCH_INPUT_PLACEHOLDER: 'Search for contacts',
    FILTER_CONTACTS: 'Filter',
    FILTER_CONTACTS_SAVE: 'Save filter',
    FILTER_CONTACTS_DELETE: 'Delete filter',
    OPTION_LABELS: {
      CONTACT_DETAILS: 'Contact Details',
      NEW_MESSAGE: 'New Message',
      EDIT_CONTACT: 'Edit Contact',
      DELETE_CONTACT: 'Delete Contact',
      MERGE_CONTACT: 'Merge Contacts',
      NOT_AVAILABLE: 'Not Available',
    },
    LIST: {
      LOADING_MESSAGE: 'Loading contacts...',
      404: 'No contacts matches your search 🔍',
      NO_CONTACTS: 'There are no available contacts',
      TABLE_HEADER: {
        NAME: 'Name',
        PHONE_NUMBER: 'Phone Number',
        CONVERSATIONS: 'Conversations',
        LAST_ACTIVITY: 'Last Activity',
        COUNTRY: 'Country',
        CITY: 'City',
        SOCIAL_PROFILES: 'Social Profiles',
        COMPANY: 'Company',
        EMAIL_ADDRESS: 'Email Address',
        ACTION: 'Action',
      },
      VIEW_DETAILS: 'View details',
    },
    AUTO_SUGGEST: {
      PLACEHOLDER: 'Start typing',
    },
    FILTERS: 'Filters',
    FILTERS_OPTIONS: {
      FILTER_CONTACTS: 'Filter Contacts',
      FILTER_SUCCESS: 'Contacts successfully filtered',
      SUBHEADING:
        "Add filters below and hit 'Apply filters' to filter Contacts.",
      STANDARD_FILTERS: 'Standard Filters',
      NAME: 'Name',
      EMAIL: 'Email',
      PHONE_NUMBER: 'Phone Number',
      IDENTIFIER: 'Identifier',
      COUNTRY: 'Country',
      CITY: 'City',
      LAST_ACTIVITY: 'Last Activity',
      CUSTOM_ATTRIBUTES: 'Custom Attributes',
      EQUAL_TO: 'Equal To',
      NOT_EQUAL_TO: 'Not Equal To',
      AND: 'AND',
      OR: 'OR',
      ENTER_VALUE: 'Enter Value',
      CREATED_AT: 'Created At',
      GREATER_THAN: 'Is greater than',
      LESSER_THAN: 'Is lesser than',
      IS_X_DAYS: 'Is x days before',
      CONTAINS: 'Contains',
      DOES_NOT_CONTAIN: 'Does not contain',
      PRESENT: 'Is present',
      NOT_PRESENT: 'Is not present',
      CLOSE: 'X',
      EXTRA_FILTER: '+ Add Filter',
      CLEAR_FILTERS: '- Clear All Filters',
      FILTER_WARNING: 'Atleast need one filter',
      CANCEL: 'Cancel',
      SUBMIT: 'Submit',
      APPLY_FILTERS: 'Apply filters',
      TEXT: 'text',
      DATE: 'date',
      NUMBER: 'number',
      WARNING: 'You should have atleast one filter to submit.',
      VALUE: {
        NAME: 'name',
        EMAIL: 'email',
        PHONE_NUMBER: 'phone_number',
        IDENTIFIER: 'identifier',
        COUNTRY: 'country_code',
        CITY: 'city',
        LAST_ACTIVITY: 'last_activity_at',
        CREATED_AT: 'created_at',
        EQUAL_TO: 'equal_to',
        NOT_EQUAL_TO: 'not_equal_to',
        AND: 'and',
        OR: 'or',
        GREATER_THAN: 'is_greater_than',
        LESSER_THAN: 'is_less_than',
        IS_X_DAYS: 'days_before',
      },
    },
    CONTACT_FILTERS: {
      HEADERS: {
        SAVE_FILTER: 'Do you want to save this filter?',
        CONFIRM_DELETION: 'Confirm Deletion',
      },
      LABELS: {
        NAME_THIS_FILTER: 'Name this filter',
        ENTER_A_NAME_FOR_THIS_FILTER: 'Enter a name for this filter',
        DELETE_MODAL_LABEL: 'Are you sure to delete the filter',
        SEGMENT: 'Segment',
      },
      BUTTONS: {
        YES_DELETE: 'Yes, Delete',
        NO_KEEP_IT: 'No, Keep it',
        SAVE_FILTER: 'Save filter',
        CANCEL: 'Cancel',
        ADD_FILTERS: '+ Add Filter',
      },
      MESSAGES: {
        FITLER_SAVED_SUCCESSFULLY: 'Filter saved successfully',
        FILTER_DELTED_SUCCESSFULLY: 'Filter deleted successfully',
      },
    },
  },
  CONTACT_PROFILE: {
    BACK_BUTTON: 'Contacts',
    LOADING: 'Loading contact profile...',
  },
  REMINDER: {
    ADD_BUTTON: {
      BUTTON: 'Add',
      TITLE: 'Shift + Enter to create a task',
    },
    FOOTER: {
      DUE_DATE: 'Due date',
      LABEL_TITLE: 'Set type',
    },
  },
  NOTES: {
    FETCHING_NOTES: 'Fetching notes...',
    NOT_AVAILABLE: 'There are no notes created for this contact',
    HEADER: {
      TITLE: 'Notes',
    },
    LIST: {
      LABEL: 'added a note',
    },
    ADD: {
      BUTTON: 'Add',
      PLACEHOLDER: 'Add a note',
      TITLE: 'Shift + Enter to create a note',
    },
    CONTENT_HEADER: {
      DELETE: 'Delete note',
    },
  },
  EVENTS: {
    HEADER: {
      TITLE: 'Activities',
    },
    BUTTON: {
      PILL_BUTTON_NOTES: 'notes',
      PILL_BUTTON_EVENTS: 'events',
      PILL_BUTTON_CONVO: 'conversations',
    },
  },
  CUSTOM_ATTRIBUTES: {
    ADD_NEW_ATTRIBUTE: '+ Create New Attribute',
    ADD_BUTTON_TEXT: 'Add Attributes',
    BUTTON: 'Add Custom Attribute',
    NOT_AVAILABLE: 'There are no custom attributes available for this contact.',
    COPY_SUCCESSFUL: 'Copied to clipboard successfully',
    ACTIONS: {
      COPY: 'Copy attribute',
      DELETE: 'Delete attribute',
      EDIT: 'Edit attribute',
    },
    ADD: {
      TITLE: 'Create custom attribute',
      DESC: 'Add custom information to this contact.',
    },
    FORM: {
      CREATE: 'Add attribute',
      CANCEL: 'Cancel',
      NAME: {
        LABEL: 'Custom attribute name',
        PLACEHOLDER: 'Eg: shopify id',
        ERROR: 'Invalid custom attribute name',
      },
      VALUE: {
        LABEL: 'Attribute value',
        PLACEHOLDER: 'Eg: 11901 ',
      },
      ADD: {
        TITLE: 'Create new attribute ',
        SUCCESS: 'Attribute added successfully',
        ERROR: 'Unable to add attribute. Please try again later',
      },
      UPDATE: {
        SUCCESS: 'Attribute updated successfully',
        ERROR: 'Unable to update attribute. Please try again later',
      },
      DELETE: {
        SUCCESS: 'Attribute deleted successfully',
        ERROR: 'Unable to delete attribute. Please try again later',
      },
      ATTRIBUTE_SELECT: {
        TITLE: 'Add attributes',
        PLACEHOLDER: 'Search attributes',
        NO_RESULT: 'No attributes found',
      },
      ATTRIBUTE_TYPE: {
        LIST: {
          PLACEHOLDER: 'Select value',
          SEARCH_INPUT_PLACEHOLDER: 'Search value',
          NO_RESULT: 'No result found',
        },
      },
    },
    VALIDATIONS: {
      REQUIRED: 'Valid value is required',
      INVALID_URL: 'Invalid URL',
      FIELD_REQUIRED: 'This field is required.',
      URL_INVALID: 'Valid url required!',
    },
    ALERT_MESSAGES: {
      SAVE_SUCCESS: 'Attribute data updated.',
      STATUS_SUCCESS: 'Conversation status changed.',
    },
  },
  MERGE_CONTACTS: {
    TITLE: 'Merge Contacts',
    DESCRIPTION:
      'Merge Contacts to combine two profiles into one, including all attributes and conversations. In case of conflict, the Primary Contact’ s attributes will take precedence.',
    PRIMARY: {
      TITLE: 'Primary contact',
      HELP_LABEL: 'To be kept',
    },
    CHILD: {
      TITLE: 'Contact To Merge',
      PLACEHOLDER: 'Search for a contact',
      HELP_LABEL: 'To be deleted',
    },
    SUMMARY: {
      TITLE: 'Summary',
      DELETE_WARNING:
        'Contact of <strong>%{childContactName}</strong> will be deleted.',
      ATTRIBUTE_WARNING:
        'Contact details of <strong>%{childContactName}</strong> will be copied to <strong>%{primaryContactName}</strong>.',
    },
    SEARCH: {
      ERROR: 'ERROR_MESSAGE',
    },
    FORM: {
      SUBMIT: 'Merge Contacts',
      CANCEL: 'Cancel',
      CHILD_CONTACT: {
        ERROR: 'Select a child contact to merge',
      },
      SUCCESS_MESSAGE: 'Contact merged successfully',
      ERROR_MESSAGE: 'Could not merge contacts, try again!',
    },
  },
  COMMON_ALERTS: {
    COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
  },
};
