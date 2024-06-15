module.exports = {
  GENERAL_SETTINGS: {
    TITLE: 'Account Settings',
    SUBMIT: 'Update Settings',
    BACK: 'Back',
    UPDATE: {
      ERROR: 'Could not update settings, try again!',
      SUCCESS: 'Successfully updated account settings',
    },
    FORM: {
      ERROR: 'Please fix form errors',
      GENERAL_SECTION: {
        TITLE: 'General Settings',
        NOTE: ' ',
      },
      ACCOUNT_ID: {
        TITLE: 'Account ID',
        NOTE: 'This ID is required if you are building an API based integration',
      },
      NAME: {
        LABEL: 'Account name',
        PLACEHOLDER: 'Your account name',
        ERROR: 'Please enter a valid account name',
      },
      LANGUAGE: {
        LABEL: 'Site language (Beta)',
        PLACEHOLDER: 'Your account name',
        ERROR: '',
      },
      DOMAIN: {
        LABEL: 'Incoming Email Domain',
        PLACEHOLDER: 'The domain where you will receive the emails',
        ERROR: '',
      },
      SUPPORT_EMAIL: {
        LABEL: 'Support Email',
        PLACEHOLDER: "Your company's support email",
        ERROR: '',
      },
      AUTO_RESOLVE_DURATION: {
        LABEL:
          'Number of days after a ticket should auto resolve if there is no activity',
        PLACEHOLDER: '30',
        ERROR:
          'Please enter a valid auto resolve duration (minimum 1 day and maximum 999 days)',
      },
      FEATURES: {
        INBOUND_EMAIL_ENABLED:
          'Conversation continuity with emails is enabled for your account.',
        CUSTOM_EMAIL_DOMAIN_ENABLED:
          'You can receive emails in your custom domain now.',
      },
    },
    UPDATE_TRING:
      'An update %{latestTringVersion} for Engage is available. Please update your instance.',
    LEARN_MORE: 'Learn more',
  },
  FORMS: {
    MULTISELECT: {
      ENTER_TO_SELECT: 'Press enter to select',
      ENTER_TO_REMOVE: 'Press enter to remove',
      SELECT_ONE: 'Select one',
    },
  },
  NOTIFICATIONS_PAGE: {
    HEADER: 'Notifications',
    MARK_ALL_DONE: 'Mark All Done',
    LIST: {
      LOADING_MESSAGE: 'Loading notifications...',
      404: 'No Notifications',
      TABLE_HEADER: ['Name', 'Phone Number', 'Conversations', 'Last Contacted'],
    },
    TYPE_LABEL: {
      conversation_creation: 'New conversation',
      conversation_assignment: 'Conversation Assigned',
      assigned_conversation_new_message: 'New Message',
      conversation_mention: 'Mention',
    },
    NO_NOTIFICATIONS: 'No Notifications',
  },
  NETWORK: {
    NOTIFICATION: {
      TEXT: 'Disconnected from Engage',
    },
    BUTTON: {
      REFRESH: 'Refresh',
    },
  },
  COMMAND_BAR: {
    SEARCH_PLACEHOLDER: 'Search or jump to',
    SECTIONS: {
      GENERAL: 'General',
      REPORTS: 'Reports',
      CONVERSATION: 'Conversation',
      CHANGE_ASSIGNEE: 'Change Assignee',
      CHANGE_TEAM: 'Change Team',
      ADD_LABEL: 'Add label to the conversation',
      REMOVE_LABEL: 'Remove label from the conversation',
      SETTINGS: 'Settings',
    },
    COMMANDS: {
      GO_TO_CONVERSATION_DASHBOARD: 'Go to Conversation Dashboard',
      GO_TO_CONTACTS_DASHBOARD: 'Go to Contacts Dashboard',
      GO_TO_REPORTS_OVERVIEW: 'Go to Reports Overview',
      GO_TO_AGENT_REPORTS: 'Go to Agent Reports',
      GO_TO_LABEL_REPORTS: 'Go to Label Reports',
      GO_TO_INBOX_REPORTS: 'Go to Inbox Reports',
      GO_TO_TEAM_REPORTS: 'Go to Team Reports',
      GO_TO_SETTINGS_AGENTS: 'Go to Agent Settings',
      GO_TO_SETTINGS_TEAMS: 'Go to Team Settings',
      GO_TO_SETTINGS_INBOXES: 'Go to Inbox Settings',
      GO_TO_SETTINGS_LABELS: 'Go to Label Settings',
      GO_TO_SETTINGS_CANNED_RESPONSES: 'Go to Canned Response Settings',
      GO_TO_SETTINGS_APPLICATIONS: 'Go to Application Settings',
      GO_TO_SETTINGS_ACCOUNT: 'Go to Account Settings',
      GO_TO_SETTINGS_PROFILE: 'Go to Profile Settings',
      GO_TO_NOTIFICATIONS: 'Go to Notifications',

      ADD_LABELS_TO_CONVERSATION: 'Add label to the conversation',
      ASSIGN_AN_AGENT: 'Assign an agent',
      ASSIGN_A_TEAM: 'Assign a team',
      MUTE_CONVERSATION: 'Mute conversation',
      UNMUTE_CONVERSATION: 'Unmute conversation',
      REMOVE_LABEL_FROM_CONVERSATION: 'Remove label from the conversation',
      REOPEN_CONVERSATION: 'Reopen conversation',
      RESOLVE_CONVERSATION: 'Resolve conversation',
      SEND_TRANSCRIPT: 'Send an email transcript',
      SNOOZE_CONVERSATION: 'Snooze Conversation',
      UNTIL_NEXT_REPLY: 'Until next reply',
      UNTIL_NEXT_WEEK: 'Until next week',
      UNTIL_TOMORROW: 'Until tomorrow',
    },
  },
  HELP_CENTER: {
    HEADING: 'Submit a request',
    DRAG_AND_DROP: 'Drag your file here Or Click here to upload',
    ADD_EMAIL: 'Add emails',
    CC: 'CC',
    ADDITIONAL_EMAILS: 'Additional Emails',
    SUBJECT: 'Subject',
    DESCRIPTION: 'Descritpion',
    PRODUCT_AREA: 'Product Area',
    PRIORITY: 'Priority',
    ADDITIONAL_EMAILS_SUBTITLE: '[BCC]',
    DESCRIPTION_SUBTITLE:
      '[Please enter the details of your request. A member of our support staff will respond as soon as possible.]',
    PRODUCT_SUBTITLE:
      'Please add the relevant product area where you are facing issues.',
    PRIORITY_SUBTITLE:
      'Please click here to understand the priority assigned to each type of issue/query. Please note our team can update the priority if they are not marked as per the guidelines mentioned in the document.',
    PRODUCT_OPTIONS: {
      NAME: {
        CAMPAIGNS: 'Campaigns',
        SDK: 'SDK',
        ANALYTICS: 'Analytics',
      },
    },
    PRIORITY_OPTIONS: {
      NAME: {
        LOW: 'Low',
        NORMAL: 'Normal',
        HIGH: 'High',
        URGENT: 'Urgent',
      },
    },
    VALIDATION: {
      EMAIL_VALIDATION: 'At least one email is required',
      VALID_EMAIL: 'Valid email',
      INVALID_EMAIL: 'Invalid email',
      SPECIAL_CHARACTER: 'Subject should not contain special characters',
      SUBJECT: 'Subject is a required field.',
      DESCRIPTION: 'Description is a required field.',
      PRODUCT: 'Product is a required field.',
      PRIORITY: 'Priority is a required field.',
    },
    FILE_SIZE_MSG: 'File size should not exceed 10MB.',
    ATTACHMENT: 'Attachment (max one file of type PDF/CSV/XLSX allowed)',
    SUCCESS_MSG:
      'Success! Your request has been submitted. We will be in touch soon.',
    REQUIRED_MSG:
      'Error! Unable to submit required due to empty required fields.',
  },
};
