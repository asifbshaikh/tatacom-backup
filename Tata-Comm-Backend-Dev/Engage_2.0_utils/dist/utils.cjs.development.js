'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isToday = _interopDefault(require('date-fns/isToday'));
var isYesterday = _interopDefault(require('date-fns/isYesterday'));

/**
 * @name Get contrasting text color
 * @description Get contrasting text color from a text color
 * @param bgColor  Background color of text.
 * @returns contrasting text color
 */

var getContrastingTextColor = function getContrastingTextColor(bgColor) {
  var color = bgColor.replace('#', '');
  var r = parseInt(color.slice(0, 2), 16);
  var g = parseInt(color.slice(2, 4), 16);
  var b = parseInt(color.slice(4, 6), 16); // http://stackoverflow.com/a/3943023/112731

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
};
/**
 * @name Get formatted date
 * @description Get date in today, yesterday or any other date format
 * @param date  date
 * @param todayText  Today text
 * @param yesterdayText  Yesterday text
 * @returns formatted date
 */

var formatDate = function formatDate(_ref) {
  var date = _ref.date,
      todayText = _ref.todayText,
      yesterdayText = _ref.yesterdayText;
  var dateValue = new Date(date);
  if (isToday(dateValue)) return todayText;
  if (isYesterday(dateValue)) return yesterdayText;
  return date;
};
/**
 * @name formatTime
 * @description Format time to Hour, Minute and Second
 * @param timeInSeconds  number
 * @returns formatted time
 */

var formatTime = function formatTime(timeInSeconds) {
  var formattedTime = '';

  if (timeInSeconds >= 60 && timeInSeconds < 3600) {
    var minutes = Math.floor(timeInSeconds / 60);
    formattedTime = minutes + " Min";
    var seconds = minutes === 60 ? 0 : Math.floor(timeInSeconds % 60);
    return formattedTime + ("" + (seconds > 0 ? ' ' + seconds + ' Sec' : ''));
  }

  if (timeInSeconds >= 3600 && timeInSeconds < 86400) {
    var hours = Math.floor(timeInSeconds / 3600);
    formattedTime = hours + " Hr";

    var _minutes = timeInSeconds % 3600 < 60 || hours === 24 ? 0 : Math.floor(timeInSeconds % 3600 / 60);

    return formattedTime + ("" + (_minutes > 0 ? ' ' + _minutes + ' Min' : ''));
  }

  if (timeInSeconds >= 86400) {
    var days = Math.floor(timeInSeconds / 86400);
    formattedTime = days + " Day";

    var _hours = timeInSeconds % 86400 < 3600 || days >= 364 ? 0 : Math.floor(timeInSeconds % 86400 / 3600);

    return formattedTime + ("" + (_hours > 0 ? ' ' + _hours + ' Hr' : ''));
  }

  return Math.floor(timeInSeconds) + " Sec";
};

exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.getContrastingTextColor = getContrastingTextColor;
//# sourceMappingURL=utils.cjs.development.js.map
