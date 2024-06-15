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
  DETAILS_CONTACT_ITEM_CLEAN_BEFORE_LOAD,
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
  CONVERSATION_LABEL,
  CONVERSATION_LABEL_ERROR,
  CONVERSATION_LABEL_SUCCESS,
  CONTACT_NEW_MESSAGE,
  CONTACT_NEW_MESSAGE_SUCCESS,
  CONTACT_NEW_MESSAGE_ERROR,
  CONTACT_NEW_MESSAGE_CLEAN,
  CONTACTABLE_INBOXES,
  CONTACTABLE_INBOXES_ERROR,
  CONTACTABLE_INBOXES_SUCCESS,
  GET_CONVERSATION_SEARCH_LIST,
  GET_CONVERSATION_SEARCH_LIST_SUCCESS,
  GET_FILTER_CONTACTS_LIST_SUCCESS,
  GET_FILTER_CONTACTS_LIST_FAILURE,
  CONTACT_FILTER_CLEAN_UP,
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
} from '../constants';

export const setConversationsContactList = (item) => ({
  type: SET_CONVERSATIONS_CONTACT_LIST,
  payload: item,
});

export const getContactsList = (item) => ({
  type: GET_CONTACTS_LIST,
  payload: item,
});
export const getContactsListSuccess = (items) => ({
  type: GET_CONTACTS_LIST_SUCCESS,
  payload: items,
});

export const addContactItem = (item) => ({
  type: ADD_CONTACT_ITEM,
  payload: item,
});

