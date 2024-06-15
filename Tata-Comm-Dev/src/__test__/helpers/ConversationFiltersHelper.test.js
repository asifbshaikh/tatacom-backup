import ConversationEnums from 'enums/conversations/conversationEnums';
import {
  advancedFilterOPtionsList,
  getInputType,
  getCustomAttributesListMapped,
  mapCustomFilters,
  getAttributeOptions,
  getFilterOpertorByDataTypes,
  getdropDownOptionsBasedOnIdentifier,
  removeEmptyPropertyFilterJson,
  getFilterOpertorOptions,
} from 'helpers/ConversationFiltersHelper';

describe('Conversation Filters Helper', () => {
  const dummyData = {
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

  it('advancedFilterOptionsList', () => {
    const result = advancedFilterOPtionsList;
    expect(result).toEqual(dummyData);
  });

  it('getInputType for date DataType', () => {
    const result = getInputType('date');
    expect(result).toEqual('date');
  });
  it('getInputType for checkbox DataType', () => {
    const result = getInputType('checkbox');
    expect(result).toEqual('search_box');
  });
  it('getInputType for empty DataType', () => {
    const result = getInputType('');
    expect(result).toEqual('plain_text');
  });

  it('getCustomAttributesListMapped function test with list', () => {
    const mockdata = [
      ...dummyData.conversation_attribute,
      {
        attribute_key: 'test222',
        id: 9,
        attribute_name: 'test222',
        attribute_type: 'Custom Attributes',
        data_type: 'link',
        input_type: 'plain_text',
      },
    ];
    const result = getCustomAttributesListMapped('conversation_attribute', [
      {
        id: 9,
        attribute_display_name: 'test222',
        attribute_display_type: 'link',
        attribute_description: 'testing',
        attribute_key: 'test222',
        attribute_values: [],
        attribute_model: 'conversation_attribute',
        default_value: null,
        created_at: '2023-10-30T11:08:54.026Z',
        updated_at: '2023-10-30T11:08:54.026Z',
      },
    ]);
    expect(result).toEqual(mockdata);
  });
  it('getCustomAttributesListMapped function test with empty list', () => {
    const result = getCustomAttributesListMapped('conversation_attribute', []);
    expect(result).toEqual(advancedFilterOPtionsList.conversation_attribute);
  });

  it('mapCustomFilters function test', () => {
    const lists = [
      {
        attribute_key: 'status',
        filter_operator: 'equal_to',
        values: ['snoozed'],
        attribute_model: 'standard',
      },
    ];

    const conversationOptions = [
      {
        attribute_key: 'status',
        attribute_name: 'Status',
        input_type: 'multi_select',
        data_type: 'text',
        filter_operators: ['equal_to', 'not_equal_to'],
        attribute_type: 'standard',
      },
    ];
    const result = mapCustomFilters(lists, conversationOptions);
    expect(result).toEqual([
      {
        attribute_key: 'status',
        filter_operator: 'equal_to',
        values: ['snoozed'],
        attribute_model: 'standard',
        data_type: 'text',
        input_type: 'multi_select',
      },
    ]);
  });
  it('getAttributeOptions function test', () => {
    const result = getAttributeOptions([
      {
        attribute_key: 'status',
        attribute_name: 'Status',
        input_type: 'multi_select',
        data_type: 'text',
        filter_operators: ['equal_to', 'not_equal_to'],
        attribute_type: 'standard',
      },
    ]);
    expect(result).toEqual([
      {
        category: 'standard',
        attribute_name: 'Status',
        attribute_model: 'status',
      },
    ]);
  });

  it('getFilterOpertorByDataTypes with text DataType', () => {
    const result = getFilterOpertorByDataTypes('text');
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
      {
        label: 'Contains',
        value: 'contains',
      },
      {
        label: 'Does Not Contain',
        value: 'does_not_contain',
      },
    ]);
  });

  it('getFilterOpertorByDataTypes with number DataType', () => {
    const result = getFilterOpertorByDataTypes('number');
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
    ]);
  });
  it('getFilterOpertorByDataTypes with link DataType', () => {
    const result = getFilterOpertorByDataTypes('link');
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
    ]);
  });
  it('getFilterOpertorByDataTypes with checkbox DataType', () => {
    const result = getFilterOpertorByDataTypes('checkbox');
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
    ]);
  });
  it('getFilterOpertorByDataTypes with list DataType', () => {
    const result = getFilterOpertorByDataTypes('list');
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
    ]);
  });
  it('getFilterOpertorByDataTypes with empty DataType', () => {
    const result = getFilterOpertorByDataTypes('');
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
    ]);
  });
  it('getFilterOpertorByDataTypes with date DataType', () => {
    const result = getFilterOpertorByDataTypes('date');
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
      {
        label: 'Present',
        value: 'present',
      },
      {
        label: 'Is Not Present',
        value: 'is_not_present',
      },
      {
        label: 'Is Greater Than',
        value: 'is_greater_than',
      },
      {
        label: 'Is Less Than',
        value: 'is_less_than',
      },
    ]);
  });
  it('getdropDownOptionsBasedOnIdentifier function test', () => {
    const result = getdropDownOptionsBasedOnIdentifier(
      'id',
      'name',
      'attribute_key',
      'attribute_name',
      [
        {
          attribute_key: 'status',
          attribute_name: 'Status',
          input_type: 'multi_select',
          data_type: 'text',
          filter_operators: ['equal_to', 'not_equal_to'],
          attribute_type: 'standard',
        },
      ]
    );
    expect(result).toEqual([{ id: 'status', name: 'Status' }]);
  });
  it('getdropDownOptionsBasedOnIdentifier function for No options', () => {
    const result = getdropDownOptionsBasedOnIdentifier(
      'id',
      'name',
      'attribute_key',
      'attribute_name',
      []
    );
    expect(result).toEqual([{ id: '', name: 'No Options' }]);
  });
  it('removeEmptyPropertyFilterJson function test', () => {
    const result = removeEmptyPropertyFilterJson([
      {
        attribute_key: 'status',
        attribute_name: 'Status',
        input_type: 'multi_select',
        data_type: 'text',
        filter_operators: ['equal_to', 'not_equal_to'],
        attribute_type: 'standard',
      },
    ]);
    expect(result).toEqual([
      {
        attribute_key: 'status',
        attribute_name: 'Status',
        filter_operators: ['equal_to', 'not_equal_to'],
        attribute_type: 'standard',
      },
    ]);
  });
  it('getFilterOpertorOptions function test with filter_opertor key in list', () => {
    const result = getFilterOpertorOptions('status', [
      {
        attribute_key: 'status',
        attribute_name: 'Status',
        input_type: 'multi_select',
        data_type: 'text',
        filter_operators: ['equal_to', 'not_equal_to'],
        attribute_type: 'standard',
      },
    ]);
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
    ]);
  });
  it('getFilterOpertorOptions with no options list', () => {
    const result = getFilterOpertorOptions('status', [
      {
        attribute_key: 'status',
        attribute_name: 'Status',
        input_type: 'multi_select',
        data_type: 'number',

        attribute_type: 'standard',
      },
    ]);
    expect(result).toEqual([
      {
        label: 'Equal To',
        value: 'equal_to',
      },
      {
        label: 'Not Equal To',
        value: 'not_equal_to',
      },
    ]);
  });
});
