module.exports = {
  ATTRIBUTES_MGMT: {
    HEADER: 'Custom Attributes',
    HEADER_BTN_TXT: 'Add Custom Attribute',
    LOADING: 'Fetching custom attributes',
    SIDEBAR_TXT:
      '<p><b>Custom Attributes</b> </p><p>A custom attribute tracks facts about your contacts/conversation — like the subscription plan, or when they ordered the first item etc. {linebreak}{linebreak}For creating a Custom Attribute, just click on the <b>Add Custom Attribute.</b> You can also edit or delete an existing  Custom Attribute by clicking on the Edit or Delete button.</p>',
    ADD: {
      TITLE: 'Add Custom Attribute',
      TITTLE: 'New Custom Attribute',
      SUBMIT: 'Create',
      CANCEL_BUTTON_TEXT: 'Cancel',
      FORM: {
        NAME: {
          LABEL: 'Display Name',
          PLACEHOLDER: 'Enter custom attribute display name',
          ERROR: 'Name is required',
        },
        DESC: {
          LABEL: 'Description',
          PLACEHOLDER: 'Enter custom attribute description',
          ERROR: 'Description is required',
        },
        MODEL: {
          LABEL: 'Applies to',
          PLACEHOLDER: 'Please select one',
          ERROR: 'Model is required',
        },
        TYPE: {
          LABEL: 'Type',
          PLACEHOLDER: 'Please select a type',
          ERROR: 'Type is required',
          LIST: {
            LABEL: 'List Values',
            PLACEHOLDER: 'Please enter value and press enter key',
            ERROR: 'Must have at least one value',
          },
        },
        KEY: {
          LABEL: 'Key',
          PLACEHOLDER: 'Enter custom attribute key',
          ERROR: 'Key is required',
          IN_VALID: 'Invalid key',
        },
      },
      API: {
        SUCCESS_MESSAGE: 'Custom Attribute added successfully',
        ERROR_MESSAGE:
          'Could not able to create a custom attribute, Please try again later',
      },
    },
    DELETE: {
      BUTTON_TEXT: 'Delete',
      API: {
        SUCCESS_MESSAGE: 'Custom Attribute deleted successfully.',
        ERROR_MESSAGE: "Couldn't delete the custom attribute. Try again.",
      },
      CONFIRM: {
        TITLE: 'Are you sure want to delete - {attributeName}',
        PLACE_HOLDER: 'Please type "{attributeName}" to confirm',
        MESSAGE: 'Deleting will remove the custom attribute',
        YES: 'Delete ',
        NO: 'Cancel',
        VALIDATION: {
          FIELD_REQUIRED: 'This field is required.',
        },
      },
    },
    EDIT: {
      TITLE: 'Edit Custom Attribute',
      UPDATE_BUTTON_TEXT: 'Update',
      TYPE: {
        LIST: {
          LABEL: 'List Values',
          PLACEHOLDER: 'Please enter values and press enter key',
        },
      },
      API: {
        SUCCESS_MESSAGE: 'Custom Attribute updated successfully',
        ERROR_MESSAGE:
          'There was an error updating custom attribute, please try again',
      },
    },
    TABS: {
      HEADER: 'Custom Attributes',
      CONVERSATION: 'Conversation',
      CONTACT: 'Contact',
    },
    LIST: {
      TABLE_HEADER: ['Name', 'Description', 'Type', 'Key', 'Action'],
      BUTTONS: {
        EDIT: 'Edit',
        DELETE: 'Delete',
      },
      EMPTY_RESULT: {
        404: 'There are no custom attributes created',
        NOT_FOUND: 'There are no custom attributes configured',
      },
    },
  },
};
