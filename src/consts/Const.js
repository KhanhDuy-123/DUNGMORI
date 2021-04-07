import { Dimensions } from 'react-native';
import AppConst from './AppConst';
import UrlConst from './UrlConst';

const APP_KEY = AppConst.KEY;

const API = {
  USER: {
    LOGIN: 'user/login',
    LOGIN_SOCIAL: 'user/social-login',
    REGISTER: 'user/register',
    AUTO_LOGIN: 'user/auto-login',
    GET_MY_INFO: 'user/get-my-info',
    GET_MY_COURSE: 'user/get-my-course',
    CHANGE_INFO: 'user/change-info',
    CHECK_ACCOUNT_EXIST: 'user/check-account-exist',
    CREATE_PASSWORD: 'user/set-new-password',
    CHANGE_AVATAR: 'user/change-avatar',
    UPDATE_DEVICE: 'user/update-device',
    REMOVE_DEVICE_ID: 'user/remove-device',
    FORGOT_PASSWORD: 'user/forgot-password',
    VERIFY_FORGOT_PASSWORD: 'user/verify-forgot-password',
    VERYFY_OPT: 'user/verify-otp',
    USER_SETTING: 'user/update-setting',
    VERIFY_MY_SESSION: 'user/verify-my-session',
    ADD_SHARING_LOG: 'user/add-sharing-log'
  },
  HOME: {
    GET_COMBO: 'combo/get-list',
    GET_COMBO_COURSE: 'combo/get-courses',
    GET_LESSON: 'course/get-list-with-free-lesson',
    GET_ADVERTISEMENT: 'advertisement/get-list',
    GET_SETTING: 'get-app-setting',
    GET_FEEDBACK: 'feedback/get-list',
    GET_LIST_LESSON: 'get-list-lesson',
    GET_ALL_COURSE: 'get-list-course',
    GET_CURRENT_TIME_SERVER: 'get-current-time'
  },
  COMMENT: {
    GET_LIST: 'comment/get-list',
    GET_REPLY: 'comment/get-reply',
    ADD_COMMENT: 'comment/add',
    LIKE: 'comment/like',
    GET_LIKE: 'comment/get-like',
    DETLETE_COMENT: 'comment/delete',
    EDIT_COMENT: 'comment/edit',
    ADD_KAIWA_COMMENT: 'comment-kaiwa/add',
    GET_MY_LIST_KAIWA_COMMENT: 'comment/get-my-kaiwa',
    GET_LIST_COMMMENT_KAIWA: 'comment/get-kaiwa',
    GET_ALL_COMMMENT_KAIWA: 'comment/get-all-kaiwa'
  },
  LESSON: {
    GET_FEEDBACK: 'feedback/get-list',
    GET_LIST_LESSION: 'course/get-list-lessons',
    GET_LESSON_DETAIL: 'lesson/get-detail',
    SUBMIT_ANSWER: 'test/submit',
    GET_LESSON_INFO: 'lesson/get-info',
    UPDATE_PROGRESS_LESSON: 'lesson/update-progress',
    DELETE_TEST: 'test/delete',
    CHOOSE_SPECIAL_LESSON: 'course/choice-special-lessons',
    SPEECH_RECOGNIZE: 'speech/recognize',
    GET_VIDEO_QUESTION: 'lesson/get-video-question',
    GET_LESSON_LUYEN_DE: 'course/get-lessons-luyende',
    GET_RESULT_LUYEN_DE: 'course/get-result-luyende'
  },
  BLOG: {
    GET_BLOG: 'blog/get-blogs-by-category',
    GET_NEW_BLOG: 'blog/get-new-blogs',
    GET_SERIES: 'blog-series/get'
  },
  COURSE: {
    GET_COURSE: 'course/get',
    GET_STAGES: 'course/get-stages'
  },
  PROFILE: {
    GET_LIST_NOTIFY: 'notification/get-my-notification',
    GET_LIST_TEST: 'user/get-my-test',
    CHANGE_PASSWORD: 'user/change-password',
    GET_LIST_PAYMENT: 'invoice/get-list',
    UPDATE_STATUS_NOTIFY: 'notification/update-read-notification',
    GET_INFOR_PAYMENT: 'invoice/get',
    GET_TOTAL_NOTIFY: 'notification/check',
    UPDATE_VISIBLE_NOTIFY: 'notification/update-visible-notification',
    GET_POLICY_APP: 'page/get-list'
  },
  TEACHER: {
    GET_LIST_TEACHER: 'teacher/get-list',
    GET_INFO_TEACHER: 'teacher/get'
  },
  CONVERSATION: {
    GET_MESSAGE: 'conversation/get-message',
    UPLOAD_IMAGE: 'conversation/upload',
    GET_TEMPLATE_MESSAGE: 'conversation/get-template-message',
    MAKE_READED: 'conversation/make-readed'
  },
  SETTING: {
    GET_VIDEO_SERVER: 'setting/get-video-server',
    GET_PAYMENT_METHOD: 'setting/get-payment-method',
    MY_IP: 'https://api.myip.com/'
  },
  INVOICE: {
    CREATE_INVOICE: 'invoice/create',
    CREATE_IAP_INVOICE: 'invoice/iap-purchase'
  },
  ACTIVE_CODE: {
    GET_CAPTCHA: 'captcha',
    CODE_VOUCHER: 'voucher/active'
  },
  FLASHCARD: {
    UPDATE_FLASHCARD: 'flashcard/update'
  },
  BOOKING: {
    GET_BOOKING_KAIWA_REMAIN: 'kaiwa-booking/get-info',
    GET_BOOKING_KAIWA: 'kaiwa-booking/get',
    REGISTER_KAIWA: 'kaiwa-booking/register',
    CANCEL_BOOKING_KAIWA: 'kaiwa-booking/cancel'
  },
  TRY_DO_TEST: {
    GET_EXAM_INFO: 'get-exam-info',
    GET_CURRENT_TIME_SERVER: 'get-current-time',
    INIT_USER: 'init-user-data',
    SUBMIT_TEST: 'submit-exam',
    GET_HISTORY_TEST: 'my-history',
    GET_RANK_TEST: 'init-ranking',
    SEARCH_RANK_TEST: 'search-ranking',
    GET_LOCATES: 'get-locates'
  }
};

