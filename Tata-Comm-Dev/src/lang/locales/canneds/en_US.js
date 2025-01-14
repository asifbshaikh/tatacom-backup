module.exports = {
  CANNED_MGMT: {
    HEADER: 'Canned Responses',
    HEADER_BTN_TXT: 'Add Canned Response',
    LOADING: 'Fetching Canned Responses',
    SEARCH_404: 'There are no items matching this query',
    SIDEBAR_TXT:
      "<p><b>Canned Responses</b> </p><p> Canned Responses are saved reply templates which can be used to quickly send out a reply to a conversation. </p><p> For creating a Canned Response, just click on the <b>Add Canned Response</b>. You can also edit or delete an existing Canned Response by clicking on the Edit or Delete button </p><p> Canned responses are used with the help of <b>Short Codes</b>. Agents can access canned responses while on a chat by typing <b> '/' </b> followed by the short code. </p>",
    LIST: {
      404: 'There are no canned responses available in this account.',
      TITLE: 'Manage canned responses',
      DESC: 'Canned Responses are predefined reply templates which can be used to quickly send out replies to tickets.',
      TABLE_HEADER: ['Short Code', 'Content', 'Actions', 'Action'],
    },
    ADD: {
      TITLE: 'Add Canned Response',
      DESC: 'Canned Responses are saved reply templates which can be used to quickly send out reply to conversation.',
      CANCEL_BUTTON_TEXT: 'Cancel',
      FORM: {
        SHORT_CODE: {
          LABEL: 'Short Code',
          PLACEHOLDER: 'Please enter a short code',
          ERROR: 'Short Code is required',
        },
        CONTENT: {
          LABEL: 'Content',
          PLACEHOLDER: 'Please enter a content',
          ERROR: 'Content is required',
        },
        SUBMIT: 'Submit',
      },
      API: {
        SUCCESS_MESSAGE: 'Canned Response added successfully',
        ERROR_MESSAGE: 'Could not connect to Server, Please try again later',
      },
    },
    EDIT: {
      TITLE: 'Edit Canned Response',
      CANCEL_BUTTON_TEXT: 'Cancel',
      FORM: {
        SHORT_CODE: {
          LABEL: 'Short Code',
          PLACEHOLDER: 'Please enter a shortcode',
          ERROR: 'Short Code is required',
        },
        CONTENT: {
          LABEL: 'Content',
          PLACEHOLDER: 'Please enter a content',
          ERROR: 'Content is required',
        },
        SUBMIT: 'Submit',
      },
      BUTTON_TEXT: 'Edit',
      API: {
        SUCCESS_MESSAGE: 'Canned Response updated successfully',
        ERROR_MESSAGE: 'Could not connect to Server, Please try again later',
      },
    },
    DELETE: {
      BUTTON_TEXT: 'Delete',
      API: {
        SUCCESS_MESSAGE: 'Canned response deleted successfully',
        ERROR_MESSAGE: 'Could not connect to Server, Please try again later',
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
