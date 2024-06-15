// import { CSAT_RATINGS } from '../../../../../shared/constants/messages';

import DOMPurify from 'dompurify';

import fromUnixTime from 'date-fns/fromUnixTime';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import MessageFormatter from './MessageFormatter';

export const getTimeFromTimeStamp = (timestamp) => {
  // const now = new Date();
  // return `${now.getHours()}:${now.getMinutes()}`;
  // const t = new Date();
  // t.setSeconds(timestamp);
  // return t.toISOString();

  // dynamicTime(time) {
  //     const unixTime = fromUnixTime(time);
  //     return formatDistanceToNow(unixTime, { addSuffix: true });
  //   },

  const unixTime = fromUnixTime(timestamp);
  return formatDistanceToNow(unixTime, { addSuffix: true });

  // const today = new Date();
  // today.setSeconds(timestamp);
  // let dd = today.getDate();
  // let mm = today.getMonth() + 1; // January is 0!

  // const yy = today.getFullYear() % 100;
  // if (dd < 10) {
  //     dd = `0${dd}`;
  // }
  // if (mm < 10) {
  //     mm = `0${mm}`;
  // }
  // return `${dd}/${mm}/${yy} ${today.getHours()}:${today.getMinutes()}`;
};
export const getUuid = () => {
  return 'xxxxxxxx4xxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generateInputSelectContent = (contentAttributes) => {
  const { submitted_values: submittedValues = [] } = contentAttributes;
  const [selectedOption] = submittedValues;

  if (selectedOption && selectedOption.title) {
    return `<strong>${selectedOption.title}</strong>`;
  }
  return '';
};

const generateInputEmailContent = (contentAttributes) => {
  const { submitted_email: submittedEmail = '' } = contentAttributes;
  if (submittedEmail) {
    return `<strong>${submittedEmail}</strong>`;
  }
  return '';
};

const generateFormContent = (contentAttributes, { noResponseText }) => {
  const { items, submitted_values: submittedValues = [] } = contentAttributes;
  if (submittedValues.length) {
    const submittedObject = submittedValues.reduce((acc, keyValuePair) => {
      acc[keyValuePair.name] = keyValuePair.value;
      return acc;
    }, {});
    let formMessageContent = '';
    items.forEach((item) => {
      formMessageContent += `<div>${item.label}</div>`;
      const response = submittedObject[item.name] || noResponseText;
      formMessageContent += `<strong>${response}</strong><br/><br/>`;
    });
    return formMessageContent;
  }
  return '';
};

export const CSAT_RATINGS = [
  {
    key: 'disappointed',
    emoji: '😞',
    value: 1,
    color: '#FDAD2A',
  },
  {
    key: 'expressionless',
    emoji: '😑',
    value: 2,
    color: '#FFC532',
  },
  {
    key: 'neutral',
    emoji: '😐',
    value: 3,
    color: '#FCEC56',
  },
  {
    key: 'grinning',
    emoji: '😀',
    value: 4,
    color: '#6FD86F',
  },
  {
    key: 'smiling',
    emoji: '😍',
    value: 5,
    color: '#44CE4B',
  },
];

const generateCSATContent = (
  contentAttributes,
  { ratingTitle, feedbackTitle }
) => {
  const {
    submitted_values: { csat_survey_response: surveyResponse = {} } = {},
  } = contentAttributes;
  const { rating, feedback_message: feedbackMessage } = surveyResponse || {};

  let messageContent = '';
  if (rating) {
    const [ratingObject = {}] = CSAT_RATINGS.filter(
      (csatRating) => csatRating.value === Number(rating)
    );
    messageContent += `<div><strong>${ratingTitle}</strong></div>`;
    messageContent += `<p>${ratingObject.emoji}</p>`;
  }
  // eslint-disable-next-line camelcase
  if (feedbackMessage) {
    messageContent += `<div><strong>${feedbackTitle}</strong></div>`;
    messageContent += `<p>${feedbackMessage}</p>`;
  }
  return messageContent;
};

