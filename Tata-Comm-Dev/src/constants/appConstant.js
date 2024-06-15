export const IMPORTUSER_UPLOAD_FILE_SIZE = 10;
export const CONTROL_GROUP_UPLOAD_FILE_SIZE = 50;
export const FULL_DATE_TIME_FORMAT = 'DD MMMM YYYY h:mm:ss a';
export const IMPORTUSER_UPLOAD_FILE_CHARACTER_LENGTH = 34;
export const COMMA_SEPERATED_FULL_DATE_TIME_FORMAT =
  'ddd, MMM Do YYYY, h:mm:ss a';
export const COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT = 'DD MMM YYYY h:mm a';
export const DATE_FORMAT_WITHOUT_TIME = 'YYYY-MM-DD';
export const DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY = 'DD MMMM YYYY';
export const TIME_FORMAT_WITHOUT_DATE = 'LT';
export const DATE_AND_TIME = 'MMM DD, hh:mm a';
export const htmlRegex = /<[^>]*>|&nbsp;|\s+/g;
export const htmlAndConsecutiveRegex = /(\s*<.*?>\s*|&nbsp;)+/g;
export const mentionsRegex = /\[@[\w\s]+\]\(mention:\/\/user\/\d+\/[\w\d%]+\)/g;
export const matchTextRegex = /@[\w\s]+/g;
export const EMAIL_PATTERN = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
export const BITS_TO_BYTES = 1024;
