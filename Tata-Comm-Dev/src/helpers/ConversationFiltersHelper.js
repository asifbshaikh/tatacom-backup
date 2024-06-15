import { NotificationManager } from 'components/common/react-notifications';
import { getConvertedStringWithSpace } from './campaignHelper';
import IntlMessages from './IntlMessages';
import ConversationEnums from 'enums/conversations/conversationEnums';

export const advancedFilterOPtionsList = {
  conversation_attribute: [
    {
      attribute_key: ConversationEnums.FILTER_KEYS.STATUS,
      attribute_name: ConversationEnums.FILTER_KEYS.CAPITALIZATION_STATUS,
      input_type: ConversationEnums.FILTER_KEYS.MULTI_SELECT,
      data_type: ConversationEnums.FILTER_KEYS.TEXT,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.ASSIGNEE_ID,
      attribute_name: ConversationEnums.FILTER_KEYS.ASSIGNEE_NAME,
      input_type: ConversationEnums.FILTER_KEYS.SEARCH_BOX,
      data_type: ConversationEnums.FILTER_KEYS.TEXT,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
        ConversationEnums.IDENTIFIERS.IS_PRESENT,
        ConversationEnums.IDENTIFIERS.IS_NOT_PRESENT,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.INBOX_ID,
      attribute_name: ConversationEnums.FILTER_KEYS.INBOX_NAME,
      input_type: ConversationEnums.FILTER_KEYS.SEARCH_BOX,
      data_type: ConversationEnums.FILTER_KEYS.TEXT,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
        ConversationEnums.IDENTIFIERS.IS_PRESENT,
        ConversationEnums.IDENTIFIERS.IS_NOT_PRESENT,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.TEAM_ID,
      attribute_name: ConversationEnums.FILTER_KEYS.TEAM_NAME,
      input_type: ConversationEnums.FILTER_KEYS.SEARCH_BOX,
      data_type: ConversationEnums.FILTER_KEYS.NUMBER,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
        ConversationEnums.IDENTIFIERS.IS_PRESENT,
        ConversationEnums.IDENTIFIERS.IS_NOT_PRESENT,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.DISPLAY_ID,
      attribute_name: ConversationEnums.IDENTIFIERS.CONVERSATION_IDENTIFIER,
      input_type: ConversationEnums.FILTER_KEYS.NUMBER,
      data_type: ConversationEnums.FILTER_KEYS.NUMBER,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
        ConversationEnums.IDENTIFIERS.CONTAINS,
        ConversationEnums.IDENTIFIERS.DOES_NOT_CONTAINS,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.CAMPAIGN_ID,
      attribute_name: ConversationEnums.FILTER_KEYS.CAMPAIGN_NAME,
      input_type: ConversationEnums.FILTER_KEYS.SEARCH_BOX,
      data_type: ConversationEnums.FILTER_KEYS.NUMBER,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
        ConversationEnums.IDENTIFIERS.IS_PRESENT,
        ConversationEnums.IDENTIFIERS.IS_NOT_PRESENT,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.LABELS,
      attribute_name: ConversationEnums.FILTER_KEYS.CAPITALIZATION_LABELS,
      input_type: ConversationEnums.FILTER_KEYS.MULTI_SELECT,
      data_type: ConversationEnums.FILTER_KEYS.TEXT,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
        ConversationEnums.IDENTIFIERS.IS_PRESENT,
        ConversationEnums.IDENTIFIERS.IS_NOT_PRESENT,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.BROWSER_LANGUAGE,
      attribute_name:
        ConversationEnums.FILTER_KEYS.CAPITALIZATION_BROWSER_LANGUAGE,
      input_type: ConversationEnums.FILTER_KEYS.SEARCH_BOX,
      data_type: ConversationEnums.FILTER_KEYS.TEXT,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.ADDITIONAL_ATTRIBUTES,
    },
    {
      attribute_key: ConversationEnums.IDENTIFIERS.COUNTRY_CODE,
      attribute_name: ConversationEnums.IDENTIFIERS.COUNTRY_NAME,
      input_type: ConversationEnums.FILTER_KEYS.SEARCH_BOX,
      data_type: ConversationEnums.FILTER_KEYS.TEXT,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.ADDITIONAL_ATTRIBUTES,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.REFERER,
      attribute_name: ConversationEnums.FILTER_KEYS.REFERER_LINK,
      input_type: ConversationEnums.FILTER_KEYS.PLAIN_TEXT,
      data_type: ConversationEnums.FILTER_KEYS.LINK,
      filter_operators: [
        ConversationEnums.FILTER_KEYS.EQUALS_TO,
        ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
        ConversationEnums.IDENTIFIERS.CONTAINS,
        ConversationEnums.IDENTIFIERS.DOES_NOT_CONTAINS,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.ADDITIONAL_ATTRIBUTES,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.CREATED_AT,
      attribute_name: ConversationEnums.FILTER_KEYS.CAPITALIZATION_CREATED_AT,
      input_type: ConversationEnums.FILTER_KEYS.DATE,
      data_type: ConversationEnums.FILTER_KEYS.DATE,
      filter_operators: [
        ConversationEnums.IDENTIFIERS.IS_GREATER_THAN,
        ConversationEnums.IDENTIFIERS.IS_LESS_THAN,
        ConversationEnums.FILTER_KEYS.DAYS_BEFORE,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
    {
      attribute_key: ConversationEnums.FILTER_KEYS.LAST_ACTIVITY_AT,
      attribute_name:
        ConversationEnums.FILTER_KEYS.CAPITALIZATION_LAST_ACTIVITY_AT,
      input_type: ConversationEnums.FILTER_KEYS.DATE,
      data_type: ConversationEnums.FILTER_KEYS.DATE,
      filter_operators: [
        ConversationEnums.IDENTIFIERS.IS_GREATER_THAN,
        ConversationEnums.IDENTIFIERS.IS_LESS_THAN,
        ConversationEnums.FILTER_KEYS.DAYS_BEFORE,
      ],
      attribute_type: ConversationEnums.FILTER_KEYS.STANDARD,
    },
  ],
};

export const getInputType = (dataType) => {
  let inputType = '';
  switch (dataType) {
    case ConversationEnums.FILTER_KEYS.DATE:
      inputType = ConversationEnums.FILTER_KEYS.DATE;
      break;

    case ConversationEnums.FILTER_KEYS.CHECKBOX:
      inputType = ConversationEnums.FILTER_KEYS.SEARCH_BOX;
      break;

    default:
      inputType = ConversationEnums.FILTER_KEYS.PLAIN_TEXT;
      break;
  }
  return inputType;
};

export const getCustomAttributesListMapped = (type, lists) => {
  let optionList = [];
  if (lists.length > 0) {
    const attributesListOnType = lists.filter((list) => {
      return list.attribute_model === type;
    });
    optionList = attributesListOnType?.map((attribute) => {
      return {
        attribute_key: attribute.attribute_key,
        id: attribute.id,
        attribute_name: attribute.attribute_display_name,
        attribute_type: ConversationEnums.IDENTIFIERS.CUSTOM_ATTRIBUTES,
        data_type: attribute.attribute_display_type,
        input_type: getInputType(attribute.attribute_display_type),
      };
    });
  }
  optionList.unshift(...advancedFilterOPtionsList?.[type]);
  return optionList;
};

export const mapCustomFilters = (lists, conversationOptions) => {
  const filterList = [];
  if (lists.length > 0) {
    lists.forEach((data) => {
      conversationOptions.forEach((optionList) => {
        if (data.attribute_key === optionList.attribute_key) {
          filterList.push({
            ...data,
            data_type: optionList?.data_type,
            input_type: optionList?.input_type,
          });
        }
      });
    });
  }
  return filterList;
};

export const getAttributeOptions = (attributesList) => {
  return (
    attributesList.length > 0 &&
    attributesList.map((list) => {
      return {
        category: list.attribute_type,
        attribute_name: list.attribute_name,
        attribute_model: list.attribute_key,
      };
    })
  );
};

export const hideValueField = [
  ConversationEnums.IDENTIFIERS.PRESENT,
  ConversationEnums.IDENTIFIERS.IS_PRESENT,
  ConversationEnums.IDENTIFIERS.IS_NOT_PRESENT,
];

export const textTypeFilterOptions = [
  ConversationEnums.FILTER_KEYS.EQUALS_TO,
  ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
  ConversationEnums.IDENTIFIERS.CONTAINS,
  ConversationEnums.IDENTIFIERS.DOES_NOT_CONTAINS,
];

export const numberTypeFilterOptions = [
  ConversationEnums.FILTER_KEYS.EQUALS_TO,
  ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
];

export const dateTypeFilterOPtions = [
  ConversationEnums.FILTER_KEYS.EQUALS_TO,
  ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
  ConversationEnums.IDENTIFIERS.PRESENT,
  ConversationEnums.IDENTIFIERS.IS_NOT_PRESENT,
  ConversationEnums.IDENTIFIERS.IS_GREATER_THAN,
  ConversationEnums.IDENTIFIERS.IS_LESS_THAN,
];

export const checkboxAndLinkAndListFilterOptions = [
  ConversationEnums.FILTER_KEYS.EQUALS_TO,
  ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO,
];

export const getFilterOpertorByDataTypes = (type) => {
  let options = [];
  switch (type) {
    case ConversationEnums.FILTER_KEYS.TEXT:
      options = getDropDownOptions(textTypeFilterOptions);
      break;
    case ConversationEnums.FILTER_KEYS.NUMBER:
      options = getDropDownOptions(numberTypeFilterOptions);
      break;
    case ConversationEnums.FILTER_KEYS.LINK:
      options = getDropDownOptions(checkboxAndLinkAndListFilterOptions);
      break;
    case ConversationEnums.FILTER_KEYS.CHECKBOX:
      options = getDropDownOptions(checkboxAndLinkAndListFilterOptions);
      break;
    case ConversationEnums.FILTER_KEYS.LIST:
      options = getDropDownOptions(checkboxAndLinkAndListFilterOptions);
      break;
    case ConversationEnums.FILTER_KEYS.DATE:
      options = getDropDownOptions(dateTypeFilterOPtions);
      break;

    default:
      options = getDropDownOptions(numberTypeFilterOptions);
      break;
  }
  return options;
};

export const getDropDownOptions = (list) => {
  return list.map((operator) => {
    return {
      value: operator,
      label:
        operator === ConversationEnums.FILTER_KEYS.DAYS_BEFORE
          ? ConversationEnums.FILTER_KEYS.IS_X_DAYS_BEFORE
          : getConvertedStringWithSpace(operator),
    };
  });
};

export const getFilterOpertorOptions = (attributeKey, attributesList) => {
  let options = [];
  if (attributeKey && attributesList.length > 0) {
    const filteredData = attributesList.find((attribute) => {
      return attribute.attribute_key === attributeKey;
    });
    if (filteredData) {
      if (
        Object.prototype.hasOwnProperty.call(
          filteredData,
          ConversationEnums.IDENTIFIERS.FILTER_OPERATORS
        )
      ) {
        options = getDropDownOptions(filteredData.filter_operators);
      } else {
        options = getFilterOpertorByDataTypes(filteredData.data_type);
      }
    } else {
      options = getFilterOpertorByDataTypes(filteredData?.data_type);
    }
  } else {
    options = getFilterOpertorByDataTypes();
  }
  return options;
};

export const chatListStatus = [
  {
    id: ConversationEnums.OPEN,
    value: ConversationEnums.FILTER_KEYS.CAPITALIZATION_OPEN,
  },
  {
    id: ConversationEnums.FILTER_KEYS.RESOLVED,
    value: ConversationEnums.FILTER_KEYS.CAPITALIZATION_RESOLVED,
  },
  {
    id: ConversationEnums.FILTER_KEYS.PENDING,
    value: ConversationEnums.FILTER_KEYS.CAPITALIZATION_PENDING,
  },
  {
    id: ConversationEnums.FILTER_KEYS.SNOOZED,
    value: ConversationEnums.FILTER_KEYS.CAPITALIZATION_SNOOZED,
  },
  {
    id: ConversationEnums.FILTER_KEYS.ALL,
    value: ConversationEnums.FILTER_KEYS.CAPITALIZATION_ALL,
  },
];

export const checkBoxDataTypeOptions = [
  {
    label: ConversationEnums.FILTER_KEYS.CAPITALIZATION_TRUE,
    value: ConversationEnums.FILTER_KEYS.TRUE,
  },
  {
    label: ConversationEnums.FILTER_KEYS.CAPITALIZATION_FALSE,
    value: ConversationEnums.FILTER_KEYS.FALSE,
  },
];

export const queryOperatorList = [
  {
    value: ConversationEnums.FILTER_KEYS.AND,
    label: ConversationEnums.FILTER_KEYS.CAPITALIZATION_AND,
  },
  {
    value: ConversationEnums.FILTER_KEYS.OR,
    label: ConversationEnums.FILTER_KEYS.CAPITALIZATION_OR,
  },
];

export const getdropDownOptionsBasedOnIdentifier = (
  field1,
  field2,
  identifier1,
  identifier2,
  lists
) => {
  return lists.length > 0
    ? lists.map((list) => {
        return {
          [field1]: list?.[identifier1],
          [field2]: list?.[identifier2],
        };
      })
    : [{ [field1]: '', [field2]: ConversationEnums.FILTER_KEYS.NO_OPTIONS }];
};

export function removeEmptyPropertyFilterJson(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      if (typeof obj[prop] === 'object') {
        if (obj[prop] instanceof Date) {
          continue;
        }
        if (Array.isArray(obj[prop]) && obj[prop].length === 0) {
          continue;
        }
        obj[prop] = removeEmptyPropertyFilterJson(obj[prop]);
        if (obj[prop] && Object.keys(obj[prop]).length === 0) {
          delete obj[prop];
        }
      } else if (
        obj[prop] === '' ||
        obj[prop] === null ||
        obj[prop] === undefined ||
        prop === ConversationEnums.FILTER_KEYS.DATA_TYPE ||
        prop === ConversationEnums.FILTER_KEYS.INPUT_TYPE
      ) {
        delete obj[prop];
      }
    }
  }
  return obj;
}

export const getConversationFiltersList = (state) =>
  state.inboxApp.converstaionFiltersOptions;

export const inboxState = (state) => state.inboxApp;
export const authState = (state) => state.authUser;

const isColorDark = (hexCode) => {
  const r = Number.isNaN(parseInt(hexCode?.slice(1, 3), 16))
    ? 0
    : parseInt(hexCode?.slice(1, 3), 16);
  const g = Number.isNaN(parseInt(hexCode?.slice(3, 5), 16))
    ? 0
    : parseInt(hexCode?.slice(3, 5), 16);
  const b = Number.isNaN(parseInt(hexCode?.slice(5, 7), 16))
    ? 0
    : parseInt(hexCode?.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness <= 128;
};

export const conversationLabelCustomStyle = {
  menu: (base) => ({
    ...base,
    zIndex: 5,
    overFlow: 'hidden',
  }),
  menuList: (base) => ({
    ...base,
    overFlow: 'hidden',
  }),
  control: (base) => ({
    ...base,
    '&:hover': {
      border: '0.5px solid #d63548',
      boxShadow: 'none',
    },
    '&:focus': {
      border: '0.5px solid #d63548',
      boxShadow: 'none',
    },
    '&:focus-within': {
      border: '0.5px solid #d63548',
      boxShadow: 'none',
    },
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#d63548' : '',
    '&:active': {
      backgroundColor: '#d63548',
      color: '#FFFFFF',
    },
    '&:hover': {
      backgroundColor: '#d63548',
      color: '#FFFFFF',
    },
  }),

  multiValue: (provided, { data }) => {
    return {
      ...provided,
      backgroundColor: `${data.color}!important`,
      color: isColorDark(data.color) ? '#ffffff' : '#000000',
    };
  },
  multiValueLabel: (provided, { data }) => {
    return {
      ...provided,
      color: `${isColorDark(data.color) ? '#ffffff' : '#000000'}!important`,
    };
  },
};