export const generateBotMessageContent = (
  contentType,
  contentAttributes,
  {
    noResponseText = 'No response',
    csat: { ratingTitle = 'Rating', feedbackTitle = 'Feedback' } = {},
  } = {}
) => {
  const contentTypeMethods = {
    input_select: generateInputSelectContent,
    input_email: generateInputEmailContent,
    form: generateFormContent,
    input_csat: generateCSATContent,
  };

  const contentTypeMethod = contentTypeMethods[contentType];
  if (contentTypeMethod && typeof contentTypeMethod === 'function') {
    return contentTypeMethod(contentAttributes, {
      noResponseText,
      ratingTitle,
      feedbackTitle,
    });
  }
  return '';
};
export const MESSAGE_TYPE = {
  INCOMING: 0,
  OUTGOING: 1,
  ACTIVITY: 2,
  TEMPLATE: 3,
};

export const stripStyleCharacters = (message) => {
  // return message;
  return DOMPurify.sanitize(message, {
    FORBID_TAGS: ['style'],
    FORBID_ATTR: [
      'id',
      'class',
      'style',
      'bgcolor',
      'valign',
      'width',
      'face',
      'color',
      'height',
      'lang',
      'align',
      'size',
      'border',
    ],
  });
};

export const formatMessage = (message, isATweet) => {
  const messageFormatter = new MessageFormatter(message, isATweet);
  return messageFormatter.formattedMessage;
};

export const CREATE_FLOW = [
  {
    title: 'Choose Channel',
    route: 'settings_inbox_new',
    body: 'Choose the provider you want to integrate with Engage.',
  },
  {
    title: 'Create Inbox',
    route: 'settings_inboxes_page_channel',
    body: 'Authenticate your account and create an inbox.',
  },
  {
    title: 'Add Agents',
    route: 'settings_inboxes_add_agents',
    body: 'Add agents to the created inbox.',
  },
  {
    title: 'Voila!',
    route: 'settings_inbox_finish',
    body: 'You are all set to go!',
  },
];

export const onChangeDefault = (event, field, setFieldValue) => {
  let { value } = event.target;
  if (value === 'true') {
    value = true;
  } else if (value === 'false') {
    value = false;
  }
  setFieldValue(field, value);
};

export const ATTRIBUTE_MODELS = [
  {
    id: 0,
    option: 'Conversation',
    value: 'ATTRIBUTES_MGMT.TABS.CONVERSATION',
  },
  {
    id: 1,
    option: 'Contact',
    value: 'ATTRIBUTES_MGMT.TABS.CONTACT',
  },
];

export const ATTRIBUTE_TYPES = [
  {
    id: 0,
    option: 'Text',
  },
  {
    id: 1,
    option: 'Number',
  },
  {
    id: 4,
    option: 'Link',
  },
  {
    id: 5,
    option: 'Date',
  },
  {
    id: 6,
    option: 'List',
  },
  {
    id: 7,
    option: 'Checkbox',
  },
];

export const convertToSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '_');
};

