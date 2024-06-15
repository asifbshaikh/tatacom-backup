import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import axios from 'axios';

import {
  apiUrlNew,
  getHeaders,
  commonRequestException,
  apiUrlNewV3,
} from 'helpers/ApiHelper';

// import { getDateWithFormat } from 'helpers/Utils';

// import todoData from 'data/todos.json';
import {
  // TODO_GET_LIST,
  GET_CONTACTS_LIST,
  ADD_CONTACT_ITEM,
  DELETE_CONTACT_ITEM,
  IMPORT_CONTACT_ITEM,
  GET_LABEL_CONTACT_ITEM,
  DETAILS_CONTACT_ITEM,
  GET_COMMENTS_CONTACT_ITEM,
  ADD_COMMENTS_CONTACT_ITEM,
  ADD_LABEL_CONTACT_ITEM,
  GET_CONVERSATIONS_CONTACT_ITEM,
  GET_ATTRIBUTES_CONTACT_ITEM,
  ADD_ATTRIBUTES_CONTACT_ITEM,
  DELETE_ATTRIBUTES_CONTACT_ITEM,
  MERGE_CONTACT_ITEM,
  CONVERSATION_LABEL,
  CONTACT_NEW_MESSAGE,
  CONTACTABLE_INBOXES,
  GET_CONVERSATION_SEARCH_LIST,
  SAVE_CONTACTS_FILTERS,
  DELETE_CONTACTS_FILTERS,
  GET_CONTACTS_FILTERS,
} from '../constants';

import {
  getContactsListSuccess,
  addContactItemSuccess,
  addContactItemError,
  deleteContactItemSuccess,
  deleteContactItemError,
  importContactItemSuccess,
  importContactItemError,
  getLabelContactItemSuccess,
  detailsContactItemSuccess,
  detailsContactItemError,
  getCommentsContactItemSuccess,
  addCommentsContactItemSuccess,
  addCommentsContactItemError,
  addLabelContactItemSuccess,
  addLabelContactItemError,
  getConversationsContactItemSuccess,
  getAttributesContactItemSuccess,
  addAttributesContactItemSuccess,
  addAttributesContactItemError,
  deleteAttributesContactItemSuccess,
  deleteAttributesContactItemError,
  mergeContactItemSuccess,
  mergeContactItemError,
  conversationLabelSucess,
  conversationLabelError,
  contactNewMessageError,
  contactableInboxesSucess,
  contactNewMessageSucess,
  getConversationSearchListSuccess,
  contactFilterSuccess,
  contactFilterFailure,
  saveContactsFiltersError,
  saveContactsFiltersSuccess,
  deleteContactFiltersError,
  deleteContactFiltersSuccess,
  getContactsFiltersSuccess,
  getContactsFiltersError,
} from './actions';

/*
const getTodoListRequest = async () => {
  // eslint-disable-next-line no-return-await
  return await new Promise((success) => {
    setTimeout(() => {
      success(todoData.data);
    }, 1000);
  })
    .then((response) => response)
    .catch((error) => error);
};

function* getTodoListItems() {
  try {
    const response = yield call(getTodoListRequest);
    yield put(getTodoListSuccess(response));
  } catch (error) {
    yield put(getTodoListError(error));
  }
}
*/

const getContactsListRequest = async (param) => {
  let method = 'get';
  const {
    search,
    listingFilter,
    currentPage,
    selectedOrderOptionDir,
    selectedOrderOption,
  } = param;

  const searchUrl = search ? '/search' : '';
  let extraFilterStr = '';
  // const listingFilter = { labels: ['loss_of_card']};
  if (listingFilter) {
    if (
      typeof listingFilter.labels === 'object' &&
      listingFilter.labels.length &&
      listingFilter.labels[0] !== 'all'
    ) {
      extraFilterStr += `&labels[]=${listingFilter.labels.join(',')}`;
    }
  }
  if (search) {
    extraFilterStr += `&q=${search}`;
    extraFilterStr = extraFilterStr.replace('+', '');
  }

  if (param?.payload) {
    method = 'post';
    const payload = {
      payload: [...param.payload],
    };
    const apiUrlContact = `${apiUrlNew()}contacts${searchUrl}/filter?include_contact_inboxes=false&page=${currentPage}&sort=${
      selectedOrderOptionDir.column
    }${selectedOrderOption.column}${extraFilterStr}`;
    return axios[method](apiUrlContact, payload, {
      headers: getHeaders(),
    }).then((res) => {
      return res.data;
    });
  } else {
    const apiUrlContact = `${apiUrlNew()}contacts${searchUrl}?a=b&include_contact_inboxes=false&page=${currentPage}&sort=${
      selectedOrderOptionDir.column
    }${selectedOrderOption.column}${extraFilterStr}`;
    return axios[method](apiUrlContact, {
      headers: getHeaders(),
    }).then((res) => {
      return res.data;
    });
  }
};