export const addContactItemSuccess = (items) => ({
  type: ADD_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const addContactItemError = (error) => ({
  type: ADD_CONTACT_ITEM_ERROR,
  payload: error,
});

export const addContactItemClean = (item) => ({
  type: ADD_CONTACT_ITEM_CLEAN,
  payload: item,
});

export const deleteContactItem = (item) => ({
  type: DELETE_CONTACT_ITEM,
  payload: item,
});

export const deleteContactItemSuccess = (items) => ({
  type: DELETE_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const deleteContactItemError = (error) => ({
  type: DELETE_CONTACT_ITEM_ERROR,
  payload: error,
});

export const deleteContactItemClean = (item) => ({
  type: DELETE_CONTACT_ITEM_CLEAN,
  payload: item,
});

export const importContactItem = (item) => ({
  type: IMPORT_CONTACT_ITEM,
  payload: item,
});

export const importContactItemSuccess = (items) => ({
  type: IMPORT_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const importContactItemError = (error) => ({
  type: IMPORT_CONTACT_ITEM_ERROR,
  payload: error,
});

export const importContactItemClean = (item) => ({
  type: IMPORT_CONTACT_ITEM_CLEAN,
  payload: item,
});

// export const getLabelsContactItem = (item) => ({
//     type: GET_LABELS_CONTACT_ITEM,
//     payload: item,
// });

// export const getLabelsContactItemSuccess = (items) => ({
//     type: GET_LABELS_CONTACT_ITEM_SUCCESS,
//     payload: items,
// });

export const getLabelContactItem = (item) => ({
  type: GET_LABEL_CONTACT_ITEM,
  payload: item,
});

export const getLabelContactItemSuccess = (items) => ({
  type: GET_LABEL_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const detailsContactItem = (item) => ({
  type: DETAILS_CONTACT_ITEM,
  payload: item,
});

export const detailsContactItemSuccess = (items) => ({
  type: DETAILS_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const detailsContactItemError = (error) => ({
  type: DETAILS_CONTACT_ITEM_ERROR,
  payload: error,
});

export const detailsContactItemCleanBeforeLoad = (item) => ({
  type: DETAILS_CONTACT_ITEM_CLEAN_BEFORE_LOAD,
  payload: item,
});

export const getCommentsContactItem = (item) => ({
  type: GET_COMMENTS_CONTACT_ITEM,
  payload: item,
});

export const getCommentsContactItemSuccess = (items) => ({
  type: GET_COMMENTS_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const addCommentsContactItem = (item) => ({
  type: ADD_COMMENTS_CONTACT_ITEM,
  payload: item,
});

export const addCommentsContactItemSuccess = (items) => ({
  type: ADD_COMMENTS_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const addCommentsContactItemError = (error) => ({
  type: ADD_COMMENTS_CONTACT_ITEM_ERROR,
  payload: error,
});

export const addCommentsContactItemClean = (item) => ({
  type: ADD_COMMENTS_CONTACT_ITEM_CLEAN,
  payload: item,
});

export const addLabelContactItem = (item) => ({
  type: ADD_LABEL_CONTACT_ITEM,
  payload: item,
});

export const addLabelContactItemSuccess = (items) => ({
  type: ADD_LABEL_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const addLabelContactItemError = (error) => ({
  type: ADD_LABEL_CONTACT_ITEM_ERROR,
  payload: error,
});

export const addLabelContactItemClean = (item) => ({
  type: ADD_LABEL_CONTACT_ITEM_CLEAN,
  payload: item,
});

export const getConversationsContactItem = (item) => ({
  type: GET_CONVERSATIONS_CONTACT_ITEM,
  payload: item,
});

export const getConversationsContactItemSuccess = (items) => ({
  type: GET_CONVERSATIONS_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const getAttributesContactItem = (item) => ({
  type: GET_ATTRIBUTES_CONTACT_ITEM,
  payload: item,
});

export const getAttributesContactItemSuccess = (items) => ({
  type: GET_ATTRIBUTES_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const addAttributesContactItem = (item) => ({
  type: ADD_ATTRIBUTES_CONTACT_ITEM,
  payload: item,
});

export const addAttributesContactItemSuccess = (items) => ({
  type: ADD_ATTRIBUTES_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const addAttributesContactItemError = (error) => ({
  type: ADD_ATTRIBUTES_CONTACT_ITEM_ERROR,
  payload: error,
});

export const addAttributesContactItemClean = (item) => ({
  type: ADD_ATTRIBUTES_CONTACT_ITEM_CLEAN,
  payload: item,
});

export const deleteAttributesContactItem = (item) => ({
  type: DELETE_ATTRIBUTES_CONTACT_ITEM,
  payload: item,
});

export const deleteAttributesContactItemSuccess = (items) => ({
  type: DELETE_ATTRIBUTES_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const deleteAttributesContactItemError = (error) => ({
  type: DELETE_ATTRIBUTES_CONTACT_ITEM_ERROR,
  payload: error,
});

export const deleteAttributesContactItemClean = (item) => ({
  type: DELETE_ATTRIBUTES_CONTACT_ITEM_CLEAN,
  payload: item,
});

export const mergeContactItem = (item) => ({
  type: MERGE_CONTACT_ITEM,
  payload: item,
});

export const mergeContactItemSuccess = (items) => ({
  type: MERGE_CONTACT_ITEM_SUCCESS,
  payload: items,
});

export const mergeContactItemError = (error) => ({
  type: MERGE_CONTACT_ITEM_ERROR,
  payload: error,
});

export const mergeContactItemClean = (item) => ({
  type: MERGE_CONTACT_ITEM_CLEAN,
  payload: item,
});

export const conversationLabel = (item) => ({
  type: CONVERSATION_LABEL,
  payload: item,
});

export const conversationLabelSucess = (items) => ({
  type: CONVERSATION_LABEL_SUCCESS,
  payload: items,
});

export const conversationLabelError = (error) => ({
  type: CONVERSATION_LABEL_ERROR,
  payload: error,
});

export const contactNewMssage = (items) => ({
  type: CONTACT_NEW_MESSAGE,
  payload: items,
});

export const contactNewMessageSucess = (items) => ({
  type: CONTACT_NEW_MESSAGE_SUCCESS,
  payload: items,
});

export const contactNewMessageError = (error) => ({
  type: CONTACT_NEW_MESSAGE_ERROR,
  payload: error,
});
export const contactNewMessageClean = () => ({
  type: CONTACT_NEW_MESSAGE_CLEAN,
});

export const contactableInboxes = (items) => ({
  type: CONTACTABLE_INBOXES,
  payload: items,
});

export const contactableInboxesSucess = (items) => ({
  type: CONTACTABLE_INBOXES_SUCCESS,
  payload: items,
});

export const contactableInboxesError = (error) => ({
  type: CONTACTABLE_INBOXES_ERROR,
  payload: error,
});

export const getConversationSearchList = (item) => ({
  type: GET_CONVERSATION_SEARCH_LIST,
  payload: item,
});
export const getConversationSearchListSuccess = (items) => ({
  type: GET_CONVERSATION_SEARCH_LIST_SUCCESS,
  payload: items,
});

export const ContactFilter = (items) => ({
  type: GET_CONTACTS_FILTERS_VALUE,
  payload: items,
});

export const contactFilterSuccess = (items) => ({
  type: GET_FILTER_CONTACTS_LIST_SUCCESS,
  payload: items,
});

export const contactFilterFailure = (items) => ({
  type: GET_FILTER_CONTACTS_LIST_FAILURE,
  payload: items,
});

export const contactFilterCleanUp = () => ({
  type: CONTACT_FILTER_CLEAN_UP,
});

export const saveContactsFilters = (item) => ({
  type: SAVE_CONTACTS_FILTERS,
  payload: item,
});

export const saveContactsFiltersSuccess = (item) => ({
  type: SAVE_CONTACTS_FILTERS_SUCCESS,
  payload: item,
});

export const saveContactsFiltersError = (item) => ({
  type: SAVE_CONTACTS_FILTERS_ERROR,
  payload: item,
});

export const getContactsFilters = (item) => ({
  type: GET_CONTACTS_FILTERS,
  payload: item,
});

export const getContactsFiltersSuccess = (item) => ({
  type: GET_CONTACTS_FILTERS_SUCCESS,
  payload: item,
});

export const getContactsFiltersError = (item) => ({
  type: GET_CONTACTS_FILTERS_ERROR,
  payload: item,
});

export const deleteContactFilters = (item) => ({
  type: DELETE_CONTACTS_FILTERS,
  payload: item,
});

export const deleteContactFiltersSuccess = (item) => ({
  type: DELETE_CONTACTS_FILTERS_SUCCESS,
  payload: item,
});

export const deleteContactFiltersError = (item) => ({
  type: DELETE_CONTACTS_FILTERS_ERROR,
  payload: item,
});

export const updateContactPresence = (item) => ({
  type: UPDATE_CONTACT_PRESENCE,
  payload: item,
});

export const setContacts = (item) => ({
  type: SET_CONTACTS,
  payload: item,
});

export const deleteContacts = (item) => ({
  type: DELETE_CONTACTS,
  payload: item,
});

export const newConstactsList = (item) => ({
  type: NEW_CONTACTS_LIST,
  payload: item,
});
