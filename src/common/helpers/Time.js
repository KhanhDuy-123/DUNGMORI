import timezone from 'moment-timezone';
import Configs from 'utils/Configs';

require('moment/locale/vi');
const moment = require('moment');
moment.locale('vi');

function updateTimeLocate() {
  if (Configs.language === 'en') {
    require('moment/locale/en-gb');
    moment.locale('en');
  } else {
    require('moment/locale/vi');
    moment.locale('vi');
  }
}

function format(str, formatStr = 'YYYY-MM-DD') {
  var time = moment(str).format(formatStr);
  return time;
}

function timeStamp(str) {
  var time = moment(str).valueOf();
  return time;
}

function fromNow(str) {
  return moment(str).fromNow();
}

function formatTimeChat(str) {
  // Get time with GMT timezone
  var momentObjGMT = timezone.tz(str, 'YYYY-MM-DD HH:mm:ss', 'GMT');

  // Convert time to Bangkok timezone
  momentObjGMT = momentObjGMT.tz('Asia/Ho_Chi_Minh');

  // Gen to string from now
  var str = momentObjGMT.fromNow();
  return str;
}

function convertSecondToTime(second) {
  var timeStr = '00:00';
  try {
    var second = second % 60;
    var hour = Math.floor(second / 3600);
    const hourRedu = second / 3600 - hour;
    var min = Math.floor(Math.round(hourRedu * 3600) / 60);
    if (second < 60) {
      second = parseInt(second);
    }
    if (second < 10) {
      second = '0' + parseInt(second);
    }
    if (min < 10) {
      min = '0' + min;
    }
    timeStr = min + ':' + second;
  } catch (err) {
    console.log('ERROR', err);
  }
  return timeStr;
}

function convertTimeToHour(timeProgress) {
  var timeStr = '00:00:00';
  try {
    var second = timeProgress % 60;
    var hour = Math.floor(timeProgress / 3600);
    const hourRedu = timeProgress / 3600 - hour;
    var min = Math.floor(Math.round(hourRedu * 3600) / 60);
    if (second < 60) {
      second = parseInt(second);
    }
    if (second < 10) {
      second = '0' + parseInt(second);
    }
    if (min < 10) {
      min = '0' + min;
    }
    if (hour < 10) {
      hour = '0' + parseInt(hour);
    }
    timeStr = hour + ':' + min + ':' + second;
  } catch (err) {
    console.log('ERROR', err);
  }
  return timeStr;
}

export default { format, fromNow, formatTimeChat, timeStamp, convertSecondToTime, convertTimeToHour, updateTimeLocate };
