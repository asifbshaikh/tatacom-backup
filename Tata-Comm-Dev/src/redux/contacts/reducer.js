import {
  SET_CONVERSATIONS_CONTACT_LIST,
  GET_CONTACTS_LIST,
  GET_CONTACTS_LIST_SUCCESS,
  ADD_CONTACT_ITEM,
  ADD_CONTACT_ITEM_SUCCESS,
  ADD_CONTACT_ITEM_ERROR,
  ADD_CONTACT_ITEM_CLEAN,
  DELETE_CONTACT_ITEM,
  DELETE_CONTACT_ITEM_SUCCESS,
  DELETE_CONTACT_ITEM_ERROR,
  DELETE_CONTACT_ITEM_CLEAN,
  IMPORT_CONTACT_ITEM,
  IMPORT_CONTACT_ITEM_SUCCESS,
  IMPORT_CONTACT_ITEM_ERROR,
  IMPORT_CONTACT_ITEM_CLEAN,
  GET_LABEL_CONTACT_ITEM,
  GET_LABEL_CONTACT_ITEM_SUCCESS,
  DETAILS_CONTACT_ITEM,
  DETAILS_CONTACT_ITEM_SUCCESS,
  DETAILS_CONTACT_ITEM_ERROR,
  GET_COMMENTS_CONTACT_ITEM,
  GET_COMMENTS_CONTACT_ITEM_SUCCESS,
  ADD_COMMENTS_CONTACT_ITEM,
  ADD_COMMENTS_CONTACT_ITEM_SUCCESS,
  ADD_COMMENTS_CONTACT_ITEM_ERROR,
  ADD_COMMENTS_CONTACT_ITEM_CLEAN,
  ADD_LABEL_CONTACT_ITEM,
  ADD_LABEL_CONTACT_ITEM_SUCCESS,
  ADD_LABEL_CONTACT_ITEM_ERROR,
  ADD_LABEL_CONTACT_ITEM_CLEAN,
  GET_CONVERSATIONS_CONTACT_ITEM,
  GET_CONVERSATIONS_CONTACT_ITEM_SUCCESS,
  GET_ATTRIBUTES_CONTACT_ITEM,
  GET_ATTRIBUTES_CONTACT_ITEM_SUCCESS,
  ADD_ATTRIBUTES_CONTACT_ITEM,
  ADD_ATTRIBUTES_CONTACT_ITEM_SUCCESS,
  ADD_ATTRIBUTES_CONTACT_ITEM_ERROR,
  ADD_ATTRIBUTES_CONTACT_ITEM_CLEAN,
  DELETE_ATTRIBUTES_CONTACT_ITEM,
  DELETE_ATTRIBUTES_CONTACT_ITEM_SUCCESS,
  DELETE_ATTRIBUTES_CONTACT_ITEM_ERROR,
  DELETE_ATTRIBUTES_CONTACT_ITEM_CLEAN,
  MERGE_CONTACT_ITEM,
  MERGE_CONTACT_ITEM_SUCCESS,
  MERGE_CONTACT_ITEM_ERROR,
  MERGE_CONTACT_ITEM_CLEAN,
  DETAILS_CONTACT_ITEM_CLEAN_BEFORE_LOAD,
  CONTACT_NEW_MESSAGE,
  CONTACT_NEW_MESSAGE_SUCCESS,
  CONTACT_NEW_MESSAGE_ERROR,
  CONTACTABLE_INBOXES,
  CONTACTABLE_INBOXES_ERROR,
  CONTACTABLE_INBOXES_SUCCESS,
  CONTACT_NEW_MESSAGE_CLEAN,
  GET_CONVERSATION_SEARCH_LIST,
  GET_CONVERSATION_SEARCH_LIST_SUCCESS,
  GET_FILTER_CONTACTS_LIST_SUCCESS,
  GET_FILTER_CONTACTS_LIST_FAILURE,
  GET_CONTACTS_FILTERS_VALUE,
  SAVE_CONTACTS_FILTERS,
  SAVE_CONTACTS_FILTERS_SUCCESS,
  SAVE_CONTACTS_FILTERS_ERROR,
  GET_CONTACTS_FILTERS,
  GET_CONTACTS_FILTERS_SUCCESS,
  GET_CONTACTS_FILTERS_ERROR,
  DELETE_CONTACTS_FILTERS,
  DELETE_CONTACTS_FILTERS_SUCCESS,
  DELETE_CONTACTS_FILTERS_ERROR,
  UPDATE_CONTACT_PRESENCE,
  SET_CONTACTS,
  DELETE_CONTACTS,
  NEW_CONTACTS_LIST,
  CONTACT_FILTER_CLEAN_UP,
} from 'redux/constants';