export const enabledLanguages = [
  {
    name: 'English (en)',
    iso_639_1_code: 'en',
  },
  {
    name: 'العربية (ar)',
    iso_639_1_code: 'ar',
  },
  {
    name: 'Nederlands (nl) ',
    iso_639_1_code: 'nl',
  },
  {
    name: 'Français (fr)',
    iso_639_1_code: 'fr',
  },
  {
    name: 'Deutsch (de)',
    iso_639_1_code: 'de',
  },
  {
    name: 'Italiano (it)',
    iso_639_1_code: 'it',
  },
  {
    name: '日本語 (ja)',
    iso_639_1_code: 'ja',
  },
  {
    name: '한국어 (ko)',
    iso_639_1_code: 'ko',
  },
  {
    name: 'Português (pt)',
    iso_639_1_code: 'pt',
  },
  {
    name: 'русский (ru)',
    iso_639_1_code: 'ru',
  },
  {
    name: 'Español (es)',
    iso_639_1_code: 'es',
  },
  {
    name: 'മലയാളം (ml)',
    iso_639_1_code: 'ml',
  },
  {
    name: 'Català (ca)',
    iso_639_1_code: 'ca',
  },
  {
    name: 'ελληνικά (el)',
    iso_639_1_code: 'el',
  },
  {
    name: 'Português Brasileiro (pt-BR)',
    iso_639_1_code: 'pt_BR',
  },
  {
    name: 'Română (ro)',
    iso_639_1_code: 'ro',
  },
  {
    name: 'தமிழ் (ta)',
    iso_639_1_code: 'ta',
  },
  {
    name: 'فارسی (fa)',
    iso_639_1_code: 'fa',
  },
  {
    name: '中文 (台湾) (zh-TW)',
    iso_639_1_code: 'zh_TW',
  },
  {
    name: 'Tiếng Việt (vi)',
    iso_639_1_code: 'vi',
  },
  {
    name: 'dansk (da)',
    iso_639_1_code: 'da',
  },
  {
    name: 'Türkçe (tr)',
    iso_639_1_code: 'tr',
  },
  {
    name: 'čeština (cs)',
    iso_639_1_code: 'cs',
  },
  {
    name: 'suomi, suomen kieli (fi)',
    iso_639_1_code: 'fi',
  },
  {
    name: 'Bahasa Indonesia (id)',
    iso_639_1_code: 'id',
  },
  {
    name: 'Svenska (sv)',
    iso_639_1_code: 'sv',
  },
  {
    name: 'magyar nyelv (hu)',
    iso_639_1_code: 'hu',
  },
  {
    name: 'norsk (no)',
    iso_639_1_code: 'no',
  },
  {
    name: '中文 (zh-CN)',
    iso_639_1_code: 'zh_CN',
  },
  {
    name: 'język polski (pl)',
    iso_639_1_code: 'pl',
  },
  {
    name: 'slovenčina (sk)',
    iso_639_1_code: 'sk',
  },
];

export const listenForOutsideClicks = (
  listening,
  setListening,
  menuRef,
  setIsOpen
) => {
  // https://github.com/Pomax/react-onclickoutside
  return () => {
    if (listening) return;
    if (!menuRef.current) return;
    setListening(true);
    //   [`click`, `touchstart`].forEach((type) => {
    [`click`, `touchstart`].forEach((type) => {
      document.addEventListener(type, (evt) => {
        const cur = menuRef.current;
        const node = evt.target;
        if (!cur || cur.contains(node)) return;
        setIsOpen(false);
        // if (menuRef.current.contains(evt.target)) return;
        // setIsOpen(false);
      });
    });
  };
};

export const GROUP_BY_FILTER = {
  1: { id: 1, period: 'day' },
  2: { id: 2, period: 'week' },
  3: { id: 3, period: 'month' },
  4: { id: 4, period: 'year' },
};

export const calculateTrend = (accountSummary, metricKey) => {
  if (!accountSummary[metricKey]) return 0;
  if (!accountSummary.previous[metricKey]) return 0;
  return Math.round(
    ((accountSummary[metricKey] - accountSummary.previous[metricKey]) /
      accountSummary.previous[metricKey]) *
      100
  );
};
export const formatTime = (time) => {
  return time;
};
export const displayMetric = (accountSummary, metricKey) => {
  if (['avg_first_response_time', 'avg_resolution_time'].includes(metricKey)) {
    return formatTime(accountSummary[metricKey]);
  }
  return accountSummary[metricKey];
};

export const downloadCsvFile = (fileName, fileContent) => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = `data:text/csv;charset=utf-8,${encodeURI(fileContent)}`;
  link.click();
};
