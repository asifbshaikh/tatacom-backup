module.exports = {
  LABEL_MGMT: {
    HEADER: 'Labels',
    HEADER_BTN_TXT: 'Add label',
    LOADING: 'Fetching labels',
    SEARCH_404: 'There are no items matching this query',
    SIDEBAR_TXT:
      '<p><b>Labels</b></p> <p>Labels help you to categorize conversations and prioritize them. You can assign label to a conversation from the sidepanel. {linebreak}{linebreak}Labels are tied to the account and can be used to create custom workflows in your organization. You can assign custom color to a label, it makes it easier to identify the label. You will be able to display the label on the sidebar to filter the conversations easily.</p>',
    LIST: {
      404: 'There are no labels available in this account.',
      TITLE: 'Manage labels',
      DESC: 'Labels let you group the conversations together.',
      TABLE_HEADER: ['Name', 'Description', 'Color', 'Action'],
    },
    FORM: {
      NAME: {
        LABEL: 'Label Name',
        PLACEHOLDER: 'Label name',
        REQUIRED_ERROR: 'Label name is required',
        MINIMUM_LENGTH_ERROR: 'Minimum length 2 is required',
        VALID_ERROR:
          'Only Alphabets, Numbers, Hyphen and Underscore are allowed',
      },
      DESCRIPTION: {
        LABEL: 'Description',
        PLACEHOLDER: 'Label Description',
      },
      COLOR: {
        LABEL: 'Color',
      },
      SHOW_ON_SIDEBAR: {
        LABEL: 'Show label on sidebar',
      },
      EDIT: 'Edit',
      CREATE: 'Create',
      DELETE: 'Delete',
      CANCEL: 'Cancel',
    },
    ADD: {
      TITLE: 'Add label',
      DESC: 'Labels let you group the conversations together.',
      API: {
        SUCCESS_MESSAGE: 'Label added successfully',
        ERROR_MESSAGE: 'There was an error, please try again',
      },
    },
    EDIT: {
      TITLE: 'Edit label',
      API: {
        SUCCESS_MESSAGE: 'Label updated successfully',
        ERROR_MESSAGE: 'There was an error, please try again',
      },
    },
    DELETE: {
      BUTTON_TEXT: 'Delete',
      API: {
        SUCCESS_MESSAGE: 'Label deleted successfully',
        ERROR_MESSAGE: 'There was an error, please try again',
      },
      CONFIRM: {
        TITLE: 'Confirm Deletion',
        MESSAGE: 'Are you sure to delete ',
        YES: 'Yes, Delete ',
        NO: 'No, Keep ',
      },
    },
  },
};