const DATA = {
  LAST_TIME_SHOW_RATING_DIALOG: 'LAST_TIME_SHOW_RATING_DIALOG',
  CAN_SHOW_RATING_DIALOG: 'CAN_SHOW_RATING_DIALOG',
  KEY_USER: 'KEY_USER',
  KEY_USER_TOKEN: 'KEY_USER_TOKEN',
  DEVICE_ID: 'DEVICE_ID',
  INFO_USER: 'INFO_USER',
  KEY_GET_STARTED_PRESSED: 'KEY_GET_STARTED_PRESSED',
  KEY_INTRODCUCING_APP: 'KEY_INTRODCUCING_APP',
  SHOW_INTRO_APP: 'SHOW_INTRO_APP',
  LESSON_PROGRESS: 'LESSON_PROGRESS',
  OLD_LESSON: 'OLD_LESSON',
  OLD_LESSON_NEW: 'OLD_LESSON_NEW',
  REMEMBER_FLASHCARD: 'REMEMBER_FLASHCARD',
  FINISH_FLASHCARD: 'FINISH_FLASHCARD',
  UNFINISH_FLASHCARD: 'UNFINISH_FLASHCARD',
  COUNT_NOTI_CHAT: 'COUNT_NOTI_CHAT',
  COUNT_NOTI: 'COUNT_NOTI',
  TRY_DO_TEST: 'TRY_DO_TEST',
  NOTIFY_TRY_TEST: 'NOTIFY_TRY_TEST',
  CHANGE_LANG: 'CHANGE_LANG',
  USER_LOGIN_INFO: 'USER_LOGIN_INFO',
  HISTORY_LESSON: 'HISTORY_LESSON',
  QUICKTEST_SETTING: 'QUICKTEST_SETTING',
  RESULT_CERTIFICATE: 'RESULT_CERTIFICATE'
};

const EVENT = {
  SHOW_IMAGE_ZOOM: 'SHOW_IMAGE_ZOOM',
  RECIEVE_NOTIFY: 'RECIEVE_NOTIFY',
  REVIEVE_NOTI_CHAT: 'REVIEVE_NOTI_CHAT',
  COUNT_NOTIFY: 'COUNT_NOTIFY',
  PRESS_NOTIFY_GO_TO_LESSON: 'PRESS_NOTIFY_GO_TO_LESSON'
};

const SOCIAL = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
  APPLE: 'apple'
};

const HISORY_TEST = 'HISORY_TEST';
const TYPE_SOUND_PLAYER = 'TYPE_SOUND_PLAYER';
const TYPE_VIEW_DUNGMORI = 'TYPE_VIEW_DUNGMORI';

