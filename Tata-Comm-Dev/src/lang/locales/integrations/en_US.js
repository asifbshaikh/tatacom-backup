module.exports = {
  INTEGRATION_SETTINGS: {
    HEADER: 'Integrations',
    WEBHOOK: {
      TITLE: 'Webhook',
      CONFIGURE: 'Configure',
      HEADER: 'Webhook settings',
      HEADER_BTN_TXT: 'Add new webhook',
      LOADING: 'Fetching attached webhooks',
      SEARCH_404: 'There are no items matching this query',
      SIDEBAR_TXT:
        '<p><b>Webhooks</b> </p> <p>Webhooks are HTTP callbacks which can be defined for every account. They are triggered by events like message creation in Engage. You can create more than one webhook for this account. {linebreak}{linebreak} For creating a <b>webhook</b>, click on the <b>Add new webhook</b> button. You can also remove any existing webhook by clicking on the Delete button.</p>',
      LIST: {
        404: 'There are no webhooks configured for this account.',
        TITLE: 'Manage webhooks',
        TABLE_HEADER: ['Webhook endpoint', 'Action', 'Actions'],
      },
      EDIT: {
        BUTTON_TEXT: 'Edit',
        TITLE: 'Edit webhook',
        CANCEL: 'Cancel',
        DESC: "Webhook events provide you the realtime information about what's happening in your Engage account. Please enter a valid URL to configure a callback.",
        FORM: {
          END_POINT: {
            LABEL: 'Webhook URL',
            PLACEHOLDER: 'Example: https://example/api/webhook',
            ERROR: 'Please enter a valid URL',
          },
          SUBMIT: 'Edit webhook',
        },
        API: {
          SUCCESS_MESSAGE: 'Webhook URL updated successfully',
          ERROR_MESSAGE: 'Could not connect to Server, Please try again later',
        },
      },
      ADD: {
        CANCEL: 'Cancel',
        TITLE: 'Add new webhook',
        DESC: "Webhook events provide you the realtime information about what's happening in your Engage account. Please enter a valid URL to configure a callback.",
        FORM: {
          END_POINT: {
            LABEL: 'Webhook URL',
            PLACEHOLDER: 'Example: https://example/api/webhook',
            ERROR: 'Please enter a valid URL',
          },
          SUBMIT: 'Create webhook',
        },
        API: {
          SUCCESS_MESSAGE: 'Webhook added successfully',
          ERROR_MESSAGE: 'Could not connect to Server, Please try again later',
        },
      },
      DELETE: {
        BUTTON_TEXT: 'Delete',
        API: {
          SUCCESS_MESSAGE: 'Webhook deleted successfully',
          ERROR_MESSAGE: 'Could not connect to Server, Please try again later',
        },
        CONFIRM: {
          TITLE: 'Confirm Deletion',
          MESSAGE: 'Are you sure to delete ',
          YES: 'Yes, Delete ',
          NO: 'No, Keep it',
        },
      },
    },
    SLACK: {
      HELP_TEXT: {
        TITLE: 'Using Slack Integration',
        BODY: "<br/><p>Engage will now sync all the incoming conversations into the <b><i>customer-conversations</i></b> channel inside your slack workplace.</p><p>Replying to a conversation thread in <b><i>customer-conversations</i></b> slack channel will create a response back to the customer through Engage.</p><p>Start the replies with <b><i>note:</i></b> to create private notes instead of replies.</p><p>If the replier on slack has an agent profile in Engage under the same email, the replies will be associated accordingly.</p><p>When the replier doesn't have an associated agent profile, the replies will be made from the bot profile.</p>",
      },
    },
    DELETE: {
      BUTTON_TEXT: 'Delete',
      API: {
        SUCCESS_MESSAGE: 'Integration deleted successfully',
      },
    },
    CONNECT: {
      BUTTON_TEXT: 'Connect',
    },
  },
};