function* getContactsList({ payload }) {
  try {
    const response = yield call(getContactsListRequest, payload);
    yield put(getContactsListSuccess(response));
    if (payload?.payload) {
      yield put(contactFilterSuccess(true));
      yield put(contactFilterFailure(false));
    }
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addContactItemError(errorMsg));
    if (payload?.payload) {
      yield put(contactFilterSuccess(false));
      yield put(contactFilterFailure(true));
    }
  }
}

const addContactItemRequest = async (item) => {
  const postData = {
    name: item.name,
    first_name: item.first_name,
    middle_name: item.middle_name,
    last_name: item.last_name,
    email: item.email,
    phone_number: item.phone_number,
    gender: item.gender,
    city: item.city,
    address: item.address,
    country: item.country,
    birth_date: item.birth_date,
    additional_attributes: {
      company_name: item.company_name,
      bio: item.bio,
      social_profiles: {
        github: item.github,
        twitter: item.twitter,
        facebook: item.facebook,
        linkedin: item.linkedin,
      },
    },
  };
  const itemIdStr = item.id ? `/${item.id}` : '';
  const method = item.id ? `patch` : 'post';
  return axios[method](`${apiUrlNew()}contacts${itemIdStr}`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* addContactItem({ payload }) {
  try {
    const response = yield call(addContactItemRequest, payload);
    yield put(addContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addContactItemError(errorMsg));
  }
}

const deleteContactItemRequest = async (postData) => {
  const method = 'delete';
  return axios[method](`${apiUrlNew()}contacts/${postData.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* deleteContactItem({ payload }) {
  try {
    const response = yield call(deleteContactItemRequest, payload);
    yield put(deleteContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteContactItemError(errorMsg));
  }
}

const importContactItemRequest = async (postData) => {
  const method = 'post';
  return axios[method](`${apiUrlNew()}contacts/import`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* importContactItem({ payload }) {
  try {
    const response = yield call(importContactItemRequest, payload);
    yield put(importContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(importContactItemError(errorMsg));
  }
}

const getLabelContactItemRequest = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}contacts/${param.id}/labels`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getLabelContactItem({ payload }) {
  try {
    const response = yield call(getLabelContactItemRequest, payload);
    yield put(getLabelContactItemSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const detailsContactItemRequest = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}contacts/${param.id}`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* detailsContactItem({ payload }) {
  try {
    const response = yield call(detailsContactItemRequest, payload);
    yield put(detailsContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(detailsContactItemError(errorMsg));
  }
}

const getCommentsContactItemRequest = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}contacts/${param.id}/notes`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getCommentsContactItem({ payload }) {
  try {
    const response = yield call(getCommentsContactItemRequest, payload);
    yield put(getCommentsContactItemSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addCommentsContactItemRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  return axios[method](
    `${apiUrlNew()}contacts/${postData.contact_id}/notes`,
    postData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* addCommentsContactItemNew({ payload }) {
  try {
    const response = yield call(addCommentsContactItemRequest, payload);
    yield put(addCommentsContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addCommentsContactItemError(errorMsg));
  }
}

const addLabelContactItemRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  return axios[method](
    `${apiUrlNew()}contacts/${postData.contact_id}/labels`,
    postData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* addLabelContactItem({ payload }) {
  try {
    const response = yield call(addLabelContactItemRequest, payload);
    yield put(addLabelContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addLabelContactItemError(errorMsg));
  }
}

const getConversationsContactItemRequest = async (param) => {
  const method = `get`;
  return axios[method](`${apiUrlNew()}contacts/${param.id}/conversations`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getConversationsContactItem({ payload }) {
  try {
    const response = yield call(getConversationsContactItemRequest, payload);
    yield put(getConversationsContactItemSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getAttributesContactItemRequest = async () => {
  const method = 'get';
  return axios[method](`${apiUrlNew()}custom_attribute_definitions`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* getAttributesContactItem({ payload }) {
  try {
    const response = yield call(getAttributesContactItemRequest, payload);
    yield put(getAttributesContactItemSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const addAttributesContactItemRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  return axios[method](
    `${apiUrlNew()}contacts/${postData.contact_id}`,
    postData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* addAttributesContactItem({ payload }) {
  try {
    const response = yield call(addAttributesContactItemRequest, payload);
    yield put(addAttributesContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(addAttributesContactItemError(errorMsg));
  }
}

const deleteAttributesContactItemRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  return axios[method](
    `${apiUrlNew()}contacts/${postData.contact_id}/destroy_custom_attributes`,
    postData,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* deleteAttributesContactItem({ payload }) {
  try {
    const response = yield call(deleteAttributesContactItemRequest, payload);
    yield put(deleteAttributesContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteAttributesContactItemError(errorMsg));
  }
}

const mergeContactItemRequest = async (postData) => {
  const method = postData.id ? `patch` : 'post';
  return axios[method](`${apiUrlNew()}actions/contact_merge`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* mergeContactItem({ payload }) {
  try {
    const response = yield call(mergeContactItemRequest, payload);
    yield put(mergeContactItemSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(mergeContactItemError(errorMsg));
  }
}

const contactNewConversationRequest = async (postData) => {
  const method = 'post';
  return axios[method](`${apiUrlNew()}conversations`, postData, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data;
  });
};

function* contactNewMssage({ payload }) {
  try {
    const response = yield call(contactNewConversationRequest, payload);
    yield put(contactNewMessageSucess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(contactNewMessageError(errorMsg));
  }
}

const addConversationLabelRequest = async (postData) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}conversations/${postData.id}/labels`,
    { labels: postData.labels },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* addConversationLabel({ payload }) {
  try {
    const response = yield call(addConversationLabelRequest, payload);
    yield put(conversationLabelSucess({ response, payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(conversationLabelError(errorMsg));
  }
}

const getContactableInboxesRequest = async (param) => {
  const method = 'get';
  return axios[method](`${apiUrlNewV3()}inboxes?channel_available=true`, {
    headers: getHeaders(),
  }).then((res) => {
    return res.data.payload;
  });
};

function* contactableInboxes({ payload }) {
  try {
    const response = yield call(getContactableInboxesRequest, payload);
    yield put(contactableInboxesSucess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const getConversationsSerachAsync = async ({ page, searchWord }) => {
  const method = 'get';
  const res = await axios[method](
    `${apiUrlNew()}conversations/search?q=${searchWord}&page=${page}`,
    {
      headers: getHeaders(),
    }
  );
  return res.data;
};

function* getConversationSearchList({ payload }) {
  try {
    const response = yield call(getConversationsSerachAsync, payload);
    yield put(getConversationSearchListSuccess(response));
  } catch (error) {
    commonRequestException(error);
  }
}

const saveContactsFilterRequest = async (payload) => {
  const method = 'post';
  return axios[method](
    `${apiUrlNew()}custom_filters`,
    { ...payload },
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* saveContactsFilters({ payload }) {
  try {
    const response = yield call(saveContactsFilterRequest, payload);
    const { query, ...rest } = response;
    yield put(
      saveContactsFiltersSuccess({
        filter: { filters: query, ...rest },
        contactFilterSegment: [response],
      })
    );
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(saveContactsFiltersError(errorMsg));
  }
}
9;

const getContactsFiltersAsync = async ({ filter_type }) => {
  const method = 'get';
  return axios[method](
    `${apiUrlNew()}custom_filters?filter_type=${filter_type}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* getContactsFilters({ payload }) {
  try {
    const response = yield call(getContactsFiltersAsync, payload);
    const { query, ...rest } = response;
    yield put(getContactsFiltersSuccess(response));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(getContactsFiltersError(errorMsg));
  }
}

const deleteContactsFiltersAsync = async ({ filter_type, id }) => {
  const method = 'delete';
  return axios[method](
    `${apiUrlNew()}custom_filters/${id}?filter_type=${filter_type}`,
    {
      headers: getHeaders(),
    }
  ).then((res) => {
    return res.data;
  });
};

function* deleteContactsFilters({ payload }) {
  try {
    const response = yield call(deleteContactsFiltersAsync, payload);
    yield put(deleteContactFiltersSuccess({ payload }));
  } catch (error) {
    const errorMsg = commonRequestException(error);
    yield put(deleteContactFiltersError(errorMsg));
  }
}

/*
export function* watchGetList() {
  yield takeEvery(TODO_GET_LIST, getTodoListItems);
}
*/
export function* watchGetContactsList() {
  yield takeEvery(GET_CONTACTS_LIST, getContactsList);
}

export function* watchAddItem() {
  yield takeEvery(ADD_CONTACT_ITEM, addContactItem);
}

export function* watchDeleteItem() {
  yield takeEvery(DELETE_CONTACT_ITEM, deleteContactItem);
}

export function* watchImportItem() {
  yield takeEvery(IMPORT_CONTACT_ITEM, importContactItem);
}

export function* watchLabelContactItem() {
  yield takeEvery(GET_LABEL_CONTACT_ITEM, getLabelContactItem);
}

export function* watchDetailsContactDetails() {
  yield takeEvery(DETAILS_CONTACT_ITEM, detailsContactItem);
}

export function* watchCommentsContactItem() {
  yield takeEvery(GET_COMMENTS_CONTACT_ITEM, getCommentsContactItem);
}

export function* watchAddLabelContactItem() {
  yield takeEvery(ADD_LABEL_CONTACT_ITEM, addLabelContactItem);
}

export function* watchcontactableInboxesItem() {
  yield takeEvery(CONTACTABLE_INBOXES, contactableInboxes);
}

// use as yield takeOneAndBlock(ADD_COMMENTS_CONTACT_ITEM, addCommentsContactItemNew)
// function* takeOneAndBlock(pattern, worker, ...args) {
//   const task = yield fork(function* () {
//     while (true) {
//       const action = yield take(pattern)
//       yield call(worker, ...args, action)
//     }
//   })
//   return task
// }

export function* watchAddCommentsContactItem() {
  // yield takeLeading(ADD_COMMENTS_CONTACT_ITEM, addCommentsContactItemNew);
  yield takeEvery(ADD_COMMENTS_CONTACT_ITEM, addCommentsContactItemNew);
}

export function* watchConversationsContactItem() {
  yield takeEvery(GET_CONVERSATIONS_CONTACT_ITEM, getConversationsContactItem);
}

export function* watchAttributesContactItem() {
  yield takeEvery(GET_ATTRIBUTES_CONTACT_ITEM, getAttributesContactItem);
  yield takeEvery(ADD_ATTRIBUTES_CONTACT_ITEM, addAttributesContactItem);
  yield takeEvery(DELETE_ATTRIBUTES_CONTACT_ITEM, deleteAttributesContactItem);
}

export function* watchMergeContactItem() {
  yield takeEvery(MERGE_CONTACT_ITEM, mergeContactItem);
}
export function* addConversationLabelItem() {
  yield takeEvery(CONVERSATION_LABEL, addConversationLabel);
}
export function* watchContactNewConversationItem() {
  yield takeEvery(CONTACT_NEW_MESSAGE, contactNewMssage);
}

export function* getConversationSearchListItem() {
  yield takeEvery(GET_CONVERSATION_SEARCH_LIST, getConversationSearchList);
}

export function* ContactFiltersItem() {
  yield takeEvery(SAVE_CONTACTS_FILTERS, saveContactsFilters);
  yield takeEvery(GET_CONTACTS_FILTERS, getContactsFilters);
  yield takeEvery(DELETE_CONTACTS_FILTERS, deleteContactsFilters);
}

export default function* rootSaga() {
  yield all([
    // fork(watchGetList),
    fork(watchGetContactsList),
    fork(watchAddItem),
    fork(watchDeleteItem),
    fork(watchImportItem),
    fork(watchLabelContactItem),
    fork(watchDetailsContactDetails),
    fork(watchCommentsContactItem),
    fork(watchAddCommentsContactItem),
    fork(watchAddLabelContactItem),
    fork(watchConversationsContactItem),
    fork(watchAttributesContactItem),
    fork(watchMergeContactItem),
    fork(addConversationLabelItem),
    fork(watchContactNewConversationItem),
    fork(watchcontactableInboxesItem),
    fork(getConversationSearchListItem),
    fork(ContactFiltersItem),
  ]);
}