const RESOURCE_URL = {
  COURSE: {
    DEFAULT: UrlConst.CDN + '/course/default/',
    SMALL: UrlConst.CDN + '/course/small/'
  },
  LESSON: {
    DEFAULT: UrlConst.CDN + '/lesson/default/',
    SMALL: UrlConst.CDN + '/lesson/small/'
  },
  ADVERTISE: {
    DEFAULT: UrlConst.CDN + '/qc/default/',
    SMALL: UrlConst.CDN + '/qc/small/'
  },
  AVATAR: {
    DEFAULT: UrlConst.CDN + '/avatar/default/',
    SMALL: UrlConst.CDN + '/avatar/small/'
  },
  BLOG: {
    DEFAULT: UrlConst.CDN + '/blog/default/',
    SMALL: UrlConst.CDN + '/blog/small/'
  },
  TEACHER: {
    DEFAULT: UrlConst.CDN + '/teacher/default/',
    DEFAULT_DETAIL: UrlConst.CDN + '/teacher_detail/default/',
    SMALL: UrlConst.CDN + '/teacher/small/'
  },
  COMMENT: {
    DEFAULT: UrlConst.CDN + '/comment/default/',
    SMALL: UrlConst.CDN + '/comment/small/',
    KAIWA: UrlConst.CDN + '/kaiwa/'
  },
  CONVERSATION: {
    DEFAULT: UrlConst.CDN + '/conversation/default/',
    SMALL: UrlConst.CDN + '/conversation/small/'
  },
  FEEDBACK: {
    DEFAULT: UrlConst.CDN + '/feedback/default/',
    SMALL: UrlConst.CDN + '/feedback/small/'
  },
  DOCUMENT: {
    PDF: UrlConst.CDN + '/pdf/',
    KAIWA: UrlConst.MP3
  },
  FLASHCARD: {
    // TOEDIT
    AUDIO: UrlConst.CDN + '/audio/',
    IMAGE: UrlConst.CDN + '/flashcard/default/'
  }
};

const VIDEO_CONFIG = {
  FILE_NAME: '/index.m3u8',
  SIZE: {
    WIDTH: 1280,
    HEIGHT: 720
  }
};

const COURSE_TYPE = {
  JLPT: 'jlpt',
  EJU: 'eju',
  KAIWA: 'kaiwa',
  LDKN: 'ldkn',
  LDTH: 'ldth'
};

var SCALE = Dimensions.get('window').width / 320; // 320 is width of ip 5;
if (SCALE >= 1.5) SCALE = 1.5;

const SCALE_WIDTH = Dimensions.get('window').width / 320;

const SCALE_HEIGHT = Dimensions.get('window').height / 528;

const EMOJI_LIST = `👍,👎,👌,👏,🤝,🙏,❤️,👺,😁,😂,🤣,😋,😛,😜,😍,😘,😙,🤗,🤔,😑,😮,😪,😴,😤,😳,😰,😱,😒,😓,😔,😷,🤒,🤢,☹️,😩,😢,😭,😠,😡,💔`;
const TABLE_NAME = {
  LESSON: 'lesson',
  COMBO: 'combo',
  COURSE: 'course',
  REPLY: 'reply',
  CHAT: 'chat',
  LIKE: 'like',
  INVOICE: 'invoice',
  KAIWA: 'kaiwa',
  FLASHCARD: 'flashcard',
  JLPT: 'jlpt',
  SALE: 'sale',
  BOOKING: 'booking',
  TIPS: 'tips'
};
const LESSON_TYPE = {
  DOCUMENT: 1,
  VIDEO: 2,
  MULTI_CHOISE_QUESTION: 3,
  ANSWER: 4,
  AUDIO: 5,
  KANJI_QUESTION: 6,
  KAIWA: 7,
  PDF: 8,
  FLASHCARD: 9,
  QUIZ_TEST: 10,
  VIDEO_QUESTION: 12,
  PICTURE_GUESS: 13
};
const TYPE_CARD = { UNFINISH: 'UNFINISH', FINISH: 'FINISH', ALL_VOCABULARY: 'ALL_VOCABULARY' };
const VIDEO_QUALITY = { '720p': '720p', '480p': '480p', '360p': '360p' };
const VIDEO_SPEED = { '0.75x': 0.75, '1x': 1.0, '1.25x': 1.25, '1.5x': 1.5, '2x': 2 };
const LANGUAGE = { EN: 'en', VI: 'vi' };
export default {
  LANGUAGE,
  APP_KEY,
  DATA,
  API,
  SOCIAL,
  EVENT,
  EMOJI_LIST,
  TYPE_SOUND_PLAYER,
  HISORY_TEST,
  RESOURCE_URL,
  TYPE_VIEW_DUNGMORI,
  VIDEO_CONFIG,
  SCALE,
  TABLE_NAME,
  SCALE_HEIGHT,
  COURSE_TYPE,
  LESSON_TYPE,
  VIDEO_QUALITY,
  VIDEO_SPEED,
  TYPE_CARD,
  SCALE_WIDTH,
  MIN_TIME_SHOW_ADDITION_COURSE: '2010-01-01', // 2021-01-23,
  COURSE_HAS_ADDITION_LIST: ['N3', 'N2', 'N1'] // ['N3', 'N2', 'N1']
};