const INIT_STATE = {
  loaded: false,
  loadedComments: false,
  loadedConversations: false,
  loadedAttributes: false,
  labelSelected: [],
  labelSelectedLoaded: false,
  comments: [],
  conversations: [],
  attributes: [],
  selectedItems: [],
  error: {},
  success: false,
  loading: false,
  loadedContactsList: true,
  contactsList: {},
  contableInboxes: [],
  newConversationDetails: null,
  newConversationDetailsError: null,
  successNewMessage: false,
  conversationSearchList: [],
  loadedConversationsList: true,
  savedCustomFilters: false,
  errorCustomFilter: {},
  contactFilterSegment: [],
  contactsFiltersLoading: false,
  contactsFiltersSuccess: false,
  contactsFiltersError: {},
  deleteContactFiltersSuccess: false,
  deleteContactFiltersError: {},
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //   case TODO_GET_LIST:
    //     return { ...state, loaded: false };

    //   case TODO_GET_LIST_SUCCESS:
    //     return {
    //       ...state,
    //       loaded: true,
    //       allTodoItems: action.payload,
    //       todoItems: action.payload,
    //     };

    //   case TODO_GET_LIST_ERROR:
    //     return { ...state, loaded: true, error: action.payload };

    //   case TODO_GET_LIST_WITH_FILTER:
    //     if (action.payload.column === '' || action.payload.value === '') {
    //       return {
    //         ...state,
    //         loaded: true,
    //         todoItems: state.allTodoItems,
    //         filter: null,
    //       };
    //     }
    //     // eslint-disable-next-line no-case-declarations
    //     const filteredItems = state.allTodoItems.filter(
    //       (item) => item[action.payload.column] === action.payload.value
    //     );
    //     return {
    //       ...state,
    //       loaded: true,
    //       todoItems: filteredItems,
    //       filter: {
    //         column: action.payload.column,
    //         value: action.payload.value,
    //       },
    //     };

    //   case TODO_GET_LIST_WITH_ORDER:
    //     if (action.payload === '') {
    //       return {
    //         ...state,
    //         loaded: true,
    //         todoItems: state.todoItems,
    //         orderColumn: null,
    //       };
    //     }
    //     // eslint-disable-next-line no-case-declarations
    //     const sortedItems = state.todoItems.sort((a, b) => {
    //       if (a[action.payload] < b[action.payload]) return -1;
    //       if (a[action.payload] > b[action.payload]) return 1;
    //       return 0;
    //     });
    //     return {
    //       ...state,
    //       loaded: true,
    //       todoItems: sortedItems,
    //       orderColumn: state.orderColumns.find(
    //         (x) => x.column === action.payload
    //       ),
    //     };

    //   case TODO_GET_LIST_SEARCH:
    //     if (action.payload === '') {
    //       return { ...state, todoItems: state.allTodoItems };
    //     }
    //     // eslint-disable-next-line no-case-declarations
    //     const keyword = action.payload.toLowerCase();
    //     // eslint-disable-next-line no-case-declarations
    //     const searchItems = state.allTodoItems.filter(
    //       (item) =>
    //         item.title.toLowerCase().indexOf(keyword) > -1 ||
    //         item.detail.toLowerCase().indexOf(keyword) > -1 ||
    //         item.status.toLowerCase().indexOf(keyword) > -1 ||
    //         item.category.toLowerCase().indexOf(keyword) > -1 ||
    //         item.label.toLowerCase().indexOf(keyword) > -1
    //     );
    //     return {
    //       ...state,
    //       loaded: true,
    //       todoItems: searchItems,
    //       searchKeyword: action.payload,
    //     };

    case SET_CONVERSATIONS_CONTACT_LIST:
      return {
        ...state,
        contactsList: {
          meta: {
            count: action.payload?.payload?.map((item) => item?.meta?.sender)
              .length,
            current_page: '1',
          },
          payload: action.payload?.payload?.map((item) => item?.meta?.sender),
        },
      };

    case GET_CONTACTS_LIST:
      return { ...state, loadedContactsList: false };

    case GET_CONTACTS_LIST_SUCCESS:
      return {
        ...state,
        loadedContactsList: true,
        contactsList: action.payload,
      };

    case ADD_CONTACT_ITEM:
      return {
        ...state,
        loaded: false,
        errorAdd: {},
        successAdd: false,
        loadingAdd: true,
      };

    case ADD_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: true,
        loadingAdd: false,
      };

    case ADD_CONTACT_ITEM_ERROR:
      return {
        ...state,
        loaded: true,
        errorAdd: action.payload,
        successAdd: false,
        loadingAdd: false,
      };

    case ADD_CONTACT_ITEM_CLEAN:
      return {
        ...state,
        loaded: true,
        errorAdd: {},
        successAdd: false,
        loadingAdd: false,
      };

    case DELETE_CONTACT_ITEM:
      return {
        ...state,
        loaded: false,
        errorDelete: {},
        successDelete: false,
        loadingDelete: true,
      };

    case DELETE_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorDelete: {},
        successDelete: true,
        loadingDelete: false,
      };

    case DELETE_CONTACT_ITEM_ERROR:
      return {
        ...state,
        loaded: true,
        errorDelete: action.payload,
        successDelete: false,
        loadingDelete: false,
      };

    case DELETE_CONTACT_ITEM_CLEAN:
      return {
        ...state,
        loaded: true,
        errorDelete: {},
        successDelete: false,
        loadingDelete: false,
      };

    case IMPORT_CONTACT_ITEM:
      return {
        ...state,
        loaded: false,
        errorImport: {},
        successImport: false,
        loadingImport: true,
      };

    case IMPORT_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorImport: {},
        successImport: true,
        loadingImport: false,
      };

    case IMPORT_CONTACT_ITEM_ERROR:
      return {
        ...state,
        loaded: true,
        errorImport: action.payload,
        successImport: false,
        loadingImport: false,
      };

    case IMPORT_CONTACT_ITEM_CLEAN:
      return {
        ...state,
        loaded: true,
        errorImport: {},
        successImport: false,
        loadingImport: false,
      };

    case GET_LABEL_CONTACT_ITEM:
      return { ...state, labelSelectedLoaded: true, labelSelected: [] };

    case GET_LABEL_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        labelSelectedLoaded: true,
        labelSelected: action.payload.payload,
      };

    case DETAILS_CONTACT_ITEM:
      return {
        ...state,
        loaded: false,
        errorDetails: {},
        successDetails: false,
        loadingDetails: true,
        item: {},
      };

    case DETAILS_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        loaded: true,
        errorDetails: {},
        successDetails: true,
        loadingDetails: false,
        item: action.payload.payload,
      };

    case DETAILS_CONTACT_ITEM_ERROR:
      return {
        ...state,
        loaded: true,
        errorDetails: action.payload,
        successDetails: false,
        loadingDetails: false,
      };

    case DETAILS_CONTACT_ITEM_CLEAN_BEFORE_LOAD:
      return {
        ...state,
        item: false,
        // loadedLabels: false,
        labelSelectedLoaded: false,
        loadedConversations: false,
        loadedComments: false,
      };

    case GET_COMMENTS_CONTACT_ITEM:
      return { ...state, loadedComments: false, loading: true };

    case GET_COMMENTS_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        loadedComments: true,
        comments: action.payload,
      };

    case ADD_COMMENTS_CONTACT_ITEM:
      return {
        ...state,
        errorAddComment: {},
        successAddComment: false,
        loadingAddComment: true,
      };

    case ADD_COMMENTS_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        errorAddComment: {},
        successAddComment: true,
        loadingAddComment: false,
      };

    case ADD_COMMENTS_CONTACT_ITEM_ERROR:
      return {
        ...state,
        errorAddComment: action.payload,
        successAddComment: false,
        loadingAddComment: false,
      };

    case ADD_COMMENTS_CONTACT_ITEM_CLEAN:
      return {
        ...state,
        errorAddComment: {},
        successAddComment: false,
        loadingAddComment: false,
        loadedComments: false,
      };

    case ADD_LABEL_CONTACT_ITEM:
      return {
        ...state,
        errorLabel: {},
        successLabel: false,
        loadingLabel: true,
      };

    case ADD_LABEL_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        errorLabel: {},
        successLabel: true,
        loadingLabel: false,
      };

    case ADD_LABEL_CONTACT_ITEM_ERROR:
      return {
        ...state,
        errorLabel: action.payload,
        successLabel: false,
        loadingLabel: false,
      };

    case ADD_LABEL_CONTACT_ITEM_CLEAN:
      return {
        ...state,
        errorLabel: {},
        successLabel: false,
        loadingLabel: false,
      };

    case GET_CONVERSATIONS_CONTACT_ITEM:
      return { ...state, loadedConversations: false };

    case GET_CONVERSATIONS_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        loadedConversations: true,
        conversations: action.payload.payload,
      };

    case GET_ATTRIBUTES_CONTACT_ITEM:
      return { ...state, loadedAttributes: true };

    case GET_ATTRIBUTES_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        loadedAttributes: true,
        attributes: action.payload,
      };

    case ADD_ATTRIBUTES_CONTACT_ITEM:
      return {
        ...state,
        errorAttributes: {},
        successAttributes: false,
        loadingAttributes: true,
      };

    case ADD_ATTRIBUTES_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        errorAttributes: {},
        successAttributes: true,
        loadingAttributes: false,
        item: action.payload.payload,
      };

    case ADD_ATTRIBUTES_CONTACT_ITEM_ERROR:
      return {
        ...state,
        errorAttributes: action.payload,
        successAttributes: false,
        loadingAttributes: false,
      };

    case ADD_ATTRIBUTES_CONTACT_ITEM_CLEAN:
      return {
        ...state,
        errorAttributes: {},
        successAttributes: false,
        loadingAttributes: false,
      };

    case DELETE_ATTRIBUTES_CONTACT_ITEM:
      return {
        ...state,
        errorAttributesDelete: {},
        successAttributesDelete: false,
        loadingAttributesDelete: true,
      };

    case DELETE_ATTRIBUTES_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        errorAttributesDelete: {},
        successAttributesDelete: true,
        loadingAttributesDelete: false,
        item: action.payload.payload,
      };

    case DELETE_ATTRIBUTES_CONTACT_ITEM_ERROR:
      return {
        ...state,
        errorAttributesDelete: action.payload,
        successAttributesDelete: false,
        loadingAttributesDelete: false,
      };

    case DELETE_ATTRIBUTES_CONTACT_ITEM_CLEAN:
      return {
        ...state,
        errorAttributesDelete: {},
        successAttributesDelete: false,
        loadingAttributesDelete: false,
      };

    case MERGE_CONTACT_ITEM:
      return {
        ...state,
        errorMerge: {},
        successMerge: false,
        loadingMerge: true,
      };

    case MERGE_CONTACT_ITEM_SUCCESS:
      return {
        ...state,
        errorMerge: {},
        successMerge: true,
        loadingMerge: false,
        // item: action.payload.payload,
      };

    case MERGE_CONTACT_ITEM_ERROR:
      return {
        ...state,
        errorMerge: action.payload,
        successMerge: false,
        loadingMerge: false,
      };

    case MERGE_CONTACT_ITEM_CLEAN:
      return {
        ...state,
        errorMerge: {},
        successMerge: false,
        loadingMerge: false,
      };

    case CONTACT_NEW_MESSAGE:
      return {
        ...state,
        newConversationDetails: [],
        errorNewMessage: {},
        successNewMessage: false,
        loadingNewMessage: true,
      };

    case CONTACT_NEW_MESSAGE_SUCCESS:
      return {
        ...state,
        newConversationDetails: action.payload,
        errorNewMessage: {},
        successNewMessage: true,
        loadingNewMessage: false,
      };

    case CONTACT_NEW_MESSAGE_ERROR:
      return {
        ...state,
        newConversationDetailsError: action.payload,
        errorNewMessage: {},
        successNewMessage: false,
        loadingNewMessage: false,
      };

    case CONTACT_NEW_MESSAGE_CLEAN:
      return {
        ...state,
        newConversationDetailsError: null,
        errorNewMessage: {},
        successNewMessage: false,
        loadingNewMessage: false,
      };

    case CONTACTABLE_INBOXES:
      return {
        ...state,
        contableInboxes: [],
      };

    case CONTACTABLE_INBOXES_SUCCESS:
      return {
        ...state,
        contableInboxes: action.payload,
      };

    case CONTACTABLE_INBOXES_ERROR:
      return {
        ...state,
        contableInboxes: [],
      };
    case GET_CONVERSATION_SEARCH_LIST:
      return { ...state, loadedContactsList: false };

    case GET_CONVERSATION_SEARCH_LIST_SUCCESS:
      return {
        ...state,
        loadedConversationsList: true,
        conversationSearchList: action.payload,
      };

    case GET_FILTER_CONTACTS_LIST_SUCCESS:
      return {
        ...state,
        contactFilterSuccess: action.payload,
      };

    case GET_FILTER_CONTACTS_LIST_FAILURE:
      return {
        ...state,
        contactFilterFailure: action.payload,
      };

    case CONTACT_FILTER_CLEAN_UP:
      return {
        ...state,
        error: {},
        savedCustomFilters: false,
        errorCustomFilter: {},
        deleteContactFiltersSuccess: false,
        deleteContactFiltersError: {},
      };

    case GET_CONTACTS_FILTERS_VALUE:
      return {
        ...state,
        contactsFilters: { filters: action.payload },
      };

    case SAVE_CONTACTS_FILTERS:
      return {
        ...state,
        savedCustomFilters: false,
        errorCustomFilter: {},
      };

    case SAVE_CONTACTS_FILTERS_SUCCESS:
      return {
        ...state,
        savedCustomFilters: true,
        errorCustomFilter: {},
        contactsFilters: { ...action.payload.filter },
        contactFilterSegment: [
          ...state?.contactFilterSegment,
          ...action.payload?.contactFilterSegment,
        ],
      };
    case SAVE_CONTACTS_FILTERS_ERROR:
      return {
        ...state,
        errrorCustomFilter: action.payload,
      };

    case GET_CONTACTS_FILTERS:
      return {
        ...state,
        contactsFiltersLoading: true,
        contactsFiltersSuccess: false,
        contactsFiltersError: {},
      };

    case GET_CONTACTS_FILTERS_SUCCESS:
      return {
        ...state,
        contactsFiltersLoading: false,
        contactsFiltersSuccess: true,
        contactFilterSegment: [...action.payload],
      };

    case GET_CONTACTS_FILTERS_ERROR:
      return {
        ...state,
        contactsFiltersLoading: false,
        contactsFiltersSuccess: false,
        contactsFiltersError: { ...action.payload },
      };

    case DELETE_CONTACTS_FILTERS:
      return {
        ...state,
        deleteContactFiltersSuccess: false,
        deleteContactFiltersError: {},
      };

    case DELETE_CONTACTS_FILTERS_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const { id } = action.payload.payload;
      // eslint-disable-next-line no-case-declarations
      const contactFilterList = state.contactFilterSegment.filter((data) => {
        if (data.id != id) {
          return data;
        }
      });
      return {
        ...state,
        deleteContactFiltersSuccess: true,
        deleteContactFiltersError: {},
        contactFilterSegment: [...contactFilterList],
      };

    case DELETE_CONTACTS_FILTERS_ERROR:
      return {
        ...state,
        deleteContactFiltersSuccess: false,
        deleteContactFiltersError: {},
      };

    case UPDATE_CONTACT_PRESENCE:
      // eslint-disable-next-line no-case-declarations
      const contacts = { ...state.contactsList };
      contacts?.payload?.forEach((element) => {
        if (
          action?.payload[element.id] &&
          Object.keys(action?.payload).includes(element.id)
        ) {
          contacts.payload[element].availability_status =
            action?.payload[element.id];
        } else {
          delete contacts?.payload[element.id]?.availability_status;
        }
      });
      return {
        ...state,
        loaded: true,
        contactsList: contacts,
      };

    case SET_CONTACTS:
      // eslint-disable-next-line no-case-declarations
      let contactList = state.contactsList?.payload;
      // eslint-disable-next-line no-case-declarations
      const contactIndex = contactList.findIndex(
        (contact) => contact.id === action.payload.id
      );

      if (contactIndex === -1) {
        contactList.push(action.payload);
      } else {
        contactList[contactIndex] = action.payload;
      }
      return {
        ...state,

        contactsList: {
          ...state.contactsList,
          payload: contactList,
        },
      };

    case DELETE_CONTACTS:
      // eslint-disable-next-line no-case-declarations
      let cList = state.contactsList?.payload;
      // eslint-disable-next-line no-case-declarations
      const deleteContactIndex = cList.findIndex(
        (contact) => contact.id === action.payload
      );
      if (deleteContactIndex !== -1) {
        cList.splice(deleteContactIndex, 1);
      }
      return {
        ...state,
        contactsList: {
          ...state.contactsList,
          payload: cList,
          meta: {
            ...state.contactsList.meta,
            count: state.contactsList.meta.count - 1,
          },
        },
      };
    case NEW_CONTACTS_LIST:
      // eslint-disable-next-line no-case-declarations
      let contactListPayload = state.contactsList?.payload;
      // eslint-disable-next-line no-case-declarations
      const contactPayloadIndex = contactListPayload.findIndex(
        (contact) => contact.id === action.payload.id
      );
      if (contactPayloadIndex === -1) {
        contactListPayload.push(action.payload);
      }
      return {
        ...state,
        contactsList: {
          ...state.contactsList,
          payload: contactListPayload,
          meta: {
            ...state.contactsList.meta,
            count: state.contactsList.meta.count + 1,
          },
        },
      };

    default:
      return { ...state };
  }
};
